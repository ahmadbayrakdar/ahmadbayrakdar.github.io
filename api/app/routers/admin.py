"""Authenticated admin endpoints: projects, profile, messages, rebuild trigger."""
from __future__ import annotations

import json
import sqlite3
import urllib.error
import urllib.request
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, Request
from pydantic import ValidationError

from .. import db, images, services
from ..config import Settings
from ..deps import current_admin, get_conn, get_settings
from ..schemas import MessagePatch, OrderIn, Profile, ProjectIn, format_errors

router = APIRouter(prefix="/api/admin")


# ----- projects ------------------------------------------------------------------------------

def _slug_taken(conn: sqlite3.Connection, slug: str, exclude_id: int | None = None) -> bool:
    row = conn.execute("SELECT id FROM projects WHERE slug = ?", (slug,)).fetchone()
    return row is not None and row["id"] != exclude_id


def _load(conn: sqlite3.Connection, settings: Settings, project_id: int) -> dict[str, Any]:
    project = services.fetch_project(conn, settings, "WHERE id = ?", (project_id,))
    if project is None:
        raise HTTPException(404, "Project not found")
    return project


@router.get("/projects")
def list_projects(_: str = Depends(current_admin), conn: sqlite3.Connection = Depends(get_conn),
                  settings: Settings = Depends(get_settings)):
    return services.fetch_projects(conn, settings, full=False)


@router.post("/projects", status_code=201)
def create_project(body: ProjectIn, user: str = Depends(current_admin),
                   conn: sqlite3.Connection = Depends(get_conn), settings: Settings = Depends(get_settings)):
    if _slug_taken(conn, body.slug):
        raise HTTPException(409, "Slug is already in use")
    try:
        with conn:
            pid = services.insert_project(conn, body)
            db.audit(conn, user, "project.create", f"project:{pid}:{body.slug}")
    except sqlite3.IntegrityError:
        raise HTTPException(409, "Slug is already in use") from None
    return _load(conn, settings, pid)


# NOTE: declared before /projects/{project_id} so "order" is not parsed as an id.
@router.put("/projects/order")
def reorder_projects(body: OrderIn, user: str = Depends(current_admin),
                     conn: sqlite3.Connection = Depends(get_conn)):
    ids = body.ids
    if len(set(ids)) != len(ids):
        raise HTTPException(400, "ids must be unique")
    existing = [r["id"] for r in conn.execute("SELECT id FROM projects ORDER BY priority, id")]
    unknown = set(ids) - set(existing)
    if unknown:
        raise HTTPException(400, f"Unknown project ids: {sorted(unknown)}")
    # Listed ids first (in the given order), any unlisted projects keep their relative order after them.
    full_order = ids + [i for i in existing if i not in set(ids)]
    with conn:
        for n, pid in enumerate(full_order, start=1):
            conn.execute("UPDATE projects SET priority = ?, updated_at = ? WHERE id = ?",
                         (n * 10, db.utcnow(), pid))
        db.audit(conn, user, "project.reorder", ",".join(str(i) for i in ids))
    return {"ok": True, "ids": full_order}


@router.get("/projects/{project_id}")
def get_project(project_id: int, _: str = Depends(current_admin), conn: sqlite3.Connection = Depends(get_conn),
                settings: Settings = Depends(get_settings)):
    return _load(conn, settings, project_id)


@router.put("/projects/{project_id}")
def update_project(project_id: int, body: dict = Body(...), user: str = Depends(current_admin),
                   conn: sqlite3.Connection = Depends(get_conn), settings: Settings = Depends(get_settings)):
    """Update a project. Fields missing from the body keep their current value."""
    current = _load(conn, settings, project_id)
    merged = {**services.project_to_input_dict(current), **body}
    try:
        data = ProjectIn.model_validate(merged)
    except ValidationError as exc:
        raise HTTPException(422, format_errors(exc.errors())) from None
    if _slug_taken(conn, data.slug, project_id):
        raise HTTPException(409, "Slug is already in use")
    try:
        with conn:
            services.update_project(conn, project_id, data, current["priority"], current["published_at"])
            db.audit(conn, user, "project.update", f"project:{project_id}:{data.slug}")
    except sqlite3.IntegrityError:
        raise HTTPException(409, "Slug is already in use") from None
    return _load(conn, settings, project_id)


@router.delete("/projects/{project_id}")
def delete_project(project_id: int, user: str = Depends(current_admin),
                   conn: sqlite3.Connection = Depends(get_conn), settings: Settings = Depends(get_settings)):
    row = conn.execute("SELECT slug FROM projects WHERE id = ?", (project_id,)).fetchone()
    if row is None:
        raise HTTPException(404, "Project not found")
    files: list[str] = []
    for m in conn.execute("SELECT file, thumb FROM media WHERE project_id = ?", (project_id,)):
        files += [m["file"], m["thumb"]]
    with conn:
        conn.execute("DELETE FROM projects WHERE id = ?", (project_id,))  # media rows cascade
        db.audit(conn, user, "project.delete", f"project:{project_id}:{row['slug']}")
    images.remove_files(settings.media_dir, files)
    return {"ok": True}


# ----- profile -------------------------------------------------------------------------------

@router.get("/profile")
def get_profile(_: str = Depends(current_admin), conn: sqlite3.Connection = Depends(get_conn)):
    return services.get_profile(conn)


@router.put("/profile")
def put_profile(body: Profile, user: str = Depends(current_admin), conn: sqlite3.Connection = Depends(get_conn)):
    with conn:
        data = services.save_profile(conn, body)
        db.audit(conn, user, "profile.update", "profile")
    return data


# ----- messages ------------------------------------------------------------------------------

def _message_out(row: sqlite3.Row) -> dict[str, Any]:
    return {"id": row["id"], "name": row["name"], "email": row["email"], "company": row["company"],
            "body": row["body"], "read": row["read"], "created_at": row["created_at"]}


@router.get("/messages")
def list_messages(_: str = Depends(current_admin), conn: sqlite3.Connection = Depends(get_conn)):
    rows = conn.execute("SELECT * FROM messages ORDER BY id DESC LIMIT 1000").fetchall()
    return [_message_out(r) for r in rows]


@router.patch("/messages/{message_id}")
def patch_message(message_id: int, body: MessagePatch, user: str = Depends(current_admin),
                  conn: sqlite3.Connection = Depends(get_conn)):
    with conn:
        cur = conn.execute("UPDATE messages SET read = ? WHERE id = ?", (1 if body.read else 0, message_id))
        if cur.rowcount == 0:
            raise HTTPException(404, "Message not found")
        db.audit(conn, user, "message.read" if body.read else "message.unread", f"message:{message_id}")
    return _message_out(conn.execute("SELECT * FROM messages WHERE id = ?", (message_id,)).fetchone())


@router.delete("/messages/{message_id}")
def delete_message(message_id: int, user: str = Depends(current_admin),
                   conn: sqlite3.Connection = Depends(get_conn)):
    with conn:
        cur = conn.execute("DELETE FROM messages WHERE id = ?", (message_id,))
        if cur.rowcount == 0:
            raise HTTPException(404, "Message not found")
        db.audit(conn, user, "message.delete", f"message:{message_id}")
    return {"ok": True}


# ----- rebuild -------------------------------------------------------------------------------

def github_dispatch(settings: Settings) -> None:
    """Fire the repository_dispatch event that rebuilds the static site."""
    req = urllib.request.Request(
        f"https://api.github.com/repos/{settings.github_repo}/dispatches",
        data=json.dumps({"event_type": "portfolio-content-changed"}).encode(),
        method="POST",
        headers={
            "Authorization": f"Bearer {settings.github_dispatch_token}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "portfolio-api",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    with urllib.request.urlopen(req, timeout=15) as resp:  # 204 on success
        resp.read()


@router.post("/rebuild")
def rebuild(request: Request, user: str = Depends(current_admin), conn: sqlite3.Connection = Depends(get_conn),
            settings: Settings = Depends(get_settings)):
    if not settings.github_dispatch_token:
        raise HTTPException(503, "GITHUB_DISPATCH_TOKEN is not configured on the server")
    try:
        request.app.state.dispatcher(settings)  # github_dispatch unless replaced (tests)
    except urllib.error.HTTPError as exc:
        raise HTTPException(502, f"GitHub rejected the dispatch (HTTP {exc.code})") from None
    except Exception:
        raise HTTPException(502, "Could not reach GitHub") from None
    with conn:
        db.audit(conn, user, "site.rebuild", settings.github_repo)
    return {"ok": True}
