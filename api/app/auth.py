"""Password hashing (scrypt) and stateless HMAC-signed bearer tokens."""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import threading
import time

# OWASP-recommended scrypt cost (N=2^16, r=8, p=2 -> 64 MiB per hash).
SCRYPT_N = 2 ** 16
SCRYPT_R = 8
SCRYPT_P = 2
SCRYPT_MAXMEM = 128 * 1024 * 1024
MIN_PASSWORD_LEN = 12

# Each scrypt run holds ~64 MiB. Unauthenticated login requests run in a thread pool, so without a cap a burst
# of parallel attempts would exhaust the service's memory limit. One hash at a time; the rest queue briefly.
_HASH_SLOT = threading.Semaphore(1)


def _b64e(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64d(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def _scrypt(password: str, salt: bytes, n: int, r: int, p: int) -> bytes:
    with _HASH_SLOT:
        return hashlib.scrypt(password.encode("utf-8"), salt=salt, n=n, r=r, p=p, maxmem=SCRYPT_MAXMEM, dklen=32)


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = _scrypt(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P)
    log_n = SCRYPT_N.bit_length() - 1
    return "$".join(["scrypt", str(log_n), str(SCRYPT_R), str(SCRYPT_P), _b64e(salt), _b64e(digest)])


def verify_password(password: str, stored: str) -> bool:
    try:
        scheme, log_n, r, p, salt, digest = stored.split("$")
        if scheme != "scrypt":
            return False
        expected = _b64d(digest)
        got = _scrypt(password, _b64d(salt), 1 << int(log_n), int(r), int(p))
    except (ValueError, TypeError):
        return False
    return hmac.compare_digest(got, expected)


_dummy_hash: str | None = None


def verify_dummy(password: str) -> None:
    """Burn the same time as a real check so unknown e-mails are not distinguishable by timing."""
    global _dummy_hash
    if _dummy_hash is None:
        _dummy_hash = hash_password(_b64e(os.urandom(18)))
    verify_password(password, _dummy_hash)


def _sign(secret: str, payload: str) -> str:
    return _b64e(hmac.new(secret.encode("utf-8"), payload.encode("ascii"), hashlib.sha256).digest())


def create_token(secret: str, subject: str, ttl_seconds: int = 12 * 3600, now: float | None = None) -> tuple[str, int]:
    exp = int((time.time() if now is None else now) + ttl_seconds)
    payload = _b64e(json.dumps({"sub": subject, "exp": exp}, separators=(",", ":")).encode())
    return f"{payload}.{_sign(secret, payload)}", exp


def verify_token(secret: str, token: str, now: float | None = None) -> str | None:
    """Return the subject for a valid, unexpired token; otherwise None."""
    try:
        payload, sig = token.split(".")
        if not hmac.compare_digest(sig.encode("ascii"), _sign(secret, payload).encode("ascii")):
            return None
        data = json.loads(_b64d(payload))
        if not isinstance(data, dict) or not isinstance(data.get("sub"), str):
            return None
        if int(data["exp"]) <= (time.time() if now is None else now):
            return None
        return data["sub"]
    except (ValueError, TypeError, KeyError, OverflowError):  # UnicodeError is a ValueError
        return None
