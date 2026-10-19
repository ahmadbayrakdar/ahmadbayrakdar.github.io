import io
import json
import sqlite3
import tarfile

import pytest
from PIL import Image

import cli
from app import db

from conftest import png_bytes


@pytest.fixture
def env(tmp_path, monkeypatch):
    monkeypatch.setenv("PORTFOLIO_DB", str(tmp_path / "data" / "portfolio.db"))
    monkeypatch.setenv("PORTFOLIO_MEDIA_DIR", str(tmp_path / "data" / "media"))
    monkeypatch.setenv("PORTFOLIO_PUBLIC_URL", "https://portfolio-api.test")
    monkeypatch.delenv("PORTFOLIO_SECRET", raising=False)
    return tmp_path


def run(*argv):
    return cli.main([str(a) for a in argv])


def count(env, table):
    conn = sqlite3.connect(env / "data" / "portfolio.db")
    try:
        return conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    finally:
        conn.close()


@pytest.fixture
def seed(env):
    (env / "seed").mkdir()
    (env / "seed" / "a.png").write_bytes(png_bytes(120, 80))
    (env / "seed" / "b.png").write_bytes(png_bytes(100, 100, color=(0, 0, 255)))
    doc = {
        "profile": {"name": "Ahmad", "headline": "Engineer"},
        "projects": [
            {"slug": "first", "title": "First", "category": "SaaS & Platforms", "kind": "Product",
             "featured": True, "images": [{"path": "a.png", "alt": "A"}, {"path": "b.png", "alt": "B", "cover": True}]},
            {"slug": "second", "title": "Second", "status": "draft"},
        ],
    }
    path = env / "seed" / "seed.json"
    path.write_text(json.dumps(doc), encoding="utf-8")
    return path


def test_create_admin_and_set_password(env, monkeypatch):
    monkeypatch.setattr("sys.stdin", io.StringIO("a very long password\n"))
    assert run("create-admin", "--email", "Me@Example.com") == 0
    assert count(env, "users") == 1
    monkeypatch.setattr("sys.stdin", io.StringIO("another long password\n"))
    assert run("create-admin", "--email", "me@example.com") == 1  # duplicate
    monkeypatch.setattr("sys.stdin", io.StringIO("short\n"))
    assert run("set-password", "--email", "me@example.com") == 1  # too short
    monkeypatch.setattr("sys.stdin", io.StringIO("brand new password!\n"))
    assert run("set-password", "--email", "me@example.com") == 0
    conn = sqlite3.connect(env / "data" / "portfolio.db")
    h = conn.execute("SELECT pass_hash FROM users").fetchone()[0]
    conn.close()
    from app import auth
    assert auth.verify_password("brand new password!", h)


def test_import_is_idempotent(env, seed):
    assert run("import", "--file", seed, "--media-root", seed.parent) == 0
    counts = (count(env, "projects"), count(env, "media"))
    assert counts == (2, 2)
    conn = sqlite3.connect(env / "data" / "portfolio.db")
    ids = [r[0] for r in conn.execute("SELECT id FROM projects ORDER BY slug")]
    cover = conn.execute("SELECT m.alt FROM projects p JOIN media m ON m.id = p.cover_media_id "
                         "WHERE p.slug = 'first'").fetchone()[0]
    conn.close()
    assert cover == "B"
    n_files = len(list((env / "data" / "media").iterdir()))

    assert run("import", "--file", seed, "--media-root", seed.parent) == 0
    assert (count(env, "projects"), count(env, "media")) == counts
    assert len(list((env / "data" / "media").iterdir())) == n_files
    conn = sqlite3.connect(env / "data" / "portfolio.db")
    assert [r[0] for r in conn.execute("SELECT id FROM projects ORDER BY slug")] == ids  # ids kept
    conn.close()


def test_import_updates_existing_and_replace_deletes_others(env, seed):
    run("import", "--file", seed, "--media-root", seed.parent)
    doc = json.loads(seed.read_text())
    doc["projects"] = [{"slug": "first", "title": "First (edited)", "images": [{"path": "a.png", "alt": "only"}]}]
    seed.write_text(json.dumps(doc))
    assert run("import", "--file", seed, "--media-root", seed.parent) == 0
    assert count(env, "projects") == 2 and count(env, "media") == 2  # additive by default
    assert run("import", "--file", seed, "--media-root", seed.parent, "--replace") == 0
    assert count(env, "projects") == 1 and count(env, "media") == 1
    assert len(list((env / "data" / "media").iterdir())) == 2  # 1 image + its thumb
    conn = sqlite3.connect(env / "data" / "portfolio.db")
    assert conn.execute("SELECT title FROM projects").fetchone()[0] == "First (edited)"
    conn.close()


def test_import_rejects_invalid_seed_without_writing(env, seed):
    doc = json.loads(seed.read_text())
    doc["projects"].append({"slug": "Bad Slug", "title": "x"})
    seed.write_text(json.dumps(doc))
    assert run("import", "--file", seed) == 1
    assert not (env / "data" / "portfolio.db").exists() or count(env, "projects") == 0


def test_import_reports_missing_image(env, seed):
    doc = json.loads(seed.read_text())
    doc["projects"][0]["images"].append({"path": "missing.png"})
    seed.write_text(json.dumps(doc))
    assert run("import", "--file", seed, "--media-root", seed.parent) == 2
    assert count(env, "projects") == 2 and count(env, "media") == 2


def test_export_roundtrip_shape(env, seed):
    run("import", "--file", seed, "--media-root", seed.parent)
    out = env / "export.json"
    assert run("export", "--out", out) == 0
    data = json.loads(out.read_text(encoding="utf-8"))
    assert set(data) == {"profile", "projects", "generated_at"}
    assert {p["slug"] for p in data["projects"]} == {"first", "second"}  # drafts included by default
    first = next(p for p in data["projects"] if p["slug"] == "first")
    assert len(first["gallery"]) == 2 and first["cover"]["alt"] == "B"
    assert first["gallery"][0]["url"].startswith("https://portfolio-api.test/media/")
    assert run("export", "--out", out, "--published-only") == 0
    assert [p["slug"] for p in json.loads(out.read_text(encoding="utf-8"))["projects"]] == ["first"]


def test_backup_restore_roundtrip(env, seed, capsys):
    run("import", "--file", seed, "--media-root", seed.parent)
    dest = env / "backups"
    assert run("backup", "--dest", dest) == 0
    dbs = list(dest.glob("portfolio-*.db"))
    tars = list(dest.glob("media-*.tar.gz"))
    assert len(dbs) == 1 and len(tars) == 1
    with tarfile.open(tars[0]) as tar:
        assert any(n.endswith(".webp") for n in tar.getnames())

    # mutate: drop a project and wipe the media files
    conn = db.connect(env / "data" / "portfolio.db")
    with conn:
        conn.execute("DELETE FROM projects WHERE slug = 'first'")
    conn.close()
    media_dir = env / "data" / "media"
    for f in media_dir.iterdir():
        f.unlink()
    assert count(env, "projects") == 1

    assert run("restore", "--db", dbs[0], "--media", tars[0]) == 1  # refuses without --yes
    assert count(env, "projects") == 1

    assert run("restore", "--db", dbs[0], "--media", tars[0], "--yes") == 0
    assert count(env, "projects") == 2 and count(env, "media") == 2
    assert len(list(media_dir.iterdir())) == 4
    assert (env / "data" / "portfolio.db.pre-restore").exists()
    with Image.open(next(p for p in media_dir.iterdir() if "thumb" not in p.name)) as im:
        assert im.format == "WEBP"


def test_restore_rejects_corrupt_db(env, seed):
    run("import", "--file", seed, "--media-root", seed.parent)
    bad = env / "bad.db"
    bad.write_bytes(b"this is not a database" * 100)
    assert run("restore", "--db", bad, "--yes") == 1
    assert count(env, "projects") == 2  # live db untouched
    assert not (env / "data" / "portfolio.db.pre-restore").exists()


def test_backup_keeps_newest_14(env, seed):
    run("import", "--file", seed, "--media-root", seed.parent)
    dest = env / "backups"
    dest.mkdir()
    for i in range(20):
        (dest / f"portfolio-20250101-0000{i:02d}.db").write_bytes(b"x")
        (dest / f"media-20250101-0000{i:02d}.tar.gz").write_bytes(b"x")
    assert run("backup", "--dest", dest) == 0
    assert len(list(dest.glob("portfolio-*.db"))) == 14
    assert len(list(dest.glob("media-*.tar.gz"))) == 14
    assert not (dest / "portfolio-20250101-000000.db").exists()


def test_reimport_adds_only_new_source_files(env, seed):
    run("import", "--file", seed, "--media-root", seed.parent)
    (seed.parent / "sub").mkdir()
    (seed.parent / "sub" / "c.png").write_bytes(png_bytes(90, 90, color=(0, 255, 0)))
    doc = json.loads(seed.read_text())
    doc["projects"][0]["images"].append({"path": "sub/c.png", "alt": "C"})
    seed.write_text(json.dumps(doc))
    assert run("import", "--file", seed, "--media-root", seed.parent) == 0
    assert count(env, "media") == 3  # only c.png was added
    conn = sqlite3.connect(env / "data" / "portfolio.db")
    sources = sorted(r[0] for r in conn.execute("SELECT source FROM media"))
    conn.close()
    assert sources == ["a.png", "b.png", "c.png"]  # original file names
