#!/usr/bin/env python3
"""Operator CLI: admin users, content import/export, backup and restore.

Reads PORTFOLIO_DB / PORTFOLIO_MEDIA_DIR / PORTFOLIO_PUBLIC_URL from the environment
(the same variables as the server; PORTFOLIO_SECRET is not needed here).
"""
from __future__ import annotations

import argparse
import getpass
import json
import os
import shutil
import sqlite3
import sys
import tarfile
import urllib.request
from urllib.parse import urlparse
from datetime import datetime
from pathlib import Path
from typing import Any

from pydantic import ValidationError

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app import auth, db, images, services  # noqa: E402
from app.config import Settings  # noqa: E402
from app.schemas import Profile, ProjectIn, format_errors  # noqa: E402

KEEP_BACKUPS = 14
DOWNLOAD_TIMEOUT = 20


class CliError(Exception):
    pass


def _settings() -> Settings:
    return Settings.from_env(require_secret=False)


# ----- users ---------------------------------------------------------------------------------

def _read_password() -> str:
    if sys.stdin.isatty():
        pw = getpass.getpass("Password: ")
        if getpass.getpass("Repeat password: ") != pw:
            raise CliError("Passwords do not match")
    else:
        pw = sys.stdin.readline().rstrip("\r\n")
    if len(pw) < auth.MIN_PASSWORD_LEN:
        raise CliError(f"Password must be at least {auth.MIN_PASSWORD_LEN} characters")
    return pw


def cmd_create_admin(args: argparse.Namespace) -> int:
    settings = _settings()
    email = args.email.strip().lower()
    if "@" not in email:
        raise CliError("Invalid e-mail address")
    pw = _read_password()
    db.init_db(settings.db_path)
    conn = db.connect(settings.db_path)
    try:
        if conn.execute("SELECT 1 FROM users WHERE email = ?", (email,)).fetchone():
            raise CliError(f"{email} already exists (use set-password)")
        with conn:
            conn.execute("INSERT INTO users(email, pass_hash, created_at) VALUES (?,?,?)",
                         (email, auth.hash_password(pw), db.utcnow()))
            db.audit(conn, "cli", "user.create", email)
    finally:
        conn.close()
    print(f"Created admin {email}")
    return 0


def cmd_set_password(args: argparse.Namespace) -> int:
    settings = _settings()
    email = args.email.strip().lower()
    pw = _read_password()
    db.init_db(settings.db_path)
    conn = db.connect(settings.db_path)
    try:
        with conn:
            cur = conn.execute("UPDATE users SET pass_hash = ? WHERE email = ?", (auth.hash_password(pw), email))
            if cur.rowcount == 0:
                raise CliError(f"No such user: {email}")
            db.audit(conn, "cli", "user.set_password", email)
    finally:
        conn.close()
    print(f"Password updated for {email} (existing tokens stay valid until they expire; "
          "rotate PORTFOLIO_SECRET to invalidate them)")
    return 0


# ----- import / export -----------------------------------------------------------------------

def _load_source(spec_key: str, is_url: bool, media_root: Path | None, limit: int) -> bytes:
    if is_url:
        if not spec_key.lower().startswith(("http://", "https://")):
            raise CliError(f"Unsupported URL: {spec_key}")
        req = urllib.request.Request(spec_key, headers={"User-Agent": "portfolio-import"})
        with urllib.request.urlopen(req, timeout=DOWNLOAD_TIMEOUT) as resp:
            data = resp.read(limit + 1)
    else:
        path = Path(spec_key)
        if not path.is_absolute():
            path = (media_root or Path.cwd()) / path
        with open(path, "rb") as fh:
            data = fh.read(limit + 1)
    if len(data) > limit:
        raise CliError(f"{spec_key}: file is larger than {limit // (1024 * 1024)} MB")
    return data


def _source_name(key: str, is_url: bool) -> str:
    """The identity of an image for idempotent re-imports: its original file name."""
    path = urlparse(key).path if is_url else key.replace("\\", "/")
    return path.rstrip("/").rsplit("/", 1)[-1] or key


def _image_specs(project: dict[str, Any]) -> list[dict[str, Any]]:
    if project.get("images"):
        return list(project["images"])
    # An /api/export or `export` file: re-import its gallery by URL.
    cover = project.get("cover") or {}
    return [{"url": g["url"], "alt": g.get("alt", ""), "cover": g.get("id") == cover.get("id")}
            for g in project.get("gallery") or [] if g.get("url")]


def _sync_images(conn: sqlite3.Connection, settings: Settings, project_id: int, specs: list[dict[str, Any]],
                 media_root: Path | None, replace: bool) -> int:
    """Returns the number of images that failed to load."""
    existing = conn.execute("SELECT * FROM media WHERE project_id = ?", (project_id,)).fetchall()
    by_source = {m["source"]: m for m in existing if m["source"]}
    keep: list[int] = []
    cover_id: int | None = None
    failures = 0
    seen_names: set[str] = set()
    for n, spec in enumerate(specs, start=1):
        is_url = bool(spec.get("url")) and not spec.get("path")
        key = str(spec.get("path") or spec.get("url") or "")
        if not key:
            continue
        name = _source_name(key, is_url)
        if name in seen_names:
            print(f"  ! {key}: duplicate file name '{name}' in one project, skipped", file=sys.stderr)
            failures += 1
            continue
        seen_names.add(name)
        alt = str(spec.get("alt") or "")[:300]
        if name in by_source:  # imported before: do not add it again, just refresh alt/order
            mid = by_source[name]["id"]
            with conn:
                conn.execute("UPDATE media SET alt = ?, sort = ? WHERE id = ?", (alt, n * 10, mid))
        else:
            try:
                data = _load_source(key, is_url, media_root, settings.max_image_bytes)
                processed = images.process_image(data)
            except (CliError, images.ImageError, OSError, ValueError) as exc:
                print(f"  ! {key}: {exc}", file=sys.stderr)
                failures += 1
                continue
            file, thumb = images.store_image(settings.media_dir, processed)
            with conn:
                cur = conn.execute(
                    "INSERT INTO media(project_id, file, thumb, width, height, bytes, alt, sort, created_at, source) "
                    "VALUES (?,?,?,?,?,?,?,?,?,?)",
                    (project_id, file, thumb, processed.width, processed.height, len(processed.full), alt,
                     n * 10, db.utcnow(), name))
            mid = int(cur.lastrowid)
        keep.append(mid)
        if spec.get("cover"):
            cover_id = mid

    if replace:
        for m in existing:
            if m["id"] not in keep:
                with conn:
                    conn.execute("DELETE FROM media WHERE id = ?", (m["id"],))
                images.remove_files(settings.media_dir, [m["file"], m["thumb"]])
    cur_cover = conn.execute("SELECT cover_media_id FROM projects WHERE id = ?", (project_id,)).fetchone()[0]
    if cover_id is None and cur_cover is None and keep:
        cover_id = keep[0]
    if cover_id is not None and cover_id != cur_cover:
        with conn:
            conn.execute("UPDATE projects SET cover_media_id = ? WHERE id = ?", (cover_id, project_id))
    return failures


def cmd_import(args: argparse.Namespace) -> int:
    settings = _settings()
    with open(args.file, encoding="utf-8") as fh:
        doc = json.load(fh)
    if not isinstance(doc, dict):
        raise CliError("Seed file must be a JSON object: {profile, projects:[...]}")
    media_root = Path(args.media_root) if args.media_root else Path(args.file).resolve().parent

    # Validate everything before touching the database.
    profile = None
    if doc.get("profile") is not None:
        try:
            profile = Profile.model_validate(doc["profile"])
        except ValidationError as exc:
            raise CliError(f"profile: {format_errors(exc.errors())}") from None
    validated: list[tuple[ProjectIn, dict[str, Any]]] = []
    seen: set[str] = set()
    for i, raw in enumerate(doc.get("projects") or []):
        raw = dict(raw)
        raw.setdefault("status", "published")  # an explicit import means "publish this"
        try:
            data = ProjectIn.model_validate(raw)
        except ValidationError as exc:
            raise CliError(f"projects[{i}] ({raw.get('slug', '?')}): {format_errors(exc.errors())}") from None
        if data.slug in seen:
            raise CliError(f"Duplicate slug in seed file: {data.slug}")
        seen.add(data.slug)
        validated.append((data, raw))

    db.init_db(settings.db_path)
    settings.media_dir.mkdir(parents=True, exist_ok=True)
    conn = db.connect(settings.db_path)
    created = updated = deleted = failures = 0
    try:
        if profile is not None:
            with conn:
                services.save_profile(conn, profile)
                db.audit(conn, "cli", "import.profile", "profile")
        for data, raw in validated:
            row = conn.execute("SELECT id, priority, published_at FROM projects WHERE slug = ?",
                               (data.slug,)).fetchone()
            with conn:
                if row is None:
                    pid = services.insert_project(conn, data)
                    created += 1
                else:
                    pid = row["id"]
                    services.update_project(conn, pid, data, row["priority"], row["published_at"])
                    updated += 1
                db.audit(conn, "cli", "import.project", f"project:{pid}:{data.slug}")
            failures += _sync_images(conn, settings, pid, _image_specs(raw), media_root, args.replace)
        if args.replace:
            for row in conn.execute("SELECT id, slug FROM projects").fetchall():
                if row["slug"] in seen:
                    continue
                files: list[str] = []
                for m in conn.execute("SELECT file, thumb FROM media WHERE project_id = ?", (row["id"],)):
                    files += [m["file"], m["thumb"]]
                with conn:
                    conn.execute("DELETE FROM projects WHERE id = ?", (row["id"],))
                    db.audit(conn, "cli", "import.delete", f"project:{row['id']}:{row['slug']}")
                images.remove_files(settings.media_dir, files)
                deleted += 1
    finally:
        conn.close()
    print(f"Imported: {created} created, {updated} updated, {deleted} deleted, {failures} image failure(s)")
    return 2 if failures else 0


def cmd_export(args: argparse.Namespace) -> int:
    settings = _settings()
    db.init_db(settings.db_path)
    conn = db.connect(settings.db_path)
    try:
        data = services.export_data(conn, settings, include_drafts=not args.published_only)
    finally:
        conn.close()
    Path(args.out).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Exported {len(data['projects'])} project(s) to {args.out}")
    return 0


# ----- backup / restore ----------------------------------------------------------------------

def _prune(dest: Path, pattern: str, keep: int) -> None:
    files = sorted(dest.glob(pattern))  # timestamped names sort chronologically
    for old in files[:-keep] if keep > 0 else files:
        old.unlink()


def cmd_backup(args: argparse.Namespace) -> int:
    settings = _settings()
    if not settings.db_path.exists():
        raise CliError(f"Database not found: {settings.db_path}")
    dest = Path(args.dest)
    dest.mkdir(parents=True, exist_ok=True)
    try:
        os.chmod(dest, 0o700)
    except OSError:
        pass
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    db_out = dest / f"portfolio-{stamp}.db"
    tar_out = dest / f"media-{stamp}.tar.gz"
    if db_out.exists() or tar_out.exists():
        raise CliError(f"Backup {stamp} already exists; retry in a second")

    src = sqlite3.connect(str(settings.db_path))
    dst = sqlite3.connect(str(db_out))
    try:
        src.backup(dst)  # consistent snapshot, safe while the service is running
        dst.execute("PRAGMA journal_mode = DELETE")  # single self-contained file
    finally:
        dst.close()
        src.close()
    with tarfile.open(tar_out, "w:gz") as tar:
        if settings.media_dir.exists():
            tar.add(settings.media_dir, arcname="media")
    for p in (db_out, tar_out):
        try:
            os.chmod(p, 0o600)
        except OSError:
            pass
    _prune(dest, "portfolio-*.db", KEEP_BACKUPS)
    _prune(dest, "media-*.tar.gz", KEEP_BACKUPS)
    print(f"Backup written: {db_out.name}, {tar_out.name} in {dest}")
    return 0


def _check_backup_db(path: Path) -> None:
    if not path.is_file():
        raise CliError(f"Not a file: {path}")
    try:
        conn = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
        try:
            result = conn.execute("PRAGMA integrity_check").fetchall()
            tables = {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        finally:
            conn.close()
    except sqlite3.Error as exc:
        raise CliError(f"{path} is not a usable SQLite database: {exc}") from None
    if result != [("ok",)]:
        raise CliError(f"integrity_check failed for {path}: {result[:3]}")
    if not {"projects", "schema_migrations"} <= tables:
        raise CliError(f"{path} does not look like a portfolio database")


def _restore_media(tar_path: Path, media_dir: Path) -> None:
    staging = media_dir.with_name(media_dir.name + ".restoring")
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)
    try:
        with tarfile.open(tar_path, "r:gz") as tar:
            for member in tar.getmembers():
                if member.name != "media" and not member.name.startswith("media/"):
                    raise CliError(f"Unexpected path in media archive: {member.name}")
            tar.extractall(staging, filter="data")
        extracted = staging / "media"
        if not extracted.is_dir():
            raise CliError("Media archive does not contain a media/ directory")
        old = media_dir.with_name(media_dir.name + ".pre-restore")
        if media_dir.exists():
            if old.exists():
                shutil.rmtree(old)
            os.replace(media_dir, old)
        os.replace(extracted, media_dir)
        try:
            os.chmod(media_dir, 0o755)
        except OSError:
            pass
    finally:
        shutil.rmtree(staging, ignore_errors=True)


def cmd_restore(args: argparse.Namespace) -> int:
    if not args.yes:
        raise CliError("Refusing to restore without --yes. This replaces the live database. Stop the service "
                       "first: systemctl stop portfolio-api (see deploy/restore.md)")
    settings = _settings()
    src = Path(args.db)
    _check_backup_db(src)
    if args.media and not Path(args.media).is_file():
        raise CliError(f"Not a file: {args.media}")

    target = settings.db_path
    target.parent.mkdir(parents=True, exist_ok=True)
    os.umask(0o077)  # the staged copy holds password hashes and messages: never group/world readable, not even briefly
    staged = target.with_name(target.name + ".restoring")
    shutil.copyfile(src, staged)
    for suffix in ("-wal", "-shm"):  # stale WAL files would be replayed onto the restored db
        sibling = target.with_name(target.name + suffix)
        if sibling.exists():
            sibling.unlink()
    if target.exists():
        os.replace(target, target.with_name(target.name + ".pre-restore"))
    os.replace(staged, target)
    try:
        os.chmod(target, 0o600)
    except OSError:
        pass
    db.init_db(target)  # bring an older backup up to the current schema
    print(f"Database restored from {src} (previous kept as {target.name}.pre-restore)")
    if args.media:
        _restore_media(Path(args.media), settings.media_dir)
        print(f"Media restored from {args.media} (previous kept as {settings.media_dir.name}.pre-restore)")
    print("Start the service again: systemctl start portfolio-api")
    return 0


# ----- entry point ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="cli.py", description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("create-admin", help="create an admin user (password from stdin / prompt)")
    p.add_argument("--email", required=True)
    p.set_defaults(func=cmd_create_admin)

    p = sub.add_parser("set-password", help="change an admin's password (password from stdin / prompt)")
    p.add_argument("--email", required=True)
    p.set_defaults(func=cmd_set_password)

    p = sub.add_parser("import", help="import {profile, projects:[...]} from a JSON seed file")
    p.add_argument("--file", required=True)
    p.add_argument("--media-root", help="base directory for relative image paths (default: the seed file's folder)")
    p.add_argument("--replace", action="store_true",
                   help="also delete projects not in the file and images not listed for imported projects")
    p.set_defaults(func=cmd_import)

    p = sub.add_parser("export", help="write the same shape as GET /api/export to a file")
    p.add_argument("--out", required=True)
    p.add_argument("--published-only", action="store_true", help="omit drafts (default: include everything)")
    p.set_defaults(func=cmd_export)

    p = sub.add_parser("backup", help="snapshot the database and media directory into a folder")
    p.add_argument("--dest", required=True)
    p.set_defaults(func=cmd_backup)

    p = sub.add_parser("restore", help="restore a database (and optionally media) from a backup; stop the service first")
    p.add_argument("--db", required=True)
    p.add_argument("--media")
    p.add_argument("--yes", action="store_true")
    p.set_defaults(func=cmd_restore)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return args.func(args)
    except CliError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
