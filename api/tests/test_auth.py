import time

from app import auth

from conftest import EMAIL, PASSWORD, SECRET


def login(client, password=PASSWORD, email=EMAIL, ip="10.0.0.1"):
    return client.post("/api/auth/login", json={"email": email, "password": password},
                       headers={"X-Real-IP": ip})


def test_login_ok_and_me(client):
    r = login(client)
    assert r.status_code == 200
    body = r.json()
    assert body["token"].count(".") == 1 and body["expires_at"].endswith("Z")
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {body['token']}"})
    assert me.status_code == 200 and me.json() == {"email": EMAIL}


def test_login_wrong_password_and_unknown_user(client):
    assert login(client, "wrong password!!").status_code == 401
    assert login(client, email="nobody@example.com").status_code == 401


def test_login_lockout_after_five_failures(client):
    for _ in range(5):
        assert login(client, "bad password!!!").status_code == 401
    r = login(client, "bad password!!!")
    assert r.status_code == 429 and "Retry-After" in r.headers
    # even the right password is refused while locked out ...
    assert login(client).status_code == 429
    # ... but only for that IP
    assert login(client, ip="10.0.0.2").status_code == 200


def test_admin_requires_token(client):
    assert client.get("/api/admin/projects").status_code == 401
    assert client.get("/api/auth/me", headers={"Authorization": "Bearer nope"}).status_code == 401
    assert client.get("/api/auth/me", headers={"Authorization": "Basic abc"}).status_code == 401


def test_expired_token_rejected(client):
    token, _ = auth.create_token(SECRET, EMAIL, ttl_seconds=60, now=time.time() - 3600)
    r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 401


def test_tampered_token_rejected(client, token):
    payload, sig = token.split(".")
    other = auth.create_token(SECRET, "attacker@example.com")[0].split(".")[0]
    for bad in (f"{other}.{sig}", f"{payload}.{sig[:-2]}AA", payload, f"{payload}.{sig}.x"):
        r = client.get("/api/auth/me", headers={"Authorization": f"Bearer {bad}"})
        assert r.status_code == 401


def test_token_signed_with_other_secret_rejected(client):
    token, _ = auth.create_token("y" * 48, EMAIL)
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401


def test_token_for_deleted_user_rejected(client, token, settings):
    from app import db
    conn = db.connect(settings.db_path)
    with conn:
        conn.execute("DELETE FROM users")
    conn.close()
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401


def test_password_hash_roundtrip(monkeypatch):
    from conftest import REAL_SCRYPT
    assert REAL_SCRYPT == (2 ** 16, 8, 2)  # OWASP scrypt minimum (64 MiB, p=2)
    monkeypatch.setattr(auth, "SCRYPT_N", REAL_SCRYPT[0])
    h = auth.hash_password("a long enough password")
    assert h.startswith("scrypt$16$8$2$")
    assert auth.verify_password("a long enough password", h)
    assert not auth.verify_password("another password!!", h)
    assert not auth.verify_password("x", "garbage")


def test_successful_logins_do_not_consume_the_failure_budget(client):
    for _ in range(8):
        assert login(client).status_code == 200
    assert login(client, "bad password!!!").status_code == 401


def test_forwarded_for_header_cannot_dodge_lockout(client):
    for i in range(5):
        r = client.post("/api/auth/login", json={"email": EMAIL, "password": "bad password!!!"},
                        headers={"X-Real-IP": "10.9.9.9", "X-Forwarded-For": f"1.2.3.{i}"})
        assert r.status_code == 401
    r = client.post("/api/auth/login", json={"email": EMAIL, "password": PASSWORD},
                    headers={"X-Real-IP": "10.9.9.9", "X-Forwarded-For": "8.8.8.8"})
    assert r.status_code == 429


def test_x_real_ip_ignored_without_trust_proxy(settings, pass_hash):
    import dataclasses

    from fastapi.testclient import TestClient

    from app import db
    from app.main import create_app

    app = create_app(dataclasses.replace(settings, trust_proxy=False))
    conn = db.connect(settings.db_path)
    with conn:
        conn.execute("INSERT INTO users(email, pass_hash, created_at) VALUES (?,?,?)", (EMAIL, pass_hash, db.utcnow()))
    conn.close()
    c = TestClient(app)
    for i in range(5):  # every request claims a different address; the real peer is always the same
        assert login(c, "bad password!!!", ip=f"10.1.1.{i}").status_code == 401
    assert login(c, PASSWORD, ip="10.1.1.99").status_code == 429


def test_ipv6_clients_share_one_bucket_per_64(client):
    for i in range(5):
        assert login(client, "bad password!!!", ip=f"2001:db8:0:1::{i + 1}").status_code == 401
    assert login(client, PASSWORD, ip="2001:db8:0:1:ffff::9").status_code == 429  # same /64
    assert login(client, PASSWORD, ip="2001:db8:0:2::1").status_code == 200  # another /64


def test_ipv4_mapped_ipv6_shares_the_ipv4_bucket(client):
    for _ in range(5):
        assert login(client, "bad password!!!", ip="::ffff:10.5.5.5").status_code == 401
    assert login(client, PASSWORD, ip="10.5.5.5").status_code == 429


def test_token_with_non_finite_exp_is_rejected_not_a_500():
    payload = auth._b64e(b'{"sub":"a@b.c","exp":Infinity}')
    token = f"{payload}.{auth._sign(SECRET, payload)}"
    assert auth.verify_token(SECRET, token) is None


def test_password_hashing_is_serialized(monkeypatch):
    import hashlib
    import threading

    active = peak = 0
    lock = threading.Lock()
    real = hashlib.scrypt

    def spy(*a, **kw):
        nonlocal active, peak
        with lock:
            active += 1
            peak = max(peak, active)
        try:
            time.sleep(0.05)
            return real(*a, **kw)
        finally:
            with lock:
                active -= 1

    monkeypatch.setattr(auth.hashlib, "scrypt", spy)
    threads = [threading.Thread(target=auth.verify_dummy, args=("whatever",)) for _ in range(5)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    assert peak == 1
