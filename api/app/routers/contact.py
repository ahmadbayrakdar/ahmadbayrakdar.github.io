"""Public contact form."""
from __future__ import annotations

import hashlib
import sqlite3

from fastapi import APIRouter, Depends, HTTPException, Request

from ..config import Settings
from ..db import utcnow
from ..deps import client_ip, get_conn, get_settings
from ..schemas import ContactIn

router = APIRouter(prefix="/api")


def ip_hash(settings: Settings, ip: str) -> str:
    salt = hashlib.sha256((settings.secret + "|ip-salt").encode()).hexdigest()
    return hashlib.sha256(f"{salt}:{ip}".encode()).hexdigest()


@router.post("/contact", status_code=201)
def contact(body: ContactIn, request: Request, conn: sqlite3.Connection = Depends(get_conn),
            settings: Settings = Depends(get_settings)):
    ip = client_ip(request)
    limiter = request.app.state.contact_limiter
    if not limiter.allow(ip):
        raise HTTPException(429, "Too many messages. Please try again later.",
                            headers={"Retry-After": str(limiter.retry_after(ip))})
    if body.website:  # honeypot: pretend success, store nothing
        return {"ok": True}
    with conn:
        conn.execute(
            "INSERT INTO messages(name, email, company, body, ip_hash, read, created_at) VALUES (?,?,?,?,?,0,?)",
            (body.name, body.email, body.company, body.message, ip_hash(settings, ip), utcnow()),
        )
    return {"ok": True}
