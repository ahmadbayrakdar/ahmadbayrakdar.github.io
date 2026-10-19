import io
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import auth, db  # noqa: E402
from app.config import Settings  # noqa: E402
from app.main import create_app  # noqa: E402

# Production scrypt costs ~64 MiB / seconds on a laptop; the suite logs in dozens of times, so it runs with a cheap
# setting (test_password_hash_roundtrip checks the real parameters explicitly).
REAL_SCRYPT = (auth.SCRYPT_N, auth.SCRYPT_R, auth.SCRYPT_P)
auth.SCRYPT_N = 2 ** 10

EMAIL = "admin@example.com"
PASSWORD = "correct horse battery staple"
SECRET = "x" * 48
ORIGIN = "https://ahmadbayrakdar.github.io"


@pytest.fixture(scope="session")
def pass_hash():
    return auth.hash_password(PASSWORD)  # scrypt is slow: do it once


@pytest.fixture
def settings(tmp_path):
    return Settings(
        db_path=tmp_path / "portfolio.db",
        media_dir=tmp_path / "media",
        public_url="https://portfolio-api.test",
        secret=SECRET,
        cors_origins=(ORIGIN, "http://localhost:4321"),
        trust_proxy=True,
    )


@pytest.fixture
def app(settings, pass_hash):
    application = create_app(settings)
    conn = db.connect(settings.db_path)
    with conn:
        conn.execute("INSERT INTO users(email, pass_hash, created_at) VALUES (?,?,?)",
                     (EMAIL, pass_hash, db.utcnow()))
    conn.close()
    return application


@pytest.fixture
def client(app):
    return TestClient(app)


@pytest.fixture
def token(settings):
    return auth.create_token(settings.secret, EMAIL)[0]


@pytest.fixture
def admin(token):
    return {"Authorization": f"Bearer {token}"}


def png_bytes(w=64, h=48, mode="RGB", color=(200, 30, 30), fmt="PNG", **kw):
    buf = io.BytesIO()
    Image.new(mode, (w, h), color).save(buf, format=fmt, **kw)
    return buf.getvalue()


def project_payload(slug="my-project", **over):
    data = {"slug": slug, "title": "My Project", "summary": "Short", "category": "Web Applications",
            "kind": "Product", "status": "published", "tech": ["Python"], "year_start": 2022}
    data.update(over)
    return data


@pytest.fixture
def make_project(client, admin):
    def _make(slug="my-project", **over):
        r = client.post("/api/admin/projects", json=project_payload(slug, **over), headers=admin)
        assert r.status_code == 201, r.text
        return r.json()
    return _make
