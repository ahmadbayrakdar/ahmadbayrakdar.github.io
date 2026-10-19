"""SQLite access (stdlib sqlite3, WAL, foreign keys) and versioned migrations."""
from __future__ import annotations

import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

MIGRATIONS: list[tuple[int, str]] = [
    (
        1,
        """
        CREATE TABLE projects (
            id INTEGER PRIMARY KEY,
            slug TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            tagline TEXT NOT NULL DEFAULT '',
            summary TEXT NOT NULL DEFAULT '',
            category TEXT NOT NULL,
            kind TEXT NOT NULL,
            client TEXT NOT NULL DEFAULT '',
            industry TEXT NOT NULL DEFAULT '',
            location TEXT NOT NULL DEFAULT '',
            role TEXT NOT NULL DEFAULT '',
            year_start INTEGER,
            year_end INTEGER,
            status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
            featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0,1)),
            priority INTEGER NOT NULL DEFAULT 1000,
            tech TEXT NOT NULL DEFAULT '[]',
            tags TEXT NOT NULL DEFAULT '[]',
            highlights TEXT NOT NULL DEFAULT '[]',
            links TEXT NOT NULL DEFAULT '[]',
            live_url TEXT,
            repo_url TEXT,
            case_study TEXT NOT NULL DEFAULT '{}',
            seo_title TEXT,
            seo_description TEXT,
            cover_media_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            published_at TEXT
        );
        CREATE TABLE media (
            id INTEGER PRIMARY KEY,
            project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
            file TEXT NOT NULL,
            thumb TEXT NOT NULL,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            bytes INTEGER NOT NULL,
            alt TEXT NOT NULL DEFAULT '',
            sort INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        );
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            pass_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        CREATE TABLE settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        CREATE TABLE messages (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            company TEXT NOT NULL DEFAULT '',
            body TEXT NOT NULL,
            ip_hash TEXT NOT NULL,
            read INTEGER NOT NULL DEFAULT 0 CHECK (read IN (0,1)),
            created_at TEXT NOT NULL
        );
        CREATE TABLE audit (
            id INTEGER PRIMARY KEY,
            at TEXT NOT NULL,
            user TEXT NOT NULL,
            action TEXT NOT NULL,
            target TEXT NOT NULL DEFAULT ''
        );
        """,
    ),
    (
        2,
        """
        CREATE INDEX idx_projects_order ON projects(status, featured DESC, priority, id);
        CREATE INDEX idx_media_project ON media(project_id, sort, id);
        CREATE INDEX idx_messages_created ON messages(created_at);
        CREATE INDEX idx_audit_at ON audit(at);
        """,
    ),
    (
        3,
        # Importer bookkeeping (not part of the public contract): remembers which
        # seed path/url an image came from so `cli.py import` is idempotent.
        "ALTER TABLE media ADD COLUMN source TEXT;",
    ),
]


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def connect(path: Path | str) -> sqlite3.Connection:
    # check_same_thread=False: a request's connection is used from FastAPI's threadpool and
    # (for uploads) the event loop thread, strictly one at a time.
    conn = sqlite3.connect(str(path), timeout=15, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    conn.execute("PRAGMA busy_timeout = 15000")
    return conn


def migrate(conn: sqlite3.Connection) -> list[int]:
    """Apply pending migrations in order; returns the versions applied."""
    conn.execute(
        "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)"
    )
    conn.commit()
    done = {r[0] for r in conn.execute("SELECT version FROM schema_migrations")}
    applied: list[int] = []
    for version, sql in sorted(MIGRATIONS):
        if version in done:
            continue
        # executescript() commits first; wrap in an explicit transaction so a failed
        # migration leaves nothing half-applied.
        script = (
            f"BEGIN;\n{sql}\n"
            f"INSERT INTO schema_migrations(version, applied_at) VALUES ({version}, '{utcnow()}');\nCOMMIT;"
        )
        try:
            conn.executescript(script)
        except Exception:
            if conn.in_transaction:
                conn.execute("ROLLBACK")
            raise
        applied.append(version)
    return applied


def init_db(path: Path | str) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    existed = path.exists()
    conn = connect(path)
    try:
        migrate(conn)
    finally:
        conn.close()
    if not existed:
        try:
            os.chmod(path, 0o600)  # -wal / -shm inherit the main file's mode
        except OSError:
            pass


def audit(conn: sqlite3.Connection, user: str, action: str, target: str = "") -> None:
    """Append an audit row; call inside the caller's transaction."""
    conn.execute(
        "INSERT INTO audit(at, user, action, target) VALUES (?,?,?,?)",
        (utcnow(), user, action, target),
    )
