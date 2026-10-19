"""In-memory sliding-window rate limiter keyed by an arbitrary string (the client IP)."""
from __future__ import annotations

import threading
import time
from collections import deque
from typing import Callable


class SlidingWindowLimiter:
    def __init__(self, limit: int, window_seconds: float, clock: Callable[[], float] = time.monotonic,
                 max_keys: int = 10000):
        self.limit = limit
        self.window = window_seconds
        self._clock = clock
        self._max_keys = max_keys
        self._hits: dict[str, deque[float]] = {}
        self._next_gc = 0.0
        self._lock = threading.Lock()

    def _prune(self, key: str, now: float) -> deque[float]:
        q = self._hits.get(key)
        if q is None:
            return deque()
        cutoff = now - self.window
        while q and q[0] <= cutoff:
            q.popleft()
        if not q:
            self._hits.pop(key, None)
        return q

    def _gc(self, now: float, key: str) -> None:
        """Bound memory: drop expired keys, then evict the oldest keys if still at the cap."""
        if len(self._hits) >= self._max_keys and now >= self._next_gc:
            self._next_gc = now + max(1.0, self.window / 10)
            for k in list(self._hits):
                self._prune(k, now)
        while key not in self._hits and len(self._hits) >= self._max_keys:
            self._hits.pop(next(iter(self._hits)))  # dicts keep insertion order: oldest first

    def is_blocked(self, key: str) -> bool:
        with self._lock:
            return len(self._prune(key, self._clock())) >= self.limit

    def record(self, key: str) -> None:
        with self._lock:
            now = self._clock()
            self._gc(now, key)
            self._prune(key, now)
            self._hits.setdefault(key, deque()).append(now)

    def allow(self, key: str) -> bool:
        """Atomically check and record one hit. False means the limit is exhausted."""
        with self._lock:
            now = self._clock()
            q = self._prune(key, now)
            if len(q) >= self.limit:
                return False
            self._gc(now, key)
            self._hits.setdefault(key, deque()).append(now)
            return True

    def forgive(self, key: str) -> None:
        """Undo the most recent hit for key (a reserved attempt that turned out to be fine)."""
        with self._lock:
            q = self._hits.get(key)
            if q:
                q.pop()
                if not q:
                    self._hits.pop(key, None)

    def retry_after(self, key: str) -> int:
        with self._lock:
            now = self._clock()
            q = self._prune(key, now)
            if len(q) < self.limit:
                return 0
            return max(1, int(q[0] + self.window - now) + 1)
