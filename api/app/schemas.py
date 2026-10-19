"""Pydantic request models and validation helpers."""
from __future__ import annotations

import re
from typing import Annotated, Any, Literal
from urllib.parse import urlparse

from pydantic import AfterValidator, BaseModel, BeforeValidator, ConfigDict, Field, StringConstraints, model_validator

CATEGORIES = (
    "SaaS & Platforms",
    "Web Applications",
    "Desktop & Mobile",
    "Client Websites",
    "E-commerce",
    "UI/UX Design",
    "AI & Automation",
    "Personal & Early Work",
)
KINDS = ("Product", "Client", "Employment", "Personal")
STATUSES = ("draft", "published")

SLUG_RE = re.compile(r"^[a-z0-9-]{2,80}$")
EMAIL_RE = re.compile(r"^[^@\s]{1,64}@[^@\s]+\.[^@\s]{2,}$")


def S(max_length: int, min_length: int = 0) -> Any:
    return Annotated[str, StringConstraints(strip_whitespace=True, min_length=min_length, max_length=max_length)]


def _check_url(v: str) -> str:
    if len(v) > 500:
        raise ValueError("URL is too long (max 500 characters)")
    if any(ch.isspace() or ord(ch) < 32 for ch in v):
        raise ValueError("URL must not contain whitespace or control characters")
    parsed = urlparse(v)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("URL must start with http:// or https://")
    return v


def _empty_to_none(v: Any) -> Any:
    if isinstance(v, str) and not v.strip():
        return None
    return v.strip() if isinstance(v, str) else v


def _empty_str_ok(v: str) -> str:
    return _check_url(v) if v else v


Url = Annotated[str, BeforeValidator(lambda v: v.strip() if isinstance(v, str) else v), AfterValidator(_check_url)]
OptUrl = Annotated[str | None, BeforeValidator(_empty_to_none), AfterValidator(lambda v: _check_url(v) if v else v)]
# Profile links may legitimately be blank.
BlankableUrl = Annotated[
    str, BeforeValidator(lambda v: v.strip() if isinstance(v, str) else v), AfterValidator(_empty_str_ok)
]
Slug = Annotated[str, BeforeValidator(lambda v: v.strip() if isinstance(v, str) else v),
                 StringConstraints(pattern=SLUG_RE.pattern)]


def _clean_str_list(max_items: int, max_len: int):
    def check(v: list[str]) -> list[str]:
        if len(v) > max_items:
            raise ValueError(f"too many items (max {max_items})")
        out = []
        for item in v:
            item = item.strip()
            if not item:
                continue
            if len(item) > max_len:
                raise ValueError(f"item too long (max {max_len} characters)")
            out.append(item)
        return out

    return check


def StrList(max_items: int, max_len: int) -> Any:
    return Annotated[list[str], AfterValidator(_clean_str_list(max_items, max_len))]


class _Model(BaseModel):
    model_config = ConfigDict(extra="ignore")

    @model_validator(mode="before")
    @classmethod
    def _nulls_mean_default(cls, data: Any) -> Any:
        """The admin UI sends null for blank optional text; treat null as "not provided" so the field default applies."""
        if isinstance(data, dict):
            return {k: v for k, v in data.items() if v is not None}
        return data


class Link(_Model):
    label: S(80, 1)
    url: Url


class Challenge(_Model):
    challenge: S(2000) = ""
    solution: S(4000) = ""


class CaseStudy(_Model):
    overview: S(10000) = ""
    problem: S(10000) = ""
    role: S(5000) = ""
    responsibilities: StrList(50, 1000) = Field(default_factory=list)
    features: StrList(50, 1000) = Field(default_factory=list)
    architecture: S(10000) = ""
    challenges: list[Challenge] = Field(default_factory=list, max_length=30)
    results: StrList(50, 1000) = Field(default_factory=list)
    notes: S(10000) = ""


class ProjectIn(_Model):
    slug: Slug
    title: S(200, 1)
    tagline: S(300) = ""
    summary: S(280) = ""
    category: Literal[CATEGORIES] = "Web Applications"  # type: ignore[valid-type]
    kind: Literal[KINDS] = "Personal"  # type: ignore[valid-type]
    client: S(200) = ""
    industry: S(200) = ""
    location: S(200) = ""
    role: S(200) = ""
    year_start: int | None = Field(default=None, ge=1990, le=2100)
    year_end: int | None = Field(default=None, ge=1990, le=2100)
    status: Literal[STATUSES] = "draft"  # type: ignore[valid-type]
    featured: bool = False
    priority: int | None = Field(default=None, ge=0, le=1_000_000)
    tech: StrList(50, 60) = Field(default_factory=list)
    tags: StrList(50, 60) = Field(default_factory=list)
    highlights: StrList(30, 400) = Field(default_factory=list)
    links: list[Link] = Field(default_factory=list, max_length=20)
    live_url: OptUrl = None
    repo_url: OptUrl = None
    case_study: CaseStudy = Field(default_factory=CaseStudy)
    seo_title: Annotated[S(120) | None, BeforeValidator(_empty_to_none)] = None
    seo_description: Annotated[S(320) | None, BeforeValidator(_empty_to_none)] = None

    @model_validator(mode="after")
    def _years(self) -> "ProjectIn":
        if self.year_start is not None and self.year_end is not None and self.year_end < self.year_start:
            raise ValueError("year_end must not be before year_start")
        return self


class OrderIn(_Model):
    ids: list[int] = Field(max_length=1000)


class MediaPatch(_Model):
    alt: S(300) | None = None
    sort: int | None = Field(default=None, ge=0, le=1_000_000)


class CoverIn(_Model):
    media_id: int | None = None


class MessagePatch(_Model):
    read: bool


class LoginIn(_Model):
    email: S(254, 1)
    password: str = Field(min_length=1, max_length=256)


class ContactIn(_Model):
    name: S(120, 1)
    email: S(254, 3)
    company: S(200) = ""
    message: S(5000, 5)
    website: str | None = Field(default=None, max_length=500)  # honeypot

    @model_validator(mode="after")
    def _email(self) -> "ContactIn":
        if not EMAIL_RE.match(self.email):
            raise ValueError("email is not valid")
        return self


class Expertise(_Model):
    title: S(120) = ""
    description: S(1000) = ""
    skills: StrList(40, 80) = Field(default_factory=list)
    evidence: list[Slug] = Field(default_factory=list, max_length=30)


class Experience(_Model):
    role: S(160) = ""
    company: S(160) = ""
    location: S(160) = ""
    start: S(40) = ""
    end: S(40) = ""
    bullets: StrList(20, 600) = Field(default_factory=list)
    projects: list[Slug] = Field(default_factory=list, max_length=30)


class Education(_Model):
    degree: S(200) = ""
    school: S(200) = ""
    start: S(40) = ""
    end: S(40) = ""


class Profile(_Model):
    name: S(120) = ""
    headline: S(300) = ""
    positioning: S(600) = ""
    intro: S(2000) = ""
    location: S(160) = ""
    availability: S(300) = ""
    email: S(254) = ""
    whatsapp: S(200) = ""
    linkedin: BlankableUrl = ""
    github: BlankableUrl = ""
    youtube: BlankableUrl = ""
    resume_url: BlankableUrl = ""
    about: StrList(20, 3000) = Field(default_factory=list)
    expertise: list[Expertise] = Field(default_factory=list, max_length=30)
    experience: list[Experience] = Field(default_factory=list, max_length=40)
    education: list[Education] = Field(default_factory=list, max_length=20)

    @model_validator(mode="after")
    def _email(self) -> "Profile":
        if self.email and not EMAIL_RE.match(self.email):
            raise ValueError("email is not valid")
        return self


def format_errors(errors: list[dict]) -> str:
    """Flatten pydantic/FastAPI validation errors into one human-readable string."""
    parts = []
    for err in errors:
        loc = ".".join(str(p) for p in err.get("loc", ()) if p not in ("body", "query", "path"))
        msg = str(err.get("msg", "invalid")).removeprefix("Value error, ")
        parts.append(f"{loc}: {msg}" if loc else msg)
    return "; ".join(parts) or "Invalid request"
