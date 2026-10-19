"""Admin media endpoints: upload, edit, delete, set project cover."""
from __future__ import annotations

import sqlite3
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request
from starlette.concurrency import run_in_threadpool
from starlette.datastructures import UploadFile

from .. import db, images, services
from ..config import Settings
from ..deps import current_admin, get_conn, get_settings
from ..schemas import CoverIn, MediaPatch

router = APIRouter(prefix="/api/admin")
MAX_FILES_PER_REQUEST = 20


def _project_or_404(conn: sqlite3.Connection, project_id: int) -> sqlite3.Row:
    row = conn.execute("SELECT id, slug, cover_media_id FROM projects WHERE id = ?", (project_id,)).fetchone()
    if row is None:
        raise HTTPException(404, "Project not found")
    return row


def _ingest(conn: sqlite3.Connection, settings: Settings, user: str, project: sqlite3.Row,
            blobs: list[tuple[str, bytes]]) -> list[dict[str, Any]]:
    """Process every blob first (all-or-nothing), then store files and insert rows."""
    processed: list[images.ProcessedImage] = []
    for filename, data in blobs:
        try:
            processed.append(images.process_image(data))
        except images.ImageError as exc:
            raise HTTPException(415 if "type" in str(exc) else 400, f"{filename or 'file'}: {exc}") from None

    stored: list[tuple[str, str]] = []
    try:
        for p in processed:
            stored.append(images.store_image(settings.media_dir, p))
        ids: list[int] = []
        with conn:
            for p, (file, thumb) in zip(processed, stored):
                # MAX(sort) is evaluated inside the INSERT so concurrent uploads (the admin UI sends two at a time)
                # cannot compute the same position.
                cur = conn.execute(
                    "INSERT INTO media(project_id, file, thumb, width, height, bytes, alt, sort, created_at) "
                    "VALUES (?,?,?,?,?,?,?,"
                    "(SELECT COALESCE(MAX(sort), 0) + 10 FROM media WHERE project_id = ?),?)",
                    (project["id"], file, thumb, p.width, p.height, len(p.full), "", project["id"], db.utcnow()),
                )
                ids.append(int(cur.lastrowid))
            if ids:  # only if the project is still coverless *now* (the row read above may be stale under concurrency)
                conn.execute("UPDATE projects SET cover_media_id = ?, updated_at = ? "
                             "WHERE id = ? AND cover_media_id IS NULL", (ids[0], db.utcnow(), project["id"]))
            db.audit(conn, user, "media.upload", f"project:{project['id']}:{len(ids)} file(s)")
    except Exception:
        for file, thumb in stored:
            images.remove_files(settings.media_dir, [file, thumb])
        raise
    marks = ",".join("?" * len(ids))
    rows = conn.execute(f"SELECT * FROM media WHERE id IN ({marks}) ORDER BY sort, id", ids).fetchall()
    return [services.media_out(r, settings) for r in rows]


@router.post("/projects/{project_id}/media", status_code=201)
async def upload_media(project_id: int, request: Request, user: str = Depends(current_admin),
                       conn: sqlite3.Connection = Depends(get_conn), settings: Settings = Depends(get_settings)):
    project = _project_or_404(conn, project_id)
    try:
        form = await request.form()
    except Exception:
        raise HTTPException(400, "Expected a multipart/form-data body") from None
    try:
        uploads = [f for key in ("files[]", "files") for f in form.getlist(key) if isinstance(f, UploadFile)]
        if not uploads:
            raise HTTPException(400, "No files uploaded (use the form field 'files[]')")
        if len(uploads) > MAX_FILES_PER_REQUEST:
            raise HTTPException(400, f"Too many files (max {MAX_FILES_PER_REQUEST} per request)")
        blobs: list[tuple[str, bytes]] = []
        for f in uploads:
            data = await f.read(settings.max_image_bytes + 1)
            if len(data) > settings.max_image_bytes:
                raise HTTPException(413, f"{f.filename or 'file'}: larger than "
                                         f"{settings.max_image_bytes // (1024 * 1024)} MB")
            blobs.append((f.filename or "", data))
    finally:
        await form.close()

    uploaded = await run_in_threadpool(_ingest, conn, settings, user, project, blobs)
    return {"uploaded": uploaded,
            "project": services.fetch_project(conn, settings, "WHERE id = ?", (project_id,))}


@router.patch("/media/{media_id}")
def patch_media(media_id: int, body: MediaPatch, user: str = Depends(current_admin),
                conn: sqlite3.Connection = Depends(get_conn), settings: Settings = Depends(get_settings)):
    with conn:
        if conn.execute("SELECT 1 FROM media WHERE id = ?", (media_id,)).fetchone() is None:
            raise HTTPException(404, "Media not found")
        if body.alt is not None:
            conn.execute("UPDATE media SET alt = ? WHERE id = ?", (body.alt, media_id))
        if body.sort is not None:
            conn.execute("UPDATE media SET sort = ? WHERE id = ?", (body.sort, media_id))
        db.audit(conn, user, "media.update", f"media:{media_id}")
    return services.media_out(conn.execute("SELECT * FROM media WHERE id = ?", (media_id,)).fetchone(), settings)


@router.delete("/media/{media_id}")
def delete_media(media_id: int, user: str = Depends(current_admin),
                 conn: sqlite3.Connection = Depends(get_conn), settings: Settings = Depends(get_settings)):
    row = conn.execute("SELECT * FROM media WHERE id = ?", (media_id,)).fetchone()
    if row is None:
        raise HTTPException(404, "Media not found")
    with conn:
        conn.execute("DELETE FROM media WHERE id = ?", (media_id,))  # projects.cover_media_id -> NULL
        pid = row["project_id"]
        if pid is not None:
            proj = conn.execute("SELECT cover_media_id FROM projects WHERE id = ?", (pid,)).fetchone()
            if proj is not None and proj["cover_media_id"] is None:
                nxt = conn.execute("SELECT id FROM media WHERE project_id = ? ORDER BY sort, id LIMIT 1",
                                   (pid,)).fetchone()
                if nxt is not None:  # promote the next image so the project is never left coverless by accident
                    conn.execute("UPDATE projects SET cover_media_id = ? WHERE id = ?", (nxt["id"], pid))
        db.audit(conn, user, "media.delete", f"media:{media_id}")
    images.remove_files(settings.media_dir, [row["file"], row["thumb"]])
    return {"ok": True}


@router.put("/projects/{project_id}/cover")
def set_cover(project_id: int, body: CoverIn, user: str = Depends(current_admin),
              conn: sqlite3.Connection = Depends(get_conn), settings: Settings = Depends(get_settings)):
    _project_or_404(conn, project_id)
    if body.media_id is not None:
        owner = conn.execute("SELECT project_id FROM media WHERE id = ?", (body.media_id,)).fetchone()
        if owner is None or owner["project_id"] != project_id:
            raise HTTPException(400, "media_id does not belong to this project")
    with conn:
        conn.execute("UPDATE projects SET cover_media_id = ?, updated_at = ? WHERE id = ?",
                     (body.media_id, db.utcnow(), project_id))
        db.audit(conn, user, "project.cover", f"project:{project_id}:media:{body.media_id}")
    return services.fetch_project(conn, settings, "WHERE id = ?", (project_id,))
