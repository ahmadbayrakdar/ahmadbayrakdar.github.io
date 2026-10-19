"""Public, unauthenticated read endpoints."""
from __future__ import annotations

import sqlite3

from fastapi import APIRouter, Depends, HTTPException

from .. import __version__, services
from ..config import Settings
from ..deps import get_conn, get_settings

router = APIRouter(prefix="/api")


@router.get("/health")
def health(conn: sqlite3.Connection = Depends(get_conn)):
    conn.execute("SELECT 1").fetchone()
    return {"ok": True, "version": __version__}


@router.get("/profile")
def profile(conn: sqlite3.Connection = Depends(get_conn)):
    return services.get_profile(conn)


@router.get("/projects")
def list_projects(category: str = "", featured: str = "", conn: sqlite3.Connection = Depends(get_conn),
                  settings: Settings = Depends(get_settings)):
    where = ["status = 'published'"]
    params: list = []
    if category:
        where.append("category = ?")
        params.append(category)
    if featured.lower() in ("1", "true", "yes"):
        where.append("featured = 1")
    return services.fetch_projects(conn, settings, "WHERE " + " AND ".join(where), tuple(params), full=False)


@router.get("/projects/{slug}")
def get_project(slug: str, conn: sqlite3.Connection = Depends(get_conn),
                settings: Settings = Depends(get_settings)):
    project = services.fetch_project(conn, settings, "WHERE slug = ? AND status = 'published'", (slug,))
    if project is None:
        raise HTTPException(404, "Project not found")
    return project


@router.get("/export")
def export(conn: sqlite3.Connection = Depends(get_conn), settings: Settings = Depends(get_settings)):
    return services.export_data(conn, settings, include_drafts=False)
