from app.ratelimit import SlidingWindowLimiter


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t


def test_memory_is_bounded_by_max_keys():
    lim = SlidingWindowLimiter(5, 3600, clock=Clock(), max_keys=100)
    for i in range(5000):  # 10000 distinct clients inside one window, none expired
        lim.allow(f"ip-{i}")
        lim.record(f"other-{i}")
    assert len(lim._hits) <= 100


def test_existing_key_is_not_evicted_by_its_own_hit():
    lim = SlidingWindowLimiter(2, 3600, clock=Clock(), max_keys=3)
    for k in ("a", "b", "c"):
        assert lim.allow(k)
    assert lim.allow("a") and not lim.allow("a")  # "a" is oldest and the map is full, but "a" keeps counting


def test_forgive_gives_the_slot_back():
    lim = SlidingWindowLimiter(1, 60, clock=Clock())
    assert lim.allow("x") and not lim.allow("x")
    lim.forgive("x")
    assert lim.allow("x")
    lim.forgive("unknown")  # no-op


def test_expired_hits_free_keys():
    clock = Clock()
    lim = SlidingWindowLimiter(1, 60, clock=clock, max_keys=10)
    for i in range(10):
        lim.allow(str(i))
    clock.t += 61
    lim.allow("new")
    assert list(lim._hits) == ["new"]  # the map was full: expired keys were dropped, nobody live was evicted
