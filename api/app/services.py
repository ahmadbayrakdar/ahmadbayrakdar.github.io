"""Shared data-access helpers: project (de)serialization, profile storage, export."""
from __future__ import annotations

import json
import sqlite3
from typing import Any

from .config import Settings
from .db import utcnow
from .schemas import Profile, ProjectIn

ORDER_BY = "ORDER BY featured DESC, priority ASC, id ASC"
JSON_LIST_FIELDS = ("tech", "tags", "highlights", "links")


# ----- media ---------------------------------------------------------------------------------

def media_out(row: sqlite3.Row, settings: Settings) -> dict[str, Any]:
    base = settings.media_url_base
    return {
        "id": row["id"],
        "url": f"{base}/{row['file']}",
        "thumb_url": f"{base}/{row['thumb']}",
        "width": row["width"],
        "height": row["height"],
        "alt": row["alt"],
        "sort": row["sort"],
    }


def media_for_projects(conn: sqlite3.Connection, ids: list[int]) -> dict[int, list[sqlite3.Row]]:
    out: dict[int, list[sqlite3.Row]] = {i: [] for i in ids}
    if not ids:
        return out
    marks = ",".join("?" * len(ids))
    for row in conn.execute(f"SELECT * FROM media WHERE project_id IN ({marks}) ORDER BY sort, id", ids):
        out[row["project_id"]].append(row)
    return out


# ----- projects ------------------------------------------------------------------------------

def project_out(row: sqlite3.Row, media_rows: list[sqlite3.Row], settings: Settings, full: bool = True) -> dict[str, Any]:
    d = {k: row[k] for k in row.keys()}
    for key in JSON_LIST_FIELDS:
        d[key] = json.loads(d[key])
    case_study = json.loads(d.pop("case_study"))
    gallery = [media_out(m, settings) for m in media_rows]
    d["cover"] = next((g for g in gallery if g["id"] == d["cover_media_id"]), None)
    d["gallery"] = gallery
    if full:
        d["case_study"] = case_study
    return d


def fetch_projects(conn: sqlite3.Connection, settings: Settings, where: str = "", params: tuple = (),
                   full: bool = False) -> list[dict[str, Any]]:
    rows = conn.execute(f"SELECT * FROM projects {where} {ORDER_BY}", params).fetchall()
    media = media_for_projects(conn, [r["id"] for r in rows])
    return [project_out(r, media[r["id"]], settings, full=full) for r in rows]


def fetch_project(conn: sqlite3.Connection, settings: Settings, where: str, params: tuple) -> dict[str, Any] | None:
    items = fetch_projects(conn, settings, where, params, full=True)
    return items[0] if items else None


def project_to_input_dict(project: dict[str, Any]) -> dict[str, Any]:
    """The editable subset of a serialized project (used to merge PUT bodies)."""
    keys = set(ProjectIn.model_fields)
    return {k: v for k, v in project.items() if k in keys}


def project_columns(data: ProjectIn) -> dict[str, Any]:
    """ProjectIn -> column values (JSON encoded). Excludes priority/status timestamps, handled by callers."""
    return {
        "slug": data.slug,
        "title": data.title,
        "tagline": data.tagline,
        "summary": data.summary,
        "category": data.category,
        "kind": data.kind,
        "client": data.client,
        "industry": data.industry,
        "location": data.location,
        "role": data.role,
        "year_start": data.year_start,
        "year_end": data.year_end,
        "status": data.status,
        "featured": 1 if data.featured else 0,
        "tech": json.dumps(data.tech, ensure_ascii=False),
        "tags": json.dumps(data.tags, ensure_ascii=False),
        "highlights": json.dumps(data.highlights, ensure_ascii=False),
        "links": json.dumps([l.model_dump() for l in data.links], ensure_ascii=False),
        "live_url": data.live_url,
        "repo_url": data.repo_url,
        "case_study": json.dumps(data.case_study.model_dump(exclude_defaults=True), ensure_ascii=False),
        "seo_title": data.seo_title,
        "seo_description": data.seo_description,
    }


def next_priority(conn: sqlite3.Connection) -> int:
    row = conn.execute("SELECT MAX(priority) FROM projects").fetchone()
    return ((row[0] or 0) // 10 + 1) * 10


def insert_project(conn: sqlite3.Connection, data: ProjectIn) -> int:
    cols = project_columns(data)
    now = utcnow()
    cols["priority"] = data.priority if data.priority is not None else next_priority(conn)
    cols["created_at"] = now
    cols["updated_at"] = now
    cols["published_at"] = now if data.status == "published" else None
    names = ", ".join(cols)
    marks = ", ".join(f":{k}" for k in cols)
    cur = conn.execute(f"INSERT INTO projects ({names}) VALUES ({marks})", cols)
    return int(cur.lastrowid)


def update_project(conn: sqlite3.Connection, project_id: int, data: ProjectIn, keep_priority: int,
                   published_at: str | None) -> None:
    cols = project_columns(data)
    cols["priority"] = data.priority if data.priority is not None else keep_priority
    cols["updated_at"] = utcnow()
    cols["published_at"] = published_at or (cols["updated_at"] if data.status == "published" else None)
    sets = ", ".join(f"{k} = :{k}" for k in cols)
    cols["id"] = project_id
    conn.execute(f"UPDATE projects SET {sets} WHERE id = :id", cols)


# ----- profile -------------------------------------------------------------------------------

def get_profile(conn: sqlite3.Connection) -> dict[str, Any]:
    row = conn.execute("SELECT value FROM settings WHERE key = 'profile'").fetchone()
    if row is None:
        return Profile().model_dump()
    return Profile.model_validate(json.loads(row["value"])).model_dump()


def save_profile(conn: sqlite3.Connection, profile: Profile) -> dict[str, Any]:
    data = profile.model_dump()
    conn.execute(
        "INSERT INTO settings(key, value) VALUES ('profile', ?) "
        "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        (json.dumps(data, ensure_ascii=False),),
    )
    return data


# ----- export --------------------------------------------------------------------------------

def export_data(conn: sqlite3.Connection, settings: Settings, include_drafts: bool = False) -> dict[str, Any]:
    where = "" if include_drafts else "WHERE status = 'published'"
    return {
        "profile": get_profile(conn),
        "projects": fetch_projects(conn, settings, where, full=True),
        "generated_at": utcnow(),
    }
