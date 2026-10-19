"""Runtime configuration, read from environment variables."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Mapping

DEFAULT_CORS = "https://ahmadbayrakdar.github.io,http://localhost:4321"
_API_DIR = Path(__file__).resolve().parent.parent


class ConfigError(RuntimeError):
    pass


@dataclass(frozen=True)
class Settings:
    db_path: Path
    media_dir: Path
    public_url: str = "http://127.0.0.1:8810"
    secret: str = ""
    cors_origins: tuple[str, ...] = field(default_factory=lambda: tuple(DEFAULT_CORS.split(",")))
    github_dispatch_token: str | None = None
    github_repo: str = "ahmadbayrakdar/ahmadbayrakdar.github.io"
    trust_proxy: bool = False
    max_body_bytes: int = 16 * 1024 * 1024  # image uploads only
    max_json_bytes: int = 2 * 1024 * 1024  # every other request
    max_image_bytes: int = 15 * 1024 * 1024
    token_ttl_seconds: int = 12 * 3600

    @property
    def media_url_base(self) -> str:
        return f"{self.public_url}/media"

    @classmethod
    def from_env(cls, env: Mapping[str, str] | None = None, require_secret: bool = True) -> "Settings":
        env = os.environ if env is None else env
        secret = env.get("PORTFOLIO_SECRET", "")
        if require_secret and len(secret) < 32:
            raise ConfigError("PORTFOLIO_SECRET is required and must be at least 32 characters")
        cors = env.get("PORTFOLIO_CORS", DEFAULT_CORS)
        return cls(
            db_path=Path(env.get("PORTFOLIO_DB") or _API_DIR / "data" / "portfolio.db"),
            media_dir=Path(env.get("PORTFOLIO_MEDIA_DIR") or _API_DIR / "data" / "media"),
            public_url=(env.get("PORTFOLIO_PUBLIC_URL") or "http://127.0.0.1:8810").rstrip("/"),
            secret=secret,
            cors_origins=tuple(o.strip().rstrip("/") for o in cors.split(",") if o.strip()),
            github_dispatch_token=env.get("GITHUB_DISPATCH_TOKEN") or None,
            github_repo=env.get("GITHUB_REPO") or "ahmadbayrakdar/ahmadbayrakdar.github.io",
            trust_proxy=env.get("PORTFOLIO_TRUST_PROXY", "") in ("1", "true", "yes"),
        )
