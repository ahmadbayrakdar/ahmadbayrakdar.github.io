from conftest import ORIGIN


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200 and r.json()["ok"] is True and "version" in r.json()


def test_security_headers_and_no_docs(client):
    r = client.get("/api/health")
    assert r.headers["x-content-type-options"] == "nosniff"
    assert r.headers["referrer-policy"] == "no-referrer"
    assert "frame-ancestors 'none'" in r.headers["content-security-policy"]
    assert client.get("/docs").status_code == 404
    assert client.get("/openapi.json").status_code == 404
    admin_r = client.get("/api/admin/projects")
    assert admin_r.headers["cache-control"] == "no-store"


def test_not_found_and_error_shape(client):
    r = client.get("/api/nope")
    assert r.status_code == 404 and r.json() == {"detail": "Not Found"}


def test_no_stack_trace_on_unhandled_error(app):
    from fastapi.testclient import TestClient

    @app.get("/api/boom")
    def boom():
        raise RuntimeError("secret internals /home/x")

    r = TestClient(app, raise_server_exceptions=False).get("/api/boom")
    assert r.status_code == 500
    assert r.json() == {"detail": "Internal server error"}


def test_profile_get_put(client, admin):
    empty = client.get("/api/profile").json()
    assert empty["name"] == "" and empty["expertise"] == []

    profile = {
        "name": "Ahmad", "headline": "Full-stack engineer", "email": "me@example.com",
        "github": "https://github.com/ahmadbayrakdar", "linkedin": "",
        "about": ["One", "Two"],
        "expertise": [{"title": "Backend", "description": "APIs", "skills": ["Python"], "evidence": ["my-project"]}],
        "experience": [{"role": "Dev", "company": "X", "start": "2020", "end": "Present",
                        "bullets": ["Did things"], "projects": ["my-project"]}],
        "education": [{"degree": "BSc", "school": "Uni", "start": "2012", "end": "2016"}],
    }
    r = client.put("/api/admin/profile", headers=admin, json=profile)
    assert r.status_code == 200
    got = client.get("/api/profile").json()
    assert got["name"] == "Ahmad" and got["about"] == ["One", "Two"]
    assert got["expertise"][0]["evidence"] == ["my-project"]
    assert client.get("/api/admin/profile", headers=admin).json() == got

    assert client.put("/api/admin/profile", headers=admin, json={"github": "javascript:1"}).status_code == 422
    assert client.put("/api/admin/profile", headers=admin, json={"email": "nope"}).status_code == 422
    assert client.put("/api/admin/profile", json=profile).status_code == 401


def test_export_shape(client, admin, make_project):
    client.put("/api/admin/profile", headers=admin, json={"name": "Ahmad"})
    make_project("exported", featured=True)
    data = client.get("/api/export").json()
    assert set(data) == {"profile", "projects", "generated_at"}
    assert data["profile"]["name"] == "Ahmad"
    p = data["projects"][0]
    for key in ("id", "slug", "title", "tagline", "summary", "category", "kind", "client", "industry", "location",
                "role", "year_start", "year_end", "status", "featured", "priority", "tech", "tags", "highlights",
                "links", "live_url", "repo_url", "case_study", "seo_title", "seo_description", "cover_media_id",
                "created_at", "updated_at", "published_at", "cover", "gallery"):
        assert key in p, key
    assert isinstance(p["tech"], list) and isinstance(p["case_study"], dict)


def test_contact_stores_message_with_hashed_ip(client, admin, settings):
    r = client.post("/api/contact", json={"name": "Jo", "email": "jo@example.com", "company": "Acme",
                                          "message": "Hello there, I have a project."},
                    headers={"X-Real-IP": "203.0.113.9"})
    assert r.status_code == 201
    msgs = client.get("/api/admin/messages", headers=admin).json()
    assert len(msgs) == 1 and msgs[0]["body"].startswith("Hello") and msgs[0]["read"] == 0
    assert "ip_hash" not in msgs[0]
    from app import db
    conn = db.connect(settings.db_path)
    stored = conn.execute("SELECT ip_hash FROM messages").fetchone()[0]
    conn.close()
    assert len(stored) == 64 and "203.0.113.9" not in stored

    mid = msgs[0]["id"]
    assert client.patch(f"/api/admin/messages/{mid}", headers=admin, json={"read": True}).json()["read"] == 1
    assert client.delete(f"/api/admin/messages/{mid}", headers=admin).status_code == 200
    assert client.get("/api/admin/messages", headers=admin).json() == []


def test_contact_validation(client):
    ok = {"name": "Jo", "email": "jo@example.com", "message": "Hello there"}
    assert client.post("/api/contact", json={**ok, "email": "not-an-email"}).status_code == 422
    assert client.post("/api/contact", json={**ok, "message": ""}).status_code == 422
    assert client.post("/api/contact", json={**ok, "name": ""}).status_code == 422


def test_contact_honeypot_accepted_but_dropped(client, admin):
    r = client.post("/api/contact", json={"name": "Bot", "email": "bot@example.com",
                                          "message": "Buy cheap stuff", "website": "http://spam.example"})
    assert r.status_code == 201
    assert client.get("/api/admin/messages", headers=admin).json() == []


def test_contact_rate_limit(client):
    body = {"name": "Jo", "email": "jo@example.com", "message": "Hello there"}
    for _ in range(5):
        assert client.post("/api/contact", json=body, headers={"X-Real-IP": "198.51.100.1"}).status_code == 201
    r = client.post("/api/contact", json=body, headers={"X-Real-IP": "198.51.100.1"})
    assert r.status_code == 429
    assert client.post("/api/contact", json=body, headers={"X-Real-IP": "198.51.100.2"}).status_code == 201


def test_cors_allowed_vs_disallowed_origin(client):
    ok = client.get("/api/health", headers={"Origin": ORIGIN})
    assert ok.headers["access-control-allow-origin"] == ORIGIN
    bad = client.get("/api/health", headers={"Origin": "https://evil.example"})
    assert "access-control-allow-origin" not in bad.headers

    pre = client.options("/api/admin/projects", headers={
        "Origin": ORIGIN, "Access-Control-Request-Method": "PUT",
        "Access-Control-Request-Headers": "authorization,content-type"})
    assert pre.status_code == 200
    assert pre.headers["access-control-allow-origin"] == ORIGIN
    assert "authorization" in pre.headers["access-control-allow-headers"].lower()
    assert "PATCH" in pre.headers["access-control-allow-methods"]
    pre_bad = client.options("/api/admin/projects", headers={
        "Origin": "https://evil.example", "Access-Control-Request-Method": "PUT"})
    assert "access-control-allow-origin" not in pre_bad.headers


def test_rebuild(client, admin, app, settings):
    assert client.post("/api/admin/rebuild", headers=admin).status_code == 503  # no token configured
    from dataclasses import replace
    app.state.settings = replace(settings, github_dispatch_token="ghp_test")
    calls = []
    app.state.dispatcher = lambda s: calls.append(s.github_repo)
    assert client.post("/api/admin/rebuild", headers=admin).json() == {"ok": True}
    assert calls == ["ahmadbayrakdar/ahmadbayrakdar.github.io"]
    assert client.post("/api/admin/rebuild").status_code == 401


def test_json_body_cap_applies_before_auth(client):
    big = b'{"email":"a@b.co","password":"x","pad":"' + b"a" * (3 * 1024 * 1024) + b'"}'
    r = client.post("/api/auth/login", content=big, headers={"Content-Type": "application/json"})
    assert r.status_code == 413
    # without a Content-Length (chunked) the stream is still cut off
    r = client.post("/api/contact", content=(big[i:i + 65536] for i in range(0, len(big), 65536)),
                    headers={"Content-Type": "application/json"})
    assert r.status_code in (400, 413)


def test_upload_route_keeps_the_large_limit(client):
    # 3 MB passes the body limit and reaches authentication (401); it is not cut off as "too large"
    r = client.post("/api/admin/projects/1/media", content=b"0" * (3 * 1024 * 1024),
                    headers={"Content-Type": "multipart/form-data; boundary=x"})
    assert r.status_code == 401
