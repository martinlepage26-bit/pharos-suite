"""Bcrypt-only password helpers for CompassAI auth flows."""

from __future__ import annotations

import bcrypt


def _to_bytes(value: str) -> bytes:
    return value.encode("utf-8")


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(_to_bytes(password), bcrypt.gensalt()).decode("utf-8")


def hash_secret(secret: str) -> str:
    return get_password_hash(secret)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False

    try:
        return bcrypt.checkpw(_to_bytes(plain_password), _to_bytes(hashed_password))
    except (TypeError, ValueError):
        return False
