import io

from PIL import Image

from conftest import png_bytes


def upload(client, admin, pid, *files):
    parts = [("files[]", (name, data, ctype)) for name, data, ctype in files]
    return client.post(f"/api/admin/projects/{pid}/media", headers=admin, files=parts)


def test_upload_creates_webp_and_thumb_and_sets_cover(client, admin, make_project, settings):
    p = make_project()
    r = upload(client, admin, p["id"], ("shot.png", png_bytes(3000, 1500), "image/png"))
    assert r.status_code == 201, r.text
    body = r.json()
    m = body["uploaded"][0]
    assert m["url"].startswith("https://portfolio-api.test/media/") and m["url"].endswith(".webp")
    assert m["width"] == 2400 and m["height"] == 1200  # long edge capped, aspect kept

    full = settings.media_dir / m["url"].rsplit("/", 1)[1]
    thumb = settings.media_dir / m["thumb_url"].rsplit("/", 1)[1]
    assert full.exists() and thumb.exists()
    with Image.open(full) as im:
        assert im.format == "WEBP" and im.size == (2400, 1200)
    with Image.open(thumb) as im:
        assert im.format == "WEBP" and max(im.size) == 800

    # first upload becomes the cover; shape is visible in the project
    assert body["project"]["cover"]["id"] == m["id"]
    assert [g["id"] for g in body["project"]["gallery"]] == [m["id"]]


def test_second_upload_keeps_cover_and_set_cover(client, admin, make_project):
    p = make_project()
    first = upload(client, admin, p["id"], ("a.png", png_bytes(), "image/png")).json()["uploaded"][0]
    two = upload(client, admin, p["id"], ("b.png", png_bytes(), "image/png"),
                 ("c.png", png_bytes(), "image/png")).json()
    assert len(two["uploaded"]) == 2
    assert two["project"]["cover"]["id"] == first["id"]
    second_id = two["uploaded"][0]["id"]
    r = client.put(f"/api/admin/projects/{p['id']}/cover", headers=admin, json={"media_id": second_id})
    assert r.status_code == 200 and r.json()["cover"]["id"] == second_id
    assert len(r.json()["gallery"]) == 3


def test_cover_must_belong_to_project(client, admin, make_project):
    a = make_project("proj-a")
    b = make_project("proj-b")
    mb = upload(client, admin, b["id"], ("b.png", png_bytes(), "image/png")).json()["uploaded"][0]
    r = client.put(f"/api/admin/projects/{a['id']}/cover", headers=admin, json={"media_id": mb["id"]})
    assert r.status_code == 400


def test_exif_stripped_and_orientation_applied(client, admin, make_project, settings):
    exif = Image.Exif()
    exif[0x0112] = 6  # rotate 90 CW on display
    exif[0x010F] = "SecretCameraMaker"
    buf = io.BytesIO()
    Image.new("RGB", (100, 40), (10, 200, 10)).save(buf, format="JPEG", exif=exif)
    p = make_project()
    m = upload(client, admin, p["id"], ("photo.jpg", buf.getvalue(), "image/jpeg")).json()["uploaded"][0]
    assert (m["width"], m["height"]) == (40, 100)  # auto-oriented
    path = settings.media_dir / m["url"].rsplit("/", 1)[1]
    assert b"SecretCameraMaker" not in path.read_bytes()
    with Image.open(path) as im:
        assert not im.getexif()


def test_media_patch_and_delete_removes_files(client, admin, make_project, settings):
    p = make_project()
    a = upload(client, admin, p["id"], ("a.png", png_bytes(), "image/png")).json()["uploaded"][0]
    b = upload(client, admin, p["id"], ("b.png", png_bytes(), "image/png")).json()["uploaded"][0]

    r = client.patch(f"/api/admin/media/{b['id']}", headers=admin, json={"alt": "A nice shot", "sort": 5})
    assert r.status_code == 200 and r.json()["alt"] == "A nice shot" and r.json()["sort"] == 5

    files = [settings.media_dir / a["url"].rsplit("/", 1)[1], settings.media_dir / a["thumb_url"].rsplit("/", 1)[1]]
    assert all(f.exists() for f in files)
    assert client.delete(f"/api/admin/media/{a['id']}", headers=admin).status_code == 200
    assert not any(f.exists() for f in files)
    assert client.delete(f"/api/admin/media/{a['id']}", headers=admin).status_code == 404

    # the deleted image was the cover: the remaining one is promoted
    assert client.get(f"/api/admin/projects/{p['id']}", headers=admin).json()["cover"]["id"] == b["id"]


def test_project_delete_removes_media_files(client, admin, make_project, settings):
    p = make_project()
    upload(client, admin, p["id"], ("a.png", png_bytes(), "image/png"))
    assert len(list(settings.media_dir.iterdir())) == 2
    client.delete(f"/api/admin/projects/{p['id']}", headers=admin)
    assert list(settings.media_dir.iterdir()) == []


def test_non_image_rejected(client, admin, make_project, settings):
    p = make_project()
    r = upload(client, admin, p["id"], ("evil.png", b"<?php echo 1; ?>", "image/png"))
    assert r.status_code in (400, 415)
    r = upload(client, admin, p["id"], ("doc.txt", b"hello", "text/plain"))
    assert r.status_code in (400, 415)
    assert list(settings.media_dir.iterdir()) == []


def test_svg_rejected(client, admin, make_project):
    p = make_project()
    svg = b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
    assert upload(client, admin, p["id"], ("x.svg", svg, "image/svg+xml")).status_code in (400, 415)


def test_batch_is_all_or_nothing(client, admin, make_project, settings):
    p = make_project()
    r = upload(client, admin, p["id"], ("ok.png", png_bytes(), "image/png"), ("bad.png", b"nope", "image/png"))
    assert r.status_code in (400, 415)
    assert list(settings.media_dir.iterdir()) == []
    assert client.get(f"/api/admin/projects/{p['id']}", headers=admin).json()["gallery"] == []


def test_decompression_bomb_rejected(client, admin, make_project):
    big = Image.new("1", (9000, 9000))  # 81M pixels, compresses to a few KB
    buf = io.BytesIO()
    big.save(buf, format="PNG")
    assert len(buf.getvalue()) < 1_000_000
    p = make_project()
    r = upload(client, admin, p["id"], ("bomb.png", buf.getvalue(), "image/png"))
    assert r.status_code == 400 and "large" in r.json()["detail"]


def test_upload_requires_auth_and_existing_project(client, admin):
    r = client.post("/api/admin/projects/1/media", files=[("files[]", ("a.png", png_bytes(), "image/png"))])
    assert r.status_code == 401
    assert upload(client, admin, 999, ("a.png", png_bytes(), "image/png")).status_code == 404


def test_body_limit(client, admin, make_project):
    p = make_project()
    blob = b"0" * (17 * 1024 * 1024)
    r = client.post(f"/api/admin/projects/{p['id']}/media", headers=admin,
                    files=[("files[]", ("big.png", blob, "image/png"))])
    assert r.status_code == 413


def test_pixel_cap_rejects_before_decoding(client, admin, make_project):
    big = Image.new("1", (6500, 5000))  # 32.5 MP: over the 30 MP memory cap, tiny on the wire
    buf = io.BytesIO()
    big.save(buf, format="PNG")
    p = make_project()
    r = upload(client, admin, p["id"], ("big.png", buf.getvalue(), "image/png"))
    assert r.status_code == 400 and "large" in r.json()["detail"]


def test_large_upload_over_json_cap_is_accepted(client, admin, make_project):
    import os
    noise = Image.frombytes("RGB", (900, 900), os.urandom(900 * 900 * 3))
    buf = io.BytesIO()
    noise.save(buf, format="PNG")
    assert len(buf.getvalue()) > 2 * 1024 * 1024  # bigger than the JSON body cap
    p = make_project()
    assert upload(client, admin, p["id"], ("noise.png", buf.getvalue(), "image/png")).status_code == 201


def test_big_jpeg_is_downscaled(client, admin, make_project):
    buf = io.BytesIO()
    Image.new("RGB", (5000, 3000), (30, 60, 90)).save(buf, format="JPEG")
    p = make_project()
    m = upload(client, admin, p["id"], ("wide.jpg", buf.getvalue(), "image/jpeg")).json()["uploaded"][0]
    assert max(m["width"], m["height"]) <= 2400 and abs(m["width"] / m["height"] - 5 / 3) < 0.01


def test_multi_picture_jpeg_is_accepted(client, admin, make_project):
    buf = io.BytesIO()
    a = Image.new("RGB", (64, 48), (200, 0, 0))
    a.save(buf, format="MPO", save_all=True, append_images=[Image.new("RGB", (64, 48), (0, 0, 200))])
    assert Image.open(io.BytesIO(buf.getvalue())).format == "MPO"
    p = make_project()
    assert upload(client, admin, p["id"], ("phone.jpg", buf.getvalue(), "image/jpeg")).status_code == 201


def test_gps_exif_and_icc_not_carried_over(client, admin, make_project, settings):
    exif = Image.Exif()
    gps = exif.get_ifd(0x8825)
    gps[1] = "N"
    gps[2] = (51.0, 30.0, 0.0)
    buf = io.BytesIO()
    Image.new("RGB", (100, 80), (1, 2, 3)).save(buf, format="JPEG", exif=exif, icc_profile=b"ICCPROFILEMARKER" * 4)
    p = make_project()
    m = upload(client, admin, p["id"], ("geo.jpg", buf.getvalue(), "image/jpeg")).json()["uploaded"][0]
    raw = (settings.media_dir / m["url"].rsplit("/", 1)[1]).read_bytes()
    assert b"EXIF" not in raw and b"ICCPROFILEMARKER" not in raw


def test_concurrent_uploads_get_distinct_sort_and_one_cover(client, admin, make_project):
    """The admin UI uploads two files at once; a stale 'no cover yet' read must not overwrite the first cover."""
    from app import db
    from app.routers import media as media_router
    p = make_project("racy")
    settings = client.app.state.settings
    conn = db.connect(settings.db_path)
    stale = {"id": p["id"], "slug": p["slug"], "cover_media_id": None}  # both requests read "no cover" up front
    first = media_router._ingest(conn, settings, "t", stale, [("a.png", png_bytes(color=(1, 2, 3)))])
    second = media_router._ingest(conn, settings, "t", stale, [("b.png", png_bytes(color=(9, 8, 7)))])
    conn.close()
    got = client.get(f"/api/admin/projects/{p['id']}", headers=admin).json()
    assert got["cover"]["id"] == first[0]["id"]  # not overwritten by the second ingest
    assert first[0]["sort"] < second[0]["sort"]
