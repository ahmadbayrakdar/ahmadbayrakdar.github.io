from conftest import project_payload


def test_crud_roundtrip(client, admin):
    r = client.post("/api/admin/projects", headers=admin, json=project_payload(
        links=[{"label": "Docs", "url": "https://example.com/docs"}], featured=True,
        case_study={"overview": "Hello", "challenges": [{"challenge": "a", "solution": "b"}]}))
    assert r.status_code == 201
    p = r.json()
    assert p["slug"] == "my-project" and p["featured"] == 1 and p["cover"] is None and p["gallery"] == []
    assert p["case_study"] == {"overview": "Hello", "challenges": [{"challenge": "a", "solution": "b"}]}
    assert p["published_at"] and p["priority"] == 10

    got = client.get(f"/api/admin/projects/{p['id']}", headers=admin).json()
    assert got == p

    upd = client.put(f"/api/admin/projects/{p['id']}", headers=admin,
                     json={"title": "Renamed", "tech": ["Go", " Rust "]})
    assert upd.status_code == 200
    u = upd.json()
    assert u["title"] == "Renamed" and u["tech"] == ["Go", "Rust"] and u["slug"] == "my-project"
    assert u["featured"] == 1 and u["links"] == p["links"]  # untouched fields are kept

    assert client.delete(f"/api/admin/projects/{p['id']}", headers=admin).json() == {"ok": True}
    assert client.get(f"/api/admin/projects/{p['id']}", headers=admin).status_code == 404
    assert client.delete(f"/api/admin/projects/{p['id']}", headers=admin).status_code == 404


def test_validation_errors(client, admin):
    bad_cases = [
        {"slug": "Bad Slug"},
        {"slug": "a"},
        {"slug": "x" * 81},
        {"title": ""},
        {"category": "Nope"},
        {"kind": "Nope"},
        {"status": "archived"},
        {"summary": "x" * 281},
        {"live_url": "javascript:alert(1)"},
        {"repo_url": "ftp://example.com/x"},
        {"links": [{"label": "x", "url": "file:///etc/passwd"}]},
        {"year_start": 2024, "year_end": 2020},
        {"tech": ["x" * 61]},
    ]
    for over in bad_cases:
        r = client.post("/api/admin/projects", headers=admin, json=project_payload(**over))
        assert r.status_code == 422, over
        assert isinstance(r.json()["detail"], str) and r.json()["detail"]
    # nothing was created
    assert client.get("/api/admin/projects", headers=admin).json() == []


def test_update_validation(client, admin, make_project):
    p = make_project()
    r = client.put(f"/api/admin/projects/{p['id']}", headers=admin, json={"category": "Nope"})
    assert r.status_code == 422 and "category" in r.json()["detail"]


def test_empty_url_becomes_null(client, admin):
    p = client.post("/api/admin/projects", headers=admin, json=project_payload(live_url="  ")).json()
    assert p["live_url"] is None


def test_slug_uniqueness(client, admin, make_project):
    a = make_project("alpha")
    make_project("beta")
    r = client.post("/api/admin/projects", headers=admin, json=project_payload("alpha"))
    assert r.status_code == 409
    r = client.put(f"/api/admin/projects/{a['id']}", headers=admin, json={"slug": "beta"})
    assert r.status_code == 409
    assert client.put(f"/api/admin/projects/{a['id']}", headers=admin, json={"slug": "alpha"}).status_code == 200


def test_draft_hidden_from_public_and_export(client, admin, make_project):
    make_project("live-one", status="published")
    make_project("secret-one", status="draft")
    slugs = [p["slug"] for p in client.get("/api/projects").json()]
    assert slugs == ["live-one"]
    assert client.get("/api/projects/secret-one").status_code == 404
    assert client.get("/api/projects/live-one").status_code == 200
    export = client.get("/api/export").json()
    assert [p["slug"] for p in export["projects"]] == ["live-one"]
    admin_slugs = {p["slug"] for p in client.get("/api/admin/projects", headers=admin).json()}
    assert admin_slugs == {"live-one", "secret-one"}


def test_ordering_featured_first_then_priority_and_reorder(client, admin, make_project):
    a = make_project("aaa", priority=30)
    b = make_project("bbb", priority=20)
    c = make_project("ccc", priority=10, featured=False)
    f = make_project("fff", priority=99, featured=True)

    def slugs():
        return [p["slug"] for p in client.get("/api/projects").json()]

    assert slugs() == ["fff", "ccc", "bbb", "aaa"]

    r = client.put("/api/admin/projects/order", headers=admin, json={"ids": [a["id"], b["id"], c["id"], f["id"]]})
    assert r.status_code == 200
    assert slugs() == ["fff", "aaa", "bbb", "ccc"]  # featured still first
    pri = {p["slug"]: p["priority"] for p in client.get("/api/admin/projects", headers=admin).json()}
    assert pri == {"aaa": 10, "bbb": 20, "ccc": 30, "fff": 40}

    assert client.put("/api/admin/projects/order", headers=admin, json={"ids": [a["id"], a["id"]]}).status_code == 400
    assert client.put("/api/admin/projects/order", headers=admin, json={"ids": [9999]}).status_code == 400


def test_public_filters(client, make_project):
    make_project("one", category="E-commerce", featured=True)
    make_project("two", category="UI/UX Design")
    assert [p["slug"] for p in client.get("/api/projects", params={"category": "E-commerce"}).json()] == ["one"]
    assert [p["slug"] for p in client.get("/api/projects", params={"featured": "1"}).json()] == ["one"]
    listed = client.get("/api/projects").json()[0]
    assert "case_study" not in listed and "cover" in listed


def test_admin_write_is_audited(client, admin, make_project, settings):
    from app import db
    p = make_project("audited")
    client.delete(f"/api/admin/projects/{p['id']}", headers=admin)
    conn = db.connect(settings.db_path)
    actions = [r["action"] for r in conn.execute("SELECT action FROM audit ORDER BY id")]
    conn.close()
    assert actions == ["project.create", "project.delete"]


def test_personal_and_early_work_category(client, admin):
    r = client.post("/api/admin/projects", headers=admin,
                    json=project_payload("early-days", category="Personal & Early Work"))
    assert r.status_code == 201 and r.json()["category"] == "Personal & Early Work"


def test_null_text_fields_mean_empty(client, admin):
    """The admin UI sends null for blank optional text and profile fields; that must not be a 422."""
    r = client.post("/api/admin/projects", headers=admin, json=project_payload(
        "nulls", tagline=None, summary=None, client=None, industry=None, location=None, role=None,
        live_url=None, year_end=None, seo_title=None))
    assert r.status_code == 201, r.text
    p = r.json()
    assert p["tagline"] == "" and p["client"] == "" and p["live_url"] is None
    r = client.put(f"/api/admin/projects/{p['id']}", headers=admin, json={"tagline": "x"})
    assert r.json()["tagline"] == "x"
    r = client.put(f"/api/admin/projects/{p['id']}", headers=admin, json={"tagline": None})
    assert r.status_code == 200 and r.json()["tagline"] == ""  # null clears the field

    prof = client.get("/api/admin/profile", headers=admin).json()
    prof.update(linkedin=None, whatsapp=None, experience=[{"role": "Dev", "company": "X", "end": None}])
    r = client.put("/api/admin/profile", headers=admin, json=prof)
    assert r.status_code == 200, r.text
    assert r.json()["linkedin"] == "" and r.json()["experience"][0]["end"] == ""
