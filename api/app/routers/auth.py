"""Login and identity."""
from __future__ import annotations

import sqlite3
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request

from .. import auth, db
from ..config import Settings
from ..deps import client_ip, current_admin, get_conn, get_settings
from ..schemas import LoginIn

router = APIRouter(prefix="/api/auth")


@router.post("/login")
def login(body: LoginIn, request: Request, conn: sqlite3.Connection = Depends(get_conn),
          settings: Settings = Depends(get_settings)):
    limiter = request.app.state.login_limiter
    ip = client_ip(request)
    # Reserve the attempt *before* the slow hash check: parallel requests cannot all slip through while
    # earlier ones are still hashing. A successful login gives its slot back below.
    if not limiter.allow(ip):
        raise HTTPException(429, "Too many failed attempts. Try again later.",
                            headers={"Retry-After": str(limiter.retry_after(ip))})
    email = body.email.strip().lower()
    row = conn.execute("SELECT email, pass_hash FROM users WHERE email = ?", (email,)).fetchone()
    if row is None:
        auth.verify_dummy(body.password)
        ok = False
    else:
        ok = auth.verify_password(body.password, row["pass_hash"])
    if not ok:
        raise HTTPException(401, "Invalid email or password")
    limiter.forgive(ip)
    token, exp = auth.create_token(settings.secret, row["email"], settings.token_ttl_seconds)
    with conn:
        db.audit(conn, row["email"], "login", "")
    return {
        "token": token,
        "expires_at": datetime.fromtimestamp(exp, timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
    }


@router.get("/me")
def me(user: str = Depends(current_admin)):
    return {"email": user}
