"""Pure-ASGI middleware: request body size cap and security headers."""
from __future__ import annotations

import json
import re

from starlette.types import ASGIApp, Message, Receive, Scope, Send


class _TooLarge(Exception):
    pass


UPLOAD_PATH = re.compile(r"^/api/admin/projects/[0-9]+/media/?$")


class BodyLimitMiddleware:
    """Reject request bodies larger than the limit (413), by Content-Length and while streaming.

    Only the authenticated image upload may be large (max_bytes); every other route gets json_max_bytes.
    FastAPI parses JSON bodies *before* it checks the token, so a big cap there would let anyone make
    the process allocate hundreds of MB per request."""

    def __init__(self, app: ASGIApp, max_bytes: int, json_max_bytes: int | None = None):
        self.app = app
        self.max_bytes = max_bytes
        self.json_max_bytes = min(json_max_bytes, max_bytes) if json_max_bytes else max_bytes

    async def _reject(self, send: Send) -> None:
        body = json.dumps({"detail": "Request body too large"}).encode()
        await send({"type": "http.response.start", "status": 413,
                    "headers": [(b"content-type", b"application/json"),
                                (b"content-length", str(len(body)).encode()),
                                (b"connection", b"close")]})
        await send({"type": "http.response.body", "body": body})

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        is_upload = scope.get("method") == "POST" and UPLOAD_PATH.match(scope.get("path", "")) is not None
        limit = self.max_bytes if is_upload else self.json_max_bytes
        for name, value in scope["headers"]:
            if name == b"content-length":
                try:
                    if int(value) > limit:
                        await self._reject(send)
                        return
                except ValueError:
                    pass
                break

        received = 0
        started = False

        async def limited_receive() -> Message:
            nonlocal received
            message = await receive()
            if message["type"] == "http.request":
                received += len(message.get("body", b""))
                if received > limit:
                    raise _TooLarge
            return message

        async def tracking_send(message: Message) -> None:
            nonlocal started
            if message["type"] == "http.response.start":
                started = True
            await send(message)

        try:
            await self.app(scope, limited_receive, tracking_send)
        except _TooLarge:
            if not started:
                await self._reject(send)


class SecurityHeadersMiddleware:
    HEADERS = [
        (b"x-content-type-options", b"nosniff"),
        (b"referrer-policy", b"no-referrer"),
        (b"x-frame-options", b"DENY"),
        (b"content-security-policy", b"default-src 'none'; frame-ancestors 'none'"),
        (b"cross-origin-opener-policy", b"same-origin"),
        (b"permissions-policy", b"geolocation=(), camera=(), microphone=()"),
    ]

    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        path = scope.get("path", "")
        no_store = path.startswith("/api/admin") or path.startswith("/api/auth")
        https = scope.get("scheme") == "https"

        async def wrapped(message: Message) -> None:
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                present = {h[0].lower() for h in headers}
                for name, value in self.HEADERS:
                    if name not in present:
                        headers.append((name, value))
                if https and b"strict-transport-security" not in present:
                    headers.append((b"strict-transport-security", b"max-age=31536000"))
                if no_store and b"cache-control" not in present:
                    headers.append((b"cache-control", b"no-store"))
                message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, wrapped)
