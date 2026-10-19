"""FastAPI dependencies: settings, DB connection, client IP, admin auth."""
from __future__ import annotations

import ipaddress
import sqlite3
from typing import Iterator

from fastapi import Depends, HTTPException, Request

from . import auth, db
from .config import Settings


def get_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_conn(settings: Settings = Depends(get_settings)) -> Iterator[sqlite3.Connection]:
    conn = db.connect(settings.db_path)
    try:
        yield conn
    finally:
        conn.close()


def _normalize_ip(raw: str) -> str | None:
    """Canonical rate-limit key: IPv4-mapped IPv6 becomes IPv4, other IPv6 collapses to its /64
    (one subscriber controls a whole /64, so per-address keys would let it dodge every limit)."""
    try:
        ip = ipaddress.ip_address(raw.strip())
    except ValueError:
        return None
    if isinstance(ip, ipaddress.IPv6Address):
        if ip.ipv4_mapped is not None:
            return str(ip.ipv4_mapped)
        return str(ipaddress.ip_network(f"{ip}/64", strict=False))
    return str(ip)


def client_ip(request: Request) -> str:
    """Rate-limit key for the caller. X-Real-IP is only read when PORTFOLIO_TRUST_PROXY is on, i.e. when
    nginx (which overwrites that header with $remote_addr) is the only thing that can reach the app."""
    settings: Settings = request.app.state.settings
    if settings.trust_proxy:
        key = _normalize_ip(request.headers.get("x-real-ip", ""))
        if key:
            return key
    if request.client:
        return _normalize_ip(request.client.host) or request.client.host
    return "unknown"


def current_admin(request: Request, settings: Settings = Depends(get_settings),
                  conn: sqlite3.Connection = Depends(get_conn)) -> str:
    header = request.headers.get("authorization", "")
    scheme, _, token = header.partition(" ")
    unauthorized = HTTPException(401, "Not authenticated", headers={"WWW-Authenticate": "Bearer"})
    if scheme.lower() != "bearer" or not token:
        raise unauthorized
    sub = auth.verify_token(settings.secret, token.strip())
    if sub is None:
        raise unauthorized
    if conn.execute("SELECT 1 FROM users WHERE email = ?", (sub,)).fetchone() is None:
        raise unauthorized
    return sub
