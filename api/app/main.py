"""FastAPI application factory."""
from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from . import __version__, db
from .config import ConfigError, Settings
from .middleware import BodyLimitMiddleware, SecurityHeadersMiddleware
from .ratelimit import SlidingWindowLimiter
from .routers import admin, auth, contact, media, public
from .schemas import format_errors

log = logging.getLogger("portfolio")

LOGIN_MAX_FAILURES = 5
LOGIN_WINDOW = 15 * 60
CONTACT_MAX = 5
CONTACT_WINDOW = 60 * 60


def create_app(settings: Settings) -> FastAPI:
    if len(settings.secret) < 32:
        raise ConfigError("PORTFOLIO_SECRET is required and must be at least 32 characters")

    settings.media_dir.mkdir(parents=True, exist_ok=True)
    db.init_db(settings.db_path)

    # No interactive docs / openapi schema in production: smaller attack surface.
    app = FastAPI(title="Portfolio API", version=__version__, docs_url=None, redoc_url=None, openapi_url=None)
    app.state.settings = settings
    app.state.login_limiter = SlidingWindowLimiter(LOGIN_MAX_FAILURES, LOGIN_WINDOW)
    app.state.contact_limiter = SlidingWindowLimiter(CONTACT_MAX, CONTACT_WINDOW)
    app.state.dispatcher = admin.github_dispatch

    # add_middleware: the last one added is the outermost.
    app.add_middleware(BodyLimitMiddleware, max_bytes=settings.max_body_bytes,
                       json_max_bytes=settings.max_json_bytes)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
        allow_credentials=False,
        max_age=600,
    )
    app.add_middleware(SecurityHeadersMiddleware)

    @app.exception_handler(StarletteHTTPException)
    async def http_error(_: Request, exc: StarletteHTTPException):
        return JSONResponse({"detail": str(exc.detail)}, status_code=exc.status_code,
                            headers=getattr(exc, "headers", None))

    @app.exception_handler(RequestValidationError)
    async def validation_error(_: Request, exc: RequestValidationError):
        return JSONResponse({"detail": format_errors(list(exc.errors()))}, status_code=422)

    @app.exception_handler(Exception)
    async def unhandled(request: Request, exc: Exception):
        log.exception("Unhandled error on %s %s", request.method, request.url.path)
        return JSONResponse({"detail": "Internal server error"}, status_code=500)

    for module in (public, auth, contact, admin, media):
        app.include_router(module.router)
    return app


def create_app_from_env() -> FastAPI:
    """uvicorn entry point: `uvicorn app.main:create_app_from_env --factory`."""
    return create_app(Settings.from_env())
