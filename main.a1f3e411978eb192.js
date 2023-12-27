"use strict";
(self.webpackChunkportfolio_2024_all_skills =
  self.webpackChunkportfolio_2024_all_skills || []).push([
  [179],
  {
    63: () => {
      function J(e) {
        return "function" == typeof e;
      }
      function co(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const Pi = co(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function uo(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class Ye {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (J(r))
              try {
                r();
              } catch (i) {
                t = i instanceof Pi ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  ff(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof Pi ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Pi(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) ff(t);
            else {
              if (t instanceof Ye) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && uo(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && uo(n, t), t instanceof Ye && t._removeParent(this);
        }
      }
      Ye.EMPTY = (() => {
        const e = new Ye();
        return (e.closed = !0), e;
      })();
      const lf = Ye.EMPTY;
      function df(e) {
        return (
          e instanceof Ye ||
          (e && "closed" in e && J(e.remove) && J(e.add) && J(e.unsubscribe))
        );
      }
      function ff(e) {
        J(e) ? e() : e.unsubscribe();
      }
      const xn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        ki = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = ki;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = ki;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function hf(e) {
        ki.setTimeout(() => {
          const { onUnhandledError: t } = xn;
          if (!t) throw e;
          t(e);
        });
      }
      function Ya() {}
      const Gw = Xa("C", void 0, void 0);
      function Xa(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let Rn = null;
      function Fi(e) {
        if (xn.useDeprecatedSynchronousErrorHandling) {
          const t = !Rn;
          if ((t && (Rn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = Rn;
            if (((Rn = null), n)) throw r;
          }
        } else e();
      }
      class Ja extends Ye {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), df(t) && t.add(this))
              : (this.destination = Kw);
        }
        static create(t, n, r) {
          return new lo(t, n, r);
        }
        next(t) {
          this.isStopped
            ? ec(
                (function Zw(e) {
                  return Xa("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? ec(
                (function Ww(e) {
                  return Xa("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? ec(Gw, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const Yw = Function.prototype.bind;
      function Ka(e, t) {
        return Yw.call(e, t);
      }
      class Xw {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Li(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Li(r);
            }
          else Li(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Li(n);
            }
        }
      }
      class lo extends Ja {
        constructor(t, n, r) {
          let o;
          if ((super(), J(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && xn.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && Ka(t.next, i),
                  error: t.error && Ka(t.error, i),
                  complete: t.complete && Ka(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new Xw(o);
        }
      }
      function Li(e) {
        xn.useDeprecatedSynchronousErrorHandling
          ? (function Qw(e) {
              xn.useDeprecatedSynchronousErrorHandling &&
                Rn &&
                ((Rn.errorThrown = !0), (Rn.error = e));
            })(e)
          : hf(e);
      }
      function ec(e, t) {
        const { onStoppedNotification: n } = xn;
        n && ki.setTimeout(() => n(e, t));
      }
      const Kw = {
          closed: !0,
          next: Ya,
          error: function Jw(e) {
            throw e;
          },
          complete: Ya,
        },
        tc =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function dn(e) {
        return e;
      }
      function pf(e) {
        return 0 === e.length
          ? dn
          : 1 === e.length
          ? e[0]
          : function (n) {
              return e.reduce((r, o) => o(r), n);
            };
      }
      let ge = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function n_(e) {
              return (
                (e && e instanceof Ja) ||
                ((function t_(e) {
                  return e && J(e.next) && J(e.error) && J(e.complete);
                })(e) &&
                  df(e))
              );
            })(n)
              ? n
              : new lo(n, r, o);
            return (
              Fi(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = gf(r))((o, i) => {
              const s = new lo({
                next: (a) => {
                  try {
                    n(a);
                  } catch (c) {
                    i(c), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [tc]() {
            return this;
          }
          pipe(...n) {
            return pf(n)(this);
          }
          toPromise(n) {
            return new (n = gf(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function gf(e) {
        var t;
        return null !== (t = e ?? xn.Promise) && void 0 !== t ? t : Promise;
      }
      const r_ = co(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let st = (() => {
        class e extends ge {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new mf(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new r_();
          }
          next(n) {
            Fi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            Fi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            Fi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? lf
              : ((this.currentObservers = null),
                i.push(n),
                new Ye(() => {
                  (this.currentObservers = null), uo(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new ge();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new mf(t, n)), e;
      })();
      class mf extends st {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : lf;
        }
      }
      function vf(e) {
        return J(e?.lift);
      }
      function me(e) {
        return (t) => {
          if (vf(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function ve(e, t, n, r, o) {
        return new o_(e, t, n, r, o);
      }
      class o_ extends Ja {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (c) {
                    t.error(c);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (c) {
                    t.error(c);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function ee(e, t) {
        return me((n, r) => {
          let o = 0;
          n.subscribe(
            ve(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function fn(e) {
        return this instanceof fn ? ((this.v = e), this) : new fn(e);
      }
      function wf(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function ic(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, c) {
                !(function o(i, s, a, c) {
                  Promise.resolve(c).then(function (u) {
                    i({ value: u, done: a });
                  }, s);
                })(a, c, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const _f = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Ef(e) {
        return J(e?.then);
      }
      function bf(e) {
        return J(e[tc]);
      }
      function Mf(e) {
        return Symbol.asyncIterator && J(e?.[Symbol.asyncIterator]);
      }
      function If(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Sf = (function I_() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Tf(e) {
        return J(e?.[Sf]);
      }
      function Af(e) {
        return (function Df(e, t, n) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var o,
            r = n.apply(e, t || []),
            i = [];
          return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
              return this;
            }),
            o
          );
          function s(f) {
            r[f] &&
              (o[f] = function (h) {
                return new Promise(function (p, g) {
                  i.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function c(f) {
                f.value instanceof fn
                  ? Promise.resolve(f.value.v).then(u, l)
                  : d(i[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(i[0][3], p);
            }
          }
          function u(f) {
            a("next", f);
          }
          function l(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
          }
        })(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield fn(n.read());
              if (o) return yield fn(void 0);
              yield yield fn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Of(e) {
        return J(e?.getReader);
      }
      function at(e) {
        if (e instanceof ge) return e;
        if (null != e) {
          if (bf(e))
            return (function S_(e) {
              return new ge((t) => {
                const n = e[tc]();
                if (J(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (_f(e))
            return (function T_(e) {
              return new ge((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Ef(e))
            return (function A_(e) {
              return new ge((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, hf);
              });
            })(e);
          if (Mf(e)) return xf(e);
          if (Tf(e))
            return (function O_(e) {
              return new ge((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (Of(e))
            return (function x_(e) {
              return xf(Af(e));
            })(e);
        }
        throw If(e);
      }
      function xf(e) {
        return new ge((t) => {
          (function R_(e, t) {
            var n, r, o, i;
            return (function yf(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(l) {
                  try {
                    u(r.next(l));
                  } catch (d) {
                    s(d);
                  }
                }
                function c(l) {
                  try {
                    u(r.throw(l));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(l) {
                  l.done
                    ? i(l.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(l.value).then(a, c);
                }
                u((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = wf(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function zt(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Ee(e, t, n = 1 / 0) {
        return J(t)
          ? Ee((r, o) => ee((i, s) => t(r, i, o, s))(at(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            me((r, o) =>
              (function N_(e, t, n, r, o, i, s, a) {
                const c = [];
                let u = 0,
                  l = 0,
                  d = !1;
                const f = () => {
                    d && !c.length && !u && t.complete();
                  },
                  h = (g) => (u < r ? p(g) : c.push(g)),
                  p = (g) => {
                    i && t.next(g), u++;
                    let v = !1;
                    at(n(g, l++)).subscribe(
                      ve(
                        t,
                        (C) => {
                          o?.(C), i ? h(C) : t.next(C);
                        },
                        () => {
                          v = !0;
                        },
                        void 0,
                        () => {
                          if (v)
                            try {
                              for (u--; c.length && u < r; ) {
                                const C = c.shift();
                                s ? zt(t, s, () => p(C)) : p(C);
                              }
                              f();
                            } catch (C) {
                              t.error(C);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    ve(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      function Kn(e = 1 / 0) {
        return Ee(dn, e);
      }
      const At = new ge((e) => e.complete());
      function sc(e) {
        return e[e.length - 1];
      }
      function fo(e) {
        return (function k_(e) {
          return e && J(e.schedule);
        })(sc(e))
          ? e.pop()
          : void 0;
      }
      function Rf(e, t = 0) {
        return me((n, r) => {
          n.subscribe(
            ve(
              r,
              (o) => zt(r, e, () => r.next(o), t),
              () => zt(r, e, () => r.complete(), t),
              (o) => zt(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function Nf(e, t = 0) {
        return me((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Pf(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ge((n) => {
          zt(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            zt(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function be(e, t) {
        return t
          ? (function U_(e, t) {
              if (null != e) {
                if (bf(e))
                  return (function j_(e, t) {
                    return at(e).pipe(Nf(t), Rf(t));
                  })(e, t);
                if (_f(e))
                  return (function $_(e, t) {
                    return new ge((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Ef(e))
                  return (function H_(e, t) {
                    return at(e).pipe(Nf(t), Rf(t));
                  })(e, t);
                if (Mf(e)) return Pf(e, t);
                if (Tf(e))
                  return (function V_(e, t) {
                    return new ge((n) => {
                      let r;
                      return (
                        zt(n, t, () => {
                          (r = e[Sf]()),
                            zt(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => J(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (Of(e))
                  return (function B_(e, t) {
                    return Pf(Af(e), t);
                  })(e, t);
              }
              throw If(e);
            })(e, t)
          : at(e);
      }
      class ct extends st {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function x(...e) {
        return be(e, fo(e));
      }
      function kf(e = {}) {
        const {
          connector: t = () => new st(),
          resetOnError: n = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: o = !0,
        } = e;
        return (i) => {
          let s,
            a,
            c,
            u = 0,
            l = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = c = void 0), (l = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return me((g, v) => {
            u++, !d && !l && f();
            const C = (c = c ?? t());
            v.add(() => {
              u--, 0 === u && !d && !l && (a = ac(p, o));
            }),
              C.subscribe(v),
              !s &&
                u > 0 &&
                ((s = new lo({
                  next: (m) => C.next(m),
                  error: (m) => {
                    (d = !0), f(), (a = ac(h, n, m)), C.error(m);
                  },
                  complete: () => {
                    (l = !0), f(), (a = ac(h, r)), C.complete();
                  },
                })),
                at(g).subscribe(s));
          })(i);
        };
      }
      function ac(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new lo({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return at(t(...n)).subscribe(r);
      }
      function Ot(e, t) {
        return me((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            ve(
              r,
              (c) => {
                o?.unsubscribe();
                let u = 0;
                const l = i++;
                at(e(c, l)).subscribe(
                  (o = ve(
                    r,
                    (d) => r.next(t ? t(c, d, l, u++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function G_(e, t) {
        return e === t;
      }
      const ji = co(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function hn(e, t) {
        return me((n, r) => {
          let o = 0;
          n.subscribe(ve(r, (i) => e.call(t, i, o++) && r.next(i)));
        });
      }
      function er(e) {
        return e <= 0
          ? () => At
          : me((t, n) => {
              let r = 0;
              t.subscribe(
                ve(n, (o) => {
                  ++r <= e && (n.next(o), e <= r && n.complete());
                })
              );
            });
      }
      function Hi(e) {
        return me((t, n) => {
          let r = !1;
          t.subscribe(
            ve(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function Ff(e = W_) {
        return me((t, n) => {
          let r = !1;
          t.subscribe(
            ve(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function W_() {
        return new ji();
      }
      function qt(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? hn((o, i) => e(o, i, r)) : dn,
            er(1),
            n ? Hi(t) : Ff(() => new ji())
          );
      }
      function Q(e) {
        for (let t in e) if (e[t] === Q) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function ye(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(ye).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function cc(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const Z_ = Q({ __forward_ref__: Q });
      function uc(e) {
        return (
          (e.__forward_ref__ = uc),
          (e.toString = function () {
            return ye(this());
          }),
          e
        );
      }
      function R(e) {
        return lc(e) ? e() : e;
      }
      function lc(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(Z_) &&
          e.__forward_ref__ === uc
        );
      }
      function dc(e) {
        return e && !!e.ɵproviders;
      }
      const Lf = "https://g.co/ng/security#xss";
      class D extends Error {
        constructor(t, n) {
          super(
            (function ho(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function N(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function fc(e, t) {
        throw new D(-201, !1);
      }
      function ut(e, t) {
        null == e &&
          (function A(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function I(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function Gt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Vi(e) {
        return jf(e, Ui) || jf(e, Hf);
      }
      function jf(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Bi(e) {
        return e && (e.hasOwnProperty(hc) || e.hasOwnProperty(nE))
          ? e[hc]
          : null;
      }
      const Ui = Q({ ɵprov: Q }),
        hc = Q({ ɵinj: Q }),
        Hf = Q({ ngInjectableDef: Q }),
        nE = Q({ ngInjectorDef: Q });
      var $ = (function (e) {
        return (
          (e[(e.Default = 0)] = "Default"),
          (e[(e.Host = 1)] = "Host"),
          (e[(e.Self = 2)] = "Self"),
          (e[(e.SkipSelf = 4)] = "SkipSelf"),
          (e[(e.Optional = 8)] = "Optional"),
          e
        );
      })($ || {});
      let pc;
      function Ue(e) {
        const t = pc;
        return (pc = e), t;
      }
      function Vf(e, t, n) {
        const r = Vi(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & $.Optional
          ? null
          : void 0 !== t
          ? t
          : void fc(ye(e));
      }
      const te = globalThis,
        po = {},
        Cc = "__NG_DI_FLAG__",
        zi = "ngTempTokenPath",
        iE = /\n/gm,
        Uf = "__source";
      let tr;
      function pn(e) {
        const t = tr;
        return (tr = e), t;
      }
      function cE(e, t = $.Default) {
        if (void 0 === tr) throw new D(-203, !1);
        return null === tr
          ? Vf(e, void 0, t)
          : tr.get(e, t & $.Optional ? null : void 0, t);
      }
      function M(e, t = $.Default) {
        return (
          (function $f() {
            return pc;
          })() || cE
        )(R(e), t);
      }
      function _(e, t = $.Default) {
        return M(e, qi(t));
      }
      function qi(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Dc(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = R(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new D(900, !1);
            let o,
              i = $.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                c = uE(a);
              "number" == typeof c
                ? -1 === c
                  ? (o = a.token)
                  : (i |= c)
                : (o = a);
            }
            t.push(M(o, i));
          } else t.push(M(r));
        }
        return t;
      }
      function go(e, t) {
        return (e[Cc] = t), (e.prototype[Cc] = t), e;
      }
      function uE(e) {
        return e[Cc];
      }
      function Wt(e) {
        return { toString: e }.toString();
      }
      var Gi = (function (e) {
          return (
            (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
          );
        })(Gi || {}),
        Ct = (function (e) {
          return (
            (e[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            e
          );
        })(Ct || {});
      const xt = {},
        q = [],
        Wi = Q({ ɵcmp: Q }),
        wc = Q({ ɵdir: Q }),
        _c = Q({ ɵpipe: Q }),
        qf = Q({ ɵmod: Q }),
        Zt = Q({ ɵfac: Q }),
        mo = Q({ __NG_ELEMENT_ID__: Q }),
        Gf = Q({ __NG_ENV_ID__: Q });
      function Wf(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      function Ec(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            Qf(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function Zf(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Qf(e) {
        return 64 === e.charCodeAt(0);
      }
      function vo(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  Yf(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function Yf(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      const Xf = "ng-template";
      function fE(e, t, n) {
        let r = 0,
          o = !0;
        for (; r < e.length; ) {
          let i = e[r++];
          if ("string" == typeof i && o) {
            const s = e[r++];
            if (n && "class" === i && -1 !== Wf(s.toLowerCase(), t, 0))
              return !0;
          } else {
            if (1 === i) {
              for (; r < e.length && "string" == typeof (i = e[r++]); )
                if (i.toLowerCase() === t) return !0;
              return !1;
            }
            "number" == typeof i && (o = !1);
          }
        }
        return !1;
      }
      function Jf(e) {
        return 4 === e.type && e.value !== Xf;
      }
      function hE(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Xf);
      }
      function pE(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function vE(e) {
            for (let t = 0; t < e.length; t++) if (Zf(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const c = t[a];
          if ("number" != typeof c) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== c && !hE(e, c, n)) || ("" === c && 1 === t.length))
                ) {
                  if (Dt(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? c : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!fE(e.attrs, u, n)) {
                    if (Dt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = gE(8 & r ? "class" : c, o, Jf(e), n);
                if (-1 === d) {
                  if (Dt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Wf(h, u, 0)) || (2 & r && u !== f)) {
                    if (Dt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Dt(r) && !Dt(c)) return !1;
            if (s && Dt(c)) continue;
            (s = !1), (r = c | (1 & r));
          }
        }
        return Dt(r) || s;
      }
      function Dt(e) {
        return 0 == (1 & e);
      }
      function gE(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function yE(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function Kf(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (pE(e, t[r], n)) return !0;
        return !1;
      }
      function eh(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function DE(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !Dt(s) && ((t += eh(i, o)), (o = "")),
              (r = s),
              (i = i || !Dt(r));
          n++;
        }
        return "" !== o && (t += eh(i, o)), t;
      }
      function gn(e) {
        return Wt(() => {
          const t = nh(e),
            n = {
              ...t,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === Gi.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (t.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              signals: e.signals ?? !1,
              data: e.data || {},
              encapsulation: e.encapsulation || Ct.Emulated,
              styles: e.styles || q,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          rh(n);
          const r = e.dependencies;
          return (
            (n.directiveDefs = Zi(r, !1)),
            (n.pipeDefs = Zi(r, !0)),
            (n.id = (function TE(e) {
              let t = 0;
              const n = [
                e.selectors,
                e.ngContentSelectors,
                e.hostVars,
                e.hostAttrs,
                e.consts,
                e.vars,
                e.decls,
                e.encapsulation,
                e.standalone,
                e.signals,
                e.exportAs,
                JSON.stringify(e.inputs),
                JSON.stringify(e.outputs),
                Object.getOwnPropertyNames(e.type.prototype),
                !!e.contentQueries,
                !!e.viewQuery,
              ].join("|");
              for (const o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
              return (t += 2147483648), "c" + t;
            })(n)),
            n
          );
        });
      }
      function bE(e) {
        return U(e) || Me(e);
      }
      function ME(e) {
        return null !== e;
      }
      function mn(e) {
        return Wt(() => ({
          type: e.type,
          bootstrap: e.bootstrap || q,
          declarations: e.declarations || q,
          imports: e.imports || q,
          exports: e.exports || q,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function th(e, t) {
        if (null == e) return xt;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      function Pe(e) {
        return Wt(() => {
          const t = nh(e);
          return rh(t), t;
        });
      }
      function U(e) {
        return e[Wi] || null;
      }
      function Me(e) {
        return e[wc] || null;
      }
      function ke(e) {
        return e[_c] || null;
      }
      function Je(e, t) {
        const n = e[qf] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${ye(e)} does not have '\u0275mod' property.`);
        return n;
      }
      function nh(e) {
        const t = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: t,
          inputTransforms: null,
          inputConfig: e.inputs || xt,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          signals: !0 === e.signals,
          selectors: e.selectors || q,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: th(e.inputs, t),
          outputs: th(e.outputs),
        };
      }
      function rh(e) {
        e.features?.forEach((t) => t(e));
      }
      function Zi(e, t) {
        if (!e) return null;
        const n = t ? ke : bE;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => n(r)).filter(ME);
      }
      const ue = 0,
        w = 1,
        F = 2,
        se = 3,
        wt = 4,
        yo = 5,
        xe = 6,
        rr = 7,
        de = 8,
        vn = 9,
        or = 10,
        P = 11,
        Co = 12,
        oh = 13,
        ir = 14,
        fe = 15,
        Do = 16,
        sr = 17,
        Rt = 18,
        wo = 19,
        ih = 20,
        yn = 21,
        Qt = 22,
        _o = 23,
        Eo = 24,
        V = 25,
        bc = 1,
        sh = 2,
        Nt = 7,
        ar = 9,
        bo = 10,
        Ie = 11;
      function qe(e) {
        return Array.isArray(e) && "object" == typeof e[bc];
      }
      function Fe(e) {
        return Array.isArray(e) && !0 === e[bc];
      }
      function Mc(e) {
        return 0 != (4 & e.flags);
      }
      function Pn(e) {
        return e.componentOffset > -1;
      }
      function Yi(e) {
        return 1 == (1 & e.flags);
      }
      function _t(e) {
        return !!e.template;
      }
      function Ic(e) {
        return 0 != (512 & e[F]);
      }
      function kn(e, t) {
        return e.hasOwnProperty(Zt) ? e[Zt] : null;
      }
      let Se = null,
        Xi = !1;
      function lt(e) {
        const t = Se;
        return (Se = e), t;
      }
      const uh = {
        version: 0,
        dirty: !1,
        producerNode: void 0,
        producerLastReadVersion: void 0,
        producerIndexOfThis: void 0,
        nextProducerIndex: 0,
        liveConsumerNode: void 0,
        liveConsumerIndexOfThis: void 0,
        consumerAllowSignalWrites: !1,
        consumerIsAlwaysLive: !1,
        producerMustRecompute: () => !1,
        producerRecomputeValue: () => {},
        consumerMarkedDirty: () => {},
      };
      function dh(e) {
        if (!Mo(e) || e.dirty) {
          if (!e.producerMustRecompute(e) && !ph(e)) return void (e.dirty = !1);
          e.producerRecomputeValue(e), (e.dirty = !1);
        }
      }
      function hh(e) {
        (e.dirty = !0),
          (function fh(e) {
            if (void 0 === e.liveConsumerNode) return;
            const t = Xi;
            Xi = !0;
            try {
              for (const n of e.liveConsumerNode) n.dirty || hh(n);
            } finally {
              Xi = t;
            }
          })(e),
          e.consumerMarkedDirty?.(e);
      }
      function Tc(e) {
        return e && (e.nextProducerIndex = 0), lt(e);
      }
      function Ac(e, t) {
        if (
          (lt(t),
          e &&
            void 0 !== e.producerNode &&
            void 0 !== e.producerIndexOfThis &&
            void 0 !== e.producerLastReadVersion)
        ) {
          if (Mo(e))
            for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
              Ji(e.producerNode[n], e.producerIndexOfThis[n]);
          for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
              e.producerLastReadVersion.pop(),
              e.producerIndexOfThis.pop();
        }
      }
      function ph(e) {
        cr(e);
        for (let t = 0; t < e.producerNode.length; t++) {
          const n = e.producerNode[t],
            r = e.producerLastReadVersion[t];
          if (r !== n.version || (dh(n), r !== n.version)) return !0;
        }
        return !1;
      }
      function gh(e) {
        if ((cr(e), Mo(e)))
          for (let t = 0; t < e.producerNode.length; t++)
            Ji(e.producerNode[t], e.producerIndexOfThis[t]);
        (e.producerNode.length =
          e.producerLastReadVersion.length =
          e.producerIndexOfThis.length =
            0),
          e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
      }
      function Ji(e, t) {
        if (
          ((function vh(e) {
            (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
          })(e),
          cr(e),
          1 === e.liveConsumerNode.length)
        )
          for (let r = 0; r < e.producerNode.length; r++)
            Ji(e.producerNode[r], e.producerIndexOfThis[r]);
        const n = e.liveConsumerNode.length - 1;
        if (
          ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
          (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
          e.liveConsumerNode.length--,
          e.liveConsumerIndexOfThis.length--,
          t < e.liveConsumerNode.length)
        ) {
          const r = e.liveConsumerIndexOfThis[t],
            o = e.liveConsumerNode[t];
          cr(o), (o.producerIndexOfThis[r] = t);
        }
      }
      function Mo(e) {
        return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
      }
      function cr(e) {
        (e.producerNode ??= []),
          (e.producerIndexOfThis ??= []),
          (e.producerLastReadVersion ??= []);
      }
      let yh = null;
      const _h = () => {},
        VE = (() => ({
          ...uh,
          consumerIsAlwaysLive: !0,
          consumerAllowSignalWrites: !1,
          consumerMarkedDirty: (e) => {
            e.schedule(e.ref);
          },
          hasRun: !1,
          cleanupFn: _h,
        }))();
      class BE {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Yt() {
        return Eh;
      }
      function Eh(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = zE), UE;
      }
      function UE() {
        const e = Mh(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === xt) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function zE(e, t, n, r) {
        const o = this.declaredInputs[n],
          i =
            Mh(e) ||
            (function qE(e, t) {
              return (e[bh] = t);
            })(e, { previous: xt, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          c = a[o];
        (s[o] = new BE(c && c.currentValue, t, a === xt)), (e[r] = t);
      }
      Yt.ngInherit = !0;
      const bh = "__ngSimpleChanges__";
      function Mh(e) {
        return e[bh] || null;
      }
      const Pt = function (e, t, n) {};
      function ne(e) {
        for (; Array.isArray(e); ) e = e[ue];
        return e;
      }
      function Ki(e, t) {
        return ne(t[e]);
      }
      function Ge(e, t) {
        return ne(t[e.index]);
      }
      function Th(e, t) {
        return e.data[t];
      }
      function Ke(e, t) {
        const n = t[e];
        return qe(n) ? n : n[ue];
      }
      function Dn(e, t) {
        return null == t ? null : e[t];
      }
      function Ah(e) {
        e[sr] = 0;
      }
      function XE(e) {
        1024 & e[F] || ((e[F] |= 1024), xh(e, 1));
      }
      function Oh(e) {
        1024 & e[F] && ((e[F] &= -1025), xh(e, -1));
      }
      function xh(e, t) {
        let n = e[se];
        if (null === n) return;
        n[yo] += t;
        let r = n;
        for (
          n = n[se];
          null !== n && ((1 === t && 1 === r[yo]) || (-1 === t && 0 === r[yo]));

        )
          (n[yo] += t), (r = n), (n = n[se]);
      }
      const O = {
        lFrame: zh(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function Ph() {
        return O.bindingsEnabled;
      }
      function lr() {
        return null !== O.skipHydrationRootTNode;
      }
      function y() {
        return O.lFrame.lView;
      }
      function z() {
        return O.lFrame.tView;
      }
      function Te() {
        let e = Lh();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Lh() {
        return O.lFrame.currentTNode;
      }
      function kt(e, t) {
        const n = O.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Pc() {
        return O.lFrame.isParent;
      }
      function dr() {
        return O.lFrame.bindingIndex++;
      }
      function Jt(e) {
        const t = O.lFrame,
          n = t.bindingIndex;
        return (t.bindingIndex = t.bindingIndex + e), n;
      }
      function ub(e, t) {
        const n = O.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Fc(t);
      }
      function Fc(e) {
        O.lFrame.currentDirectiveIndex = e;
      }
      function jc(e) {
        O.lFrame.currentQueryIndex = e;
      }
      function db(e) {
        const t = e[w];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[xe] : null;
      }
      function Bh(e, t, n) {
        if (n & $.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & $.Host ||
              ((o = db(i)), null === o || ((i = i[ir]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (O.lFrame = Uh());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Hc(e) {
        const t = Uh(),
          n = e[w];
        (O.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function Uh() {
        const e = O.lFrame,
          t = null === e ? null : e.child;
        return null === t ? zh(e) : t;
      }
      function zh(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function qh() {
        const e = O.lFrame;
        return (
          (O.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Gh = qh;
      function $c() {
        const e = qh();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function je() {
        return O.lFrame.selectedIndex;
      }
      function Fn(e) {
        O.lFrame.selectedIndex = e;
      }
      function Wh() {
        return O.lFrame.currentNamespace;
      }
      let Zh = !0;
      function es() {
        return Zh;
      }
      function wn(e) {
        Zh = e;
      }
      function ts(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: c,
              ngAfterViewChecked: u,
              ngOnDestroy: l,
            } = i;
          s && (e.contentHooks ??= []).push(-n, s),
            a &&
              ((e.contentHooks ??= []).push(n, a),
              (e.contentCheckHooks ??= []).push(n, a)),
            c && (e.viewHooks ??= []).push(-n, c),
            u &&
              ((e.viewHooks ??= []).push(n, u),
              (e.viewCheckHooks ??= []).push(n, u)),
            null != l && (e.destroyHooks ??= []).push(n, l);
        }
      }
      function ns(e, t, n) {
        Qh(e, t, 3, n);
      }
      function rs(e, t, n, r) {
        (3 & e[F]) === n && Qh(e, t, n, r);
      }
      function Vc(e, t) {
        let n = e[F];
        (3 & n) === t && ((n &= 8191), (n += 1), (e[F] = n));
      }
      function Qh(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let c = void 0 !== r ? 65535 & e[sr] : 0; c < s; c++)
          if ("number" == typeof t[c + 1]) {
            if (((a = t[c]), null != r && a >= r)) break;
          } else
            t[c] < 0 && (e[sr] += 65536),
              (a < i || -1 == i) &&
                (Cb(e, n, t, c), (e[sr] = (4294901760 & e[sr]) + c + 2)),
              c++;
      }
      function Yh(e, t) {
        Pt(4, e, t);
        const n = lt(null);
        try {
          t.call(e);
        } finally {
          lt(n), Pt(5, e, t);
        }
      }
      function Cb(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        o
          ? e[F] >> 13 < e[sr] >> 16 &&
            (3 & e[F]) === t &&
            ((e[F] += 8192), Yh(a, i))
          : Yh(a, i);
      }
      const fr = -1;
      class So {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Uc(e) {
        return e !== fr;
      }
      function To(e) {
        return 32767 & e;
      }
      function Ao(e, t) {
        let n = (function Eb(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[ir]), n--;
        return r;
      }
      let zc = !0;
      function os(e) {
        const t = zc;
        return (zc = e), t;
      }
      const Xh = 255,
        Jh = 5;
      let bb = 0;
      const Ft = {};
      function is(e, t) {
        const n = Kh(e, t);
        if (-1 !== n) return n;
        const r = t[w];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          qc(r.data, e),
          qc(t, null),
          qc(r.blueprint, null));
        const o = ss(e, t),
          i = e.injectorIndex;
        if (Uc(o)) {
          const s = To(o),
            a = Ao(o, t),
            c = a[w].data;
          for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | c[s + u];
        }
        return (t[i + 8] = o), i;
      }
      function qc(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Kh(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function ss(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = ap(o)), null === r)) return fr;
          if ((n++, (o = o[ir]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return fr;
      }
      function Gc(e, t, n) {
        !(function Mb(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(mo) && (r = n[mo]),
            null == r && (r = n[mo] = bb++);
          const o = r & Xh;
          t.data[e + (o >> Jh)] |= 1 << o;
        })(e, t, n);
      }
      function ep(e, t, n) {
        if (n & $.Optional || void 0 !== e) return e;
        fc();
      }
      function tp(e, t, n, r) {
        if (
          (n & $.Optional && void 0 === r && (r = null),
          !(n & ($.Self | $.Host)))
        ) {
          const o = e[vn],
            i = Ue(void 0);
          try {
            return o ? o.get(t, r, n & $.Optional) : Vf(t, r, n & $.Optional);
          } finally {
            Ue(i);
          }
        }
        return ep(r, 0, n);
      }
      function np(e, t, n, r = $.Default, o) {
        if (null !== e) {
          if (2048 & t[F] && !(r & $.Self)) {
            const s = (function xb(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 2048 & s[F] && !(512 & s[F]);

              ) {
                const a = rp(i, s, n, r | $.Self, Ft);
                if (a !== Ft) return a;
                let c = i.parent;
                if (!c) {
                  const u = s[ih];
                  if (u) {
                    const l = u.get(n, Ft, r);
                    if (l !== Ft) return l;
                  }
                  (c = ap(s)), (s = s[ir]);
                }
                i = c;
              }
              return o;
            })(e, t, n, r, Ft);
            if (s !== Ft) return s;
          }
          const i = rp(e, t, n, r, Ft);
          if (i !== Ft) return i;
        }
        return tp(t, n, r, o);
      }
      function rp(e, t, n, r, o) {
        const i = (function Tb(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(mo) ? e[mo] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & Xh : Ob) : t;
        })(n);
        if ("function" == typeof i) {
          if (!Bh(t, e, r)) return r & $.Host ? ep(o, 0, r) : tp(t, n, r, o);
          try {
            let s;
            if (((s = i(r)), null != s || r & $.Optional)) return s;
            fc();
          } finally {
            Gh();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = Kh(e, t),
            c = fr,
            u = r & $.Host ? t[fe][xe] : null;
          for (
            (-1 === a || r & $.SkipSelf) &&
            ((c = -1 === a ? ss(e, t) : t[a + 8]),
            c !== fr && ip(r, !1)
              ? ((s = t[w]), (a = To(c)), (t = Ao(c, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const l = t[w];
            if (op(i, a, l.data)) {
              const d = Sb(a, t, n, s, r, u);
              if (d !== Ft) return d;
            }
            (c = t[a + 8]),
              c !== fr && ip(r, t[w].data[a + 8] === u) && op(i, a, t)
                ? ((s = l), (a = To(c)), (t = Ao(c, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function Sb(e, t, n, r, o, i) {
        const s = t[w],
          a = s.data[e + 8],
          l = (function as(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              c = e.directiveStart,
              l = i >> 20,
              f = o ? a + l : e.directiveEnd;
            for (let h = r ? a : a + l; h < f; h++) {
              const p = s[h];
              if ((h < c && n === p) || (h >= c && p.type === n)) return h;
            }
            if (o) {
              const h = s[c];
              if (h && _t(h) && h.type === n) return c;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? Pn(a) && zc : r != s && 0 != (3 & a.type),
            o & $.Host && i === a
          );
        return null !== l ? Ln(t, s, l, a) : Ft;
      }
      function Ln(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function Db(e) {
            return e instanceof So;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function Q_(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new D(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function Z(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : N(e);
              })(i[n])
            );
          const a = os(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? Ue(s.injectImpl) : null;
          Bh(e, r, $.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function yb(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = Eh(t);
                    (n.preOrderHooks ??= []).push(e, s),
                      (n.preOrderCheckHooks ??= []).push(e, s);
                  }
                  o && (n.preOrderHooks ??= []).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks ??= []).push(e, i),
                      (n.preOrderCheckHooks ??= []).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== u && Ue(u), os(a), (s.resolving = !1), Gh();
          }
        }
        return o;
      }
      function op(e, t, n) {
        return !!(n[t + (e >> Jh)] & (1 << e));
      }
      function ip(e, t) {
        return !(e & $.Self || (e & $.Host && t));
      }
      class He {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return np(this._tNode, this._lView, t, qi(r), n);
        }
      }
      function Ob() {
        return new He(Te(), y());
      }
      function Wc(e) {
        return lc(e)
          ? () => {
              const t = Wc(R(e));
              return t && t();
            }
          : kn(e);
      }
      function ap(e) {
        const t = e[w],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[xe] : null;
      }
      const pr = "__parameters__";
      function mr(e, t, n) {
        return Wt(() => {
          const r = (function Zc(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(c, u, l) {
              const d = c.hasOwnProperty(pr)
                ? c[pr]
                : Object.defineProperty(c, pr, { value: [] })[pr];
              for (; d.length <= l; ) d.push(null);
              return (d[l] = d[l] || []).push(s), c;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      function yr(e, t) {
        e.forEach((n) => (Array.isArray(n) ? yr(n, t) : t(n)));
      }
      function up(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function us(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function et(e, t, n) {
        let r = Cr(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function jb(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = n);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > t; )
                    (e[o] = e[o - 2]), o--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function Qc(e, t) {
        const n = Cr(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Cr(e, t) {
        return (function lp(e, t, n) {
          let r = 0,
            o = e.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << n];
            if (t === s) return i << n;
            s > t ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(e, t, 1);
      }
      const ds = go(mr("Optional"), 8),
        fs = go(mr("SkipSelf"), 4),
        wr = "ngSkipHydration";
      function Dp(e) {
        const t = wr.toLowerCase(),
          n = e.mergedAttrs;
        if (null === n) return !1;
        for (let r = 0; r < n.length; r += 2) {
          const o = n[r];
          if ("number" == typeof o) return !1;
          if ("string" == typeof o && o.toLowerCase() === t) return !0;
        }
        return !1;
      }
      function wp(e) {
        return e.hasAttribute(wr);
      }
      function vs(e) {
        return 128 == (128 & e.flags);
      }
      var _n = (function (e) {
        return (
          (e[(e.Important = 1)] = "Important"),
          (e[(e.DashCase = 2)] = "DashCase"),
          e
        );
      })(_n || {});
      const iM = /^>|^->|<!--|-->|--!>|<!-$/g,
        sM = /(<|>)/g,
        aM = "\u200b$1\u200b";
      const eu = new Map();
      let cM = 0;
      const nu = "__ngContext__";
      function Re(e, t) {
        qe(t)
          ? ((e[nu] = t[wo]),
            (function lM(e) {
              eu.set(e[wo], e);
            })(t))
          : (e[nu] = t);
      }
      let ru;
      function ou(e, t) {
        return ru(e, t);
      }
      function ko(e) {
        const t = e[se];
        return Fe(t) ? t[se] : t;
      }
      function Op(e) {
        return Rp(e[Co]);
      }
      function xp(e) {
        return Rp(e[wt]);
      }
      function Rp(e) {
        for (; null !== e && !Fe(e); ) e = e[wt];
        return e;
      }
      function _r(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          Fe(r) ? (i = r) : qe(r) && ((s = !0), (r = r[ue]));
          const a = ne(r);
          0 === e && null !== n
            ? null == o
              ? Fp(t, n, a)
              : jn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? jn(t, n, a, o || null, !0)
            : 2 === e
            ? bs(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function RM(e, t, n, r, o) {
                const i = n[Nt];
                i !== ne(n) && _r(t, e, r, i, o);
                for (let a = Ie; a < n.length; a++) {
                  const c = n[a];
                  Lo(c[w], c, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function Cs(e, t) {
        return e.createText(t);
      }
      function iu(e, t) {
        return e.createComment(
          (function _p(e) {
            return e.replace(iM, (t) => t.replace(sM, aM));
          })(t)
        );
      }
      function Ds(e, t, n) {
        return e.createElement(t, n);
      }
      function Pp(e, t) {
        const n = e[ar],
          r = n.indexOf(t);
        Oh(t), n.splice(r, 1);
      }
      function ws(e, t) {
        if (e.length <= Ie) return;
        const n = Ie + t,
          r = e[n];
        if (r) {
          const o = r[Do];
          null !== o && o !== e && Pp(o, r), t > 0 && (e[n - 1][wt] = r[wt]);
          const i = us(e, Ie + t);
          !(function wM(e, t) {
            Lo(e, t, t[P], 2, null, null), (t[ue] = null), (t[xe] = null);
          })(r[w], r);
          const s = i[Rt];
          null !== s && s.detachView(i[w]),
            (r[se] = null),
            (r[wt] = null),
            (r[F] &= -129);
        }
        return r;
      }
      function su(e, t) {
        if (!(256 & t[F])) {
          const n = t[P];
          t[_o] && gh(t[_o]),
            t[Eo] && gh(t[Eo]),
            n.destroyNode && Lo(e, t, n, 3, null, null),
            (function bM(e) {
              let t = e[Co];
              if (!t) return au(e[w], e);
              for (; t; ) {
                let n = null;
                if (qe(t)) n = t[Co];
                else {
                  const r = t[Ie];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[wt] && t !== e; )
                    qe(t) && au(t[w], t), (t = t[se]);
                  null === t && (t = e), qe(t) && au(t[w], t), (n = t && t[wt]);
                }
                t = n;
              }
            })(t);
        }
      }
      function au(e, t) {
        if (!(256 & t[F])) {
          (t[F] &= -129),
            (t[F] |= 256),
            (function TM(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof So)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          c = i[s + 1];
                        Pt(4, a, c);
                        try {
                          c.call(a);
                        } finally {
                          Pt(5, a, c);
                        }
                      }
                    else {
                      Pt(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        Pt(5, o, i);
                      }
                    }
                  }
                }
            })(e, t),
            (function SM(e, t) {
              const n = e.cleanup,
                r = t[rr];
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
                  } else n[i].call(r[n[i + 1]]);
              null !== r && (t[rr] = null);
              const o = t[yn];
              if (null !== o) {
                t[yn] = null;
                for (let i = 0; i < o.length; i++) (0, o[i])();
              }
            })(e, t),
            1 === t[w].type && t[P].destroy();
          const n = t[Do];
          if (null !== n && Fe(t[se])) {
            n !== t[se] && Pp(n, t);
            const r = t[Rt];
            null !== r && r.detachView(e);
          }
          !(function dM(e) {
            eu.delete(e[wo]);
          })(t);
        }
      }
      function cu(e, t, n) {
        return (function kp(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[ue];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === Ct.None || i === Ct.Emulated) return null;
            }
            return Ge(r, n);
          }
        })(e, t.parent, n);
      }
      function jn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function Fp(e, t, n) {
        e.appendChild(t, n);
      }
      function Lp(e, t, n, r, o) {
        null !== r ? jn(e, t, n, r, o) : Fp(e, t, n);
      }
      function _s(e, t) {
        return e.parentNode(t);
      }
      let uu,
        hu,
        $p = function Hp(e, t, n) {
          return 40 & e.type ? Ge(e, n) : null;
        };
      function Es(e, t, n, r) {
        const o = cu(e, r, t),
          i = t[P],
          a = (function jp(e, t, n) {
            return $p(e, t, n);
          })(r.parent || t[xe], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let c = 0; c < n.length; c++) Lp(i, o, n[c], a, !1);
          else Lp(i, o, n, a, !1);
        void 0 !== uu && uu(i, r, t, n, o);
      }
      function Fo(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return Ge(t, e);
          if (4 & n) return lu(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return Fo(e, r);
            {
              const o = e[t.index];
              return Fe(o) ? lu(-1, o) : ne(o);
            }
          }
          if (32 & n) return ou(t, e)() || ne(e[t.index]);
          {
            const r = Bp(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : Fo(ko(e[fe]), r)
              : Fo(e, t.next);
          }
        }
        return null;
      }
      function Bp(e, t) {
        return null !== t ? e[fe][xe].projection[t.projection] : null;
      }
      function lu(e, t) {
        const n = Ie + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[w].firstChild;
          if (null !== o) return Fo(r, o);
        }
        return t[Nt];
      }
      function bs(e, t, n) {
        const r = _s(e, t);
        r &&
          (function AM(e, t, n, r) {
            e.removeChild(t, n, r);
          })(e, r, t, n);
      }
      function Up(e) {
        e.textContent = "";
      }
      function du(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            c = n.type;
          if (
            (s && 0 === t && (a && Re(ne(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & c) du(e, t, n.child, r, o, i, !1), _r(t, e, o, a, i);
            else if (32 & c) {
              const u = ou(n, r);
              let l;
              for (; (l = u()); ) _r(t, e, o, l, i);
              _r(t, e, o, a, i);
            } else 16 & c ? zp(e, t, r, n, o, i) : _r(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Lo(e, t, n, r, o, i) {
        du(n, r, e.firstChild, t, o, i, !1);
      }
      function zp(e, t, n, r, o, i) {
        const s = n[fe],
          c = s[xe].projection[r.projection];
        if (Array.isArray(c))
          for (let u = 0; u < c.length; u++) _r(t, e, o, c[u], i);
        else {
          let u = c;
          const l = s[se];
          vs(r) && (u.flags |= 128), du(e, t, u, l, o, i, !0);
        }
      }
      function qp(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function Gp(e, t, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && Ec(e, t, r),
          null !== o && qp(e, t, o),
          null !== i &&
            (function PM(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, i);
      }
      function br() {
        if (void 0 !== hu) return hu;
        if (typeof document < "u") return document;
        throw new D(210, !1);
      }
      class Yp {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Lf})`;
        }
      }
      function En(e) {
        return e instanceof Yp ? e.changingThisBreaksApplicationSecurity : e;
      }
      const ZM = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      var Mr = (function (e) {
        return (
          (e[(e.NONE = 0)] = "NONE"),
          (e[(e.HTML = 1)] = "HTML"),
          (e[(e.STYLE = 2)] = "STYLE"),
          (e[(e.SCRIPT = 3)] = "SCRIPT"),
          (e[(e.URL = 4)] = "URL"),
          (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
          e
        );
      })(Mr || {});
      function Ir(e) {
        const t = (function $o() {
          const e = y();
          return e && e[or].sanitizer;
        })();
        return t
          ? t.sanitize(Mr.URL, e) || ""
          : (function jo(e, t) {
              const n = (function zM(e) {
                return (e instanceof Yp && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(`Required a safe ${t}, got a ${n} (see ${Lf})`);
              }
              return n === t;
            })(e, "URL")
          ? En(e)
          : (function gu(e) {
              return (e = String(e)).match(ZM) ? e : "unsafe:" + e;
            })(N(e));
      }
      class E {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = I({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const Sr = new E("ENVIRONMENT_INITIALIZER"),
        ig = new E("INJECTOR", -1),
        sg = new E("INJECTOR_DEF_TYPES");
      class Cu {
        get(t, n = po) {
          if (n === po) {
            const r = new Error(`NullInjectorError: No provider for ${ye(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function Du(e) {
        return { ɵproviders: e };
      }
      function aI(...e) {
        return { ɵproviders: ag(0, e), ɵfromNgModule: !0 };
      }
      function ag(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        const i = (s) => {
          n.push(s);
        };
        return (
          yr(t, (s) => {
            const a = s;
            Ts(a, i, [], r) && ((o ||= []), o.push(a));
          }),
          void 0 !== o && cg(o, i),
          n
        );
      }
      function cg(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { ngModule: r, providers: o } = e[n];
          wu(o, (i) => {
            t(i, r);
          });
        }
      }
      function Ts(e, t, n, r) {
        if (!(e = R(e))) return !1;
        let o = null,
          i = Bi(e);
        const s = !i && U(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const c = e.ngModule;
          if (((i = Bi(c)), !i)) return !1;
          o = c;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const c =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const u of c) Ts(u, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let u;
              r.add(o);
              try {
                yr(i.imports, (l) => {
                  Ts(l, t, n, r) && ((u ||= []), u.push(l));
                });
              } finally {
              }
              void 0 !== u && cg(u, t);
            }
            if (!a) {
              const u = kn(o) || (() => new o());
              t({ provide: o, useFactory: u, deps: q }, o),
                t({ provide: sg, useValue: o, multi: !0 }, o),
                t({ provide: Sr, useValue: () => M(o), multi: !0 }, o);
            }
            const c = i.providers;
            if (null != c && !a) {
              const u = e;
              wu(c, (l) => {
                t(l, u);
              });
            }
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function wu(e, t) {
        for (let n of e)
          dc(n) && (n = n.ɵproviders), Array.isArray(n) ? wu(n, t) : t(n);
      }
      const cI = Q({ provide: String, useValue: Q });
      function _u(e) {
        return null !== e && "object" == typeof e && cI in e;
      }
      function Hn(e) {
        return "function" == typeof e;
      }
      const Eu = new E("Set Injector scope."),
        As = {},
        lI = {};
      let bu;
      function Os() {
        return void 0 === bu && (bu = new Cu()), bu;
      }
      class ft {}
      class xs extends ft {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Iu(t, (s) => this.processProvider(s)),
            this.records.set(ig, Tr(void 0, this)),
            o.has("environment") && this.records.set(ft, Tr(void 0, this));
          const i = this.records.get(Eu);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(sg.multi, q, $.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            const t = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const n of t) n();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(t) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(t),
            () => this.removeOnDestroy(t)
          );
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = pn(this),
            r = Ue(void 0);
          try {
            return t();
          } finally {
            pn(n), Ue(r);
          }
        }
        get(t, n = po, r = $.Default) {
          if ((this.assertNotDestroyed(), t.hasOwnProperty(Gf)))
            return t[Gf](this);
          r = qi(r);
          const i = pn(this),
            s = Ue(void 0);
          try {
            if (!(r & $.SkipSelf)) {
              let c = this.records.get(t);
              if (void 0 === c) {
                const u =
                  (function gI(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof E)
                    );
                  })(t) && Vi(t);
                (c = u && this.injectableDefInScope(u) ? Tr(Mu(t), As) : null),
                  this.records.set(t, c);
              }
              if (null != c) return this.hydrate(t, c);
            }
            return (r & $.Self ? Os() : this.parent).get(
              t,
              (n = r & $.Optional && n === po ? null : n)
            );
          } catch (a) {
            if ("NullInjectorError" === a.name) {
              if (((a[zi] = a[zi] || []).unshift(ye(t)), i)) throw a;
              return (function lE(e, t, n, r) {
                const o = e[zi];
                throw (
                  (t[Uf] && o.unshift(t[Uf]),
                  (e.message = (function dE(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = ye(t);
                    if (Array.isArray(t)) o = t.map(ye).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : ye(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      iE,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[zi] = null),
                  e)
                );
              })(a, t, "R3InjectorError", this.source);
            }
            throw a;
          } finally {
            Ue(s), pn(i);
          }
        }
        resolveInjectorInitializers() {
          const t = pn(this),
            n = Ue(void 0);
          try {
            const o = this.get(Sr.multi, q, $.Self);
            for (const i of o) i();
          } finally {
            pn(t), Ue(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(ye(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new D(205, !1);
        }
        processProvider(t) {
          let n = Hn((t = R(t))) ? t : R(t && t.provide);
          const r = (function fI(e) {
            return _u(e)
              ? Tr(void 0, e.useValue)
              : Tr(
                  (function dg(e, t, n) {
                    let r;
                    if (Hn(e)) {
                      const o = R(e);
                      return kn(o) || Mu(o);
                    }
                    if (_u(e)) r = () => R(e.useValue);
                    else if (
                      (function lg(e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      r = () => e.useFactory(...Dc(e.deps || []));
                    else if (
                      (function ug(e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      r = () => M(R(e.useExisting));
                    else {
                      const o = R(e && (e.useClass || e.provide));
                      if (
                        !(function hI(e) {
                          return !!e.deps;
                        })(e)
                      )
                        return kn(o) || Mu(o);
                      r = () => new o(...Dc(e.deps));
                    }
                    return r;
                  })(e),
                  As
                );
          })(t);
          if (Hn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = Tr(void 0, As, !0)),
              (o.factory = () => Dc(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === As && ((n.value = lI), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function pI(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = R(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(t) {
          const n = this._onDestroyHooks.indexOf(t);
          -1 !== n && this._onDestroyHooks.splice(n, 1);
        }
      }
      function Mu(e) {
        const t = Vi(e),
          n = null !== t ? t.factory : kn(e);
        if (null !== n) return n;
        if (e instanceof E) throw new D(204, !1);
        if (e instanceof Function)
          return (function dI(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function Ro(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new D(204, !1))
              );
            const n = (function tE(e) {
              return (e && (e[Ui] || e[Hf])) || null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new D(204, !1);
      }
      function Tr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Iu(e, t) {
        for (const n of e)
          Array.isArray(n) ? Iu(n, t) : n && dc(n) ? Iu(n.ɵproviders, t) : t(n);
      }
      const Rs = new E("AppId", { providedIn: "root", factory: () => mI }),
        mI = "ng",
        fg = new E("Platform Initializer"),
        Ar = new E("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        hg = new E("CSP nonce", {
          providedIn: "root",
          factory: () =>
            br()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        }),
        pg = new E("", { providedIn: "root", factory: () => new Set() });
      function vI() {
        const e = new Or();
        return (
          "browser" === _(Ar) &&
            (e.store = (function yI(e, t) {
              const n = e.getElementById(t + "-state");
              if (n?.textContent)
                try {
                  return JSON.parse(n.textContent);
                } catch (r) {
                  console.warn(
                    "Exception while restoring TransferState for app " + t,
                    r
                  );
                }
              return {};
            })(br(), _(Rs))),
          e
        );
      }
      let Or = (() => {
        class e {
          constructor() {
            (this.store = {}), (this.onSerializeCallbacks = {});
          }
          static #e = (this.ɵprov = I({
            token: e,
            providedIn: "root",
            factory: vI,
          }));
          get(n, r) {
            return void 0 !== this.store[n] ? this.store[n] : r;
          }
          set(n, r) {
            this.store[n] = r;
          }
          remove(n) {
            delete this.store[n];
          }
          hasKey(n) {
            return this.store.hasOwnProperty(n);
          }
          get isEmpty() {
            return 0 === Object.keys(this.store).length;
          }
          onSerialize(n, r) {
            this.onSerializeCallbacks[n] = r;
          }
          toJson() {
            for (const n in this.onSerializeCallbacks)
              if (this.onSerializeCallbacks.hasOwnProperty(n))
                try {
                  this.store[n] = this.onSerializeCallbacks[n]();
                } catch (r) {
                  console.warn("Exception in onSerialize callback: ", r);
                }
            return JSON.stringify(this.store).replace(/</g, "\\u003C");
          }
        }
        return e;
      })();
      const Su = "h",
        Tu = "b";
      var xr = (function (e) {
        return (e.FirstChild = "f"), (e.NextSibling = "n"), e;
      })(xr || {});
      const Au = "e",
        Ou = "t",
        Vo = "c",
        Ns = "x",
        Rr = "r",
        xu = "i",
        Ru = "n",
        Ps = "d",
        Nu = "__\u0275nghData__",
        Bo = "ngh",
        CI = "nghm";
      let gg = (e, t, n) => null;
      function DI(e, t, n = !1) {
        let r = e.getAttribute(Bo);
        if (null == r) return null;
        const [o, i] = r.split("|");
        if (((r = n ? i : o), !r)) return null;
        const s = n ? o : i ? `|${i}` : "";
        let a = {};
        if ("" !== r) {
          const u = t.get(Or, null, { optional: !0 });
          null !== u && (a = u.get(Nu, [])[Number(r)]);
        }
        const c = { data: a, firstChild: e.firstChild ?? null };
        return (
          n && ((c.firstChild = e), ks(c, 0, e.nextSibling)),
          s ? e.setAttribute(Bo, s) : e.removeAttribute(Bo),
          c
        );
      }
      function Pu(e, t, n = !1) {
        return gg(e, t, n);
      }
      function mg(e) {
        let t = e._lView;
        return 2 === t[w].type ? null : (Ic(t) && (t = t[V]), t);
      }
      function ks(e, t, n) {
        (e.segmentHeads ??= {}), (e.segmentHeads[t] = n);
      }
      function ku(e, t) {
        return e.segmentHeads?.[t] ?? null;
      }
      function vg(e, t) {
        return e.data[Vo]?.[t] ?? null;
      }
      function Fu(e, t) {
        const n = vg(e, t) ?? [];
        let r = 0;
        for (let o of n) r += o[Rr] * (o[Ns] ?? 1);
        return r;
      }
      function Fs(e, t) {
        if (typeof e.disconnectedNodes > "u") {
          const n = e.data[Ps];
          e.disconnectedNodes = n ? new Set(n) : null;
        }
        return !!e.disconnectedNodes?.has(t);
      }
      class II {}
      class yg {}
      class TI {
        resolveComponentFactory(t) {
          throw (function SI(e) {
            const t = Error(`No component factory found for ${ye(e)}.`);
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let Ls = (() => {
        class e {
          static #e = (this.NULL = new TI());
        }
        return e;
      })();
      function AI() {
        return Nr(Te(), y());
      }
      function Nr(e, t) {
        return new bn(Ge(e, t));
      }
      let bn = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
          static #e = (this.__NG_ELEMENT_ID__ = AI);
        }
        return e;
      })();
      class Dg {}
      let RI = (() => {
        class e {
          static #e = (this.ɵprov = I({
            token: e,
            providedIn: "root",
            factory: () => null,
          }));
        }
        return e;
      })();
      class Hs {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const NI = new Hs("16.2.7"),
        Lu = {};
      function bg(e, t = null, n = null, r) {
        const o = Mg(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function Mg(e, t = null, n = null, r, o = new Set()) {
        const i = [n || q, aI(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : ye(e))),
          new xs(i, t || Os(), r || null, o)
        );
      }
      let ht = (() => {
        class e {
          static #e = (this.THROW_IF_NOT_FOUND = po);
          static #t = (this.NULL = new Cu());
          static create(n, r) {
            if (Array.isArray(n)) return bg({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return bg({ name: o }, n.parent, n.providers, o);
            }
          }
          static #n = (this.ɵprov = I({
            token: e,
            providedIn: "any",
            factory: () => M(ig),
          }));
          static #r = (this.__NG_ELEMENT_ID__ = -1);
        }
        return e;
      })();
      function Hu(e) {
        return e.ngOriginalError;
      }
      class en {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Hu(t);
          for (; n && Hu(n); ) n = Hu(n);
          return n || null;
        }
      }
      function Vu(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const _e = class $I extends st {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const c = t;
            (o = c.next?.bind(c)),
              (i = c.error?.bind(c)),
              (s = c.complete?.bind(c));
          }
          this.__isAsync && ((i = Vu(i)), o && (o = Vu(o)), s && (s = Vu(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof Ye && t.add(a), a;
        }
      };
      function Sg(...e) {}
      class Y {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new _e(!1)),
            (this.onMicrotaskEmpty = new _e(!1)),
            (this.onStable = new _e(!1)),
            (this.onError = new _e(!1)),
            typeof Zone > "u")
          )
            throw new D(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function VI() {
              const e = "function" == typeof te.requestAnimationFrame;
              let t = te[e ? "requestAnimationFrame" : "setTimeout"],
                n = te[e ? "cancelAnimationFrame" : "clearTimeout"];
              if (typeof Zone < "u" && t && n) {
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
                const o = n[Zone.__symbol__("OriginalDelegate")];
                o && (n = o);
              }
              return {
                nativeRequestAnimationFrame: t,
                nativeCancelAnimationFrame: n,
              };
            })().nativeRequestAnimationFrame),
            (function zI(e) {
              const t = () => {
                !(function UI(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(te, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Uu(e),
                                (e.isCheckStableRunning = !0),
                                Bu(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Uu(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  if (
                    (function GI(e) {
                      return (
                        !(!Array.isArray(e) || 1 !== e.length) &&
                        !0 === e[0].data?.__ignore_ng_zone__
                      );
                    })(a)
                  )
                    return n.invokeTask(o, i, s, a);
                  try {
                    return Tg(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      Ag(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, c) => {
                  try {
                    return Tg(e), n.invoke(o, i, s, a, c);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), Ag(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          Uu(e),
                          Bu(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!Y.isInAngularZone()) throw new D(909, !1);
        }
        static assertNotInAngularZone() {
          if (Y.isInAngularZone()) throw new D(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, BI, Sg, Sg);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const BI = {};
      function Bu(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Uu(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Tg(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function Ag(e) {
        e._nesting--, Bu(e);
      }
      class qI {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new _e()),
            (this.onMicrotaskEmpty = new _e()),
            (this.onStable = new _e()),
            (this.onError = new _e());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const Og = new E("", { providedIn: "root", factory: xg });
      function xg() {
        const e = _(Y);
        let t = !0;
        return (function z_(...e) {
          const t = fo(e),
            n = (function L_(e, t) {
              return "number" == typeof sc(e) ? e.pop() : t;
            })(e, 1 / 0),
            r = e;
          return r.length ? (1 === r.length ? at(r[0]) : Kn(n)(be(r, t))) : At;
        })(
          new ge((o) => {
            (t =
              e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                o.next(t), o.complete();
              });
          }),
          new ge((o) => {
            let i;
            e.runOutsideAngular(() => {
              i = e.onStable.subscribe(() => {
                Y.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    !t &&
                      !e.hasPendingMacrotasks &&
                      !e.hasPendingMicrotasks &&
                      ((t = !0), o.next(!0));
                  });
              });
            });
            const s = e.onUnstable.subscribe(() => {
              Y.assertInAngularZone(),
                t &&
                  ((t = !1),
                  e.runOutsideAngular(() => {
                    o.next(!1);
                  }));
            });
            return () => {
              i.unsubscribe(), s.unsubscribe();
            };
          }).pipe(kf())
        );
      }
      function tn(e) {
        return e instanceof Function ? e() : e;
      }
      function kr(e) {
        return "browser" === (e ?? _(ht)).get(Ar);
      }
      let zu = (() => {
        class e {
          constructor() {
            (this.renderDepth = 0), (this.handler = null);
          }
          begin() {
            this.handler?.validateBegin(), this.renderDepth++;
          }
          end() {
            this.renderDepth--,
              0 === this.renderDepth && this.handler?.execute();
          }
          ngOnDestroy() {
            this.handler?.destroy(), (this.handler = null);
          }
          static #e = (this.ɵprov = I({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function Uo(e) {
        for (; e; ) {
          e[F] |= 64;
          const t = ko(e);
          if (Ic(e) && !t) return e;
          e = t;
        }
        return null;
      }
      const $s = new E(""),
        Fg = new E("", { providedIn: "root", factory: () => !1 });
      let Vs = null;
      function $g(e, t) {
        return e[t] ?? Ug();
      }
      function Vg(e, t) {
        const n = Ug();
        n.producerNode?.length && ((e[t] = Vs), (n.lView = e), (Vs = Bg()));
      }
      const nS = {
        ...uh,
        consumerIsAlwaysLive: !0,
        consumerMarkedDirty: (e) => {
          Uo(e.lView);
        },
        lView: null,
      };
      function Bg() {
        return Object.create(nS);
      }
      function Ug() {
        return (Vs ??= Bg()), Vs;
      }
      const k = {};
      function re(e) {
        zg(z(), y(), je() + e, !1);
      }
      function zg(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[F])) {
            const i = e.preOrderCheckHooks;
            null !== i && ns(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && rs(t, i, 0, n);
          }
        Fn(n);
      }
      function S(e, t = $.Default) {
        const n = y();
        return null === n ? M(e, t) : np(Te(), n, R(e), t);
      }
      function Bs(e, t, n, r, o, i, s, a, c, u, l) {
        const d = t.blueprint.slice();
        return (
          (d[ue] = o),
          (d[F] = 140 | r),
          (null !== u || (e && 2048 & e[F])) && (d[F] |= 2048),
          Ah(d),
          (d[se] = d[ir] = e),
          (d[de] = n),
          (d[or] = s || (e && e[or])),
          (d[P] = a || (e && e[P])),
          (d[vn] = c || (e && e[vn]) || null),
          (d[xe] = i),
          (d[wo] = (function uM() {
            return cM++;
          })()),
          (d[Qt] = l),
          (d[ih] = u),
          (d[fe] = 2 == t.type ? e[fe] : d),
          d
        );
      }
      function Fr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function qu(e, t, n, r, o) {
            const i = Lh(),
              s = Pc(),
              c = (e.data[t] = (function lS(e, t, n, r, o, i) {
                let s = t ? t.injectorIndex : -1,
                  a = 0;
                return (
                  lr() && (a |= 128),
                  {
                    type: n,
                    index: r,
                    insertBeforeIndex: null,
                    injectorIndex: s,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: o,
                    attrs: i,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: t,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = c),
              null !== i &&
                (s
                  ? null == i.child && null !== c.parent && (i.child = c)
                  : null === i.next && ((i.next = c), (c.prev = i))),
              c
            );
          })(e, t, n, r, o)),
            (function cb() {
              return O.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function Io() {
            const e = O.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return kt(i, !0), i;
      }
      function zo(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Gg(e, t, n, r, o) {
        const i = $g(t, _o),
          s = je(),
          a = 2 & r;
        try {
          Fn(-1), a && t.length > V && zg(e, t, V, !1), Pt(a ? 2 : 0, o);
          const u = a ? i : null,
            l = Tc(u);
          try {
            null !== u && (u.dirty = !1), n(r, o);
          } finally {
            Ac(u, l);
          }
        } finally {
          a && null === t[_o] && Vg(t, _o), Fn(s), Pt(a ? 3 : 1, o);
        }
      }
      function Gu(e, t, n) {
        if (Mc(t)) {
          const r = lt(null);
          try {
            const i = t.directiveEnd;
            for (let s = t.directiveStart; s < i; s++) {
              const a = e.data[s];
              a.contentQueries && a.contentQueries(1, n[s], s);
            }
          } finally {
            lt(r);
          }
        }
      }
      function Wu(e, t, n) {
        Ph() &&
          ((function vS(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            Pn(n) &&
              (function bS(e, t, n) {
                const r = Ge(t, e),
                  o = Wg(n);
                let s = 16;
                n.signals ? (s = 4096) : n.onPush && (s = 64);
                const a = Us(
                  e,
                  Bs(
                    e,
                    o,
                    null,
                    s,
                    r,
                    t,
                    null,
                    e[or].rendererFactory.createRenderer(r, n),
                    null,
                    null,
                    null
                  )
                );
                e[t.index] = a;
              })(t, n, e.data[o + n.componentOffset]),
              e.firstCreatePass || is(n, t),
              Re(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const c = e.data[a],
                u = Ln(t, e, a, n);
              Re(u, t),
                null !== s && MS(0, a - o, u, c, 0, s),
                _t(c) && (Ke(n.index, t)[de] = Ln(t, e, a, n));
            }
          })(e, t, n, Ge(n, t)),
          64 == (64 & n.flags) && Jg(e, t, n));
      }
      function Zu(e, t, n = Ge) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function Wg(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = Qu(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
            ))
          : t;
      }
      function Qu(e, t, n, r, o, i, s, a, c, u, l) {
        const d = V + r,
          f = d + o,
          h = (function oS(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : k);
            return n;
          })(d, f),
          p = "function" == typeof u ? u() : u;
        return (h[w] = {
          type: e,
          blueprint: h,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: c,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: l,
        });
      }
      let Zg = (e) => null;
      function aS(e) {
        wp(e)
          ? Up(e)
          : (function EI(e) {
              const t = br(),
                n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
                  acceptNode(i) {
                    const s = (function _I(e) {
                      return e.textContent?.replace(/\s/gm, "");
                    })(i);
                    return "ngetn" === s || "ngtns" === s
                      ? NodeFilter.FILTER_ACCEPT
                      : NodeFilter.FILTER_REJECT;
                  },
                });
              let r;
              const o = [];
              for (; (r = n.nextNode()); ) o.push(r);
              for (const i of o)
                "ngetn" === i.textContent
                  ? i.replaceWith(t.createTextNode(""))
                  : i.remove();
            })(e);
      }
      function Qg(e, t, n, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = e[o];
            null === r
              ? Yg(n, t, o, i)
              : r.hasOwnProperty(o) && Yg(n, t, r[o], i);
          }
        return n;
      }
      function Yg(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function Yu(e, t, n, r) {
        if (Ph()) {
          const o = null === r ? null : { "": -1 },
            i = (function CS(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                o = null;
              if (n)
                for (let i = 0; i < n.length; i++) {
                  const s = n[i];
                  if (Kf(t, s.selectors, !1))
                    if ((r || (r = []), _t(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          Xu(e, t, a.length);
                      } else r.unshift(s), Xu(e, t, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, n);
          let s, a;
          null === i ? (s = a = null) : ([s, a] = i),
            null !== s && Xg(e, t, n, s, o, a),
            o &&
              (function DS(e, t, n) {
                if (t) {
                  const r = (e.localNames = []);
                  for (let o = 0; o < t.length; o += 2) {
                    const i = n[t[o + 1]];
                    if (null == i) throw new D(-301, !1);
                    r.push(t[o], i);
                  }
                }
              })(n, r, o);
        }
        n.mergedAttrs = vo(n.mergedAttrs, n.attrs);
      }
      function Xg(e, t, n, r, o, i) {
        for (let u = 0; u < r.length; u++) Gc(is(n, t), e, r[u].type);
        !(function _S(e, t, n) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + n),
            (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let u = 0; u < r.length; u++) {
          const l = r[u];
          l.providersResolver && l.providersResolver(l);
        }
        let s = !1,
          a = !1,
          c = zo(e, t, r.length, null);
        for (let u = 0; u < r.length; u++) {
          const l = r[u];
          (n.mergedAttrs = vo(n.mergedAttrs, l.hostAttrs)),
            ES(e, n, t, c, l),
            wS(c, l, o),
            null !== l.contentQueries && (n.flags |= 4),
            (null !== l.hostBindings ||
              null !== l.hostAttrs ||
              0 !== l.hostVars) &&
              (n.flags |= 64);
          const d = l.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
            c++;
        }
        !(function dS(e, t, n) {
          const o = t.directiveEnd,
            i = e.data,
            s = t.attrs,
            a = [];
          let c = null,
            u = null;
          for (let l = t.directiveStart; l < o; l++) {
            const d = i[l],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (c = Qg(d.inputs, l, c, f ? f.inputs : null)),
              (u = Qg(d.outputs, l, u, p));
            const g = null === c || null === s || Jf(t) ? null : IS(c, l, s);
            a.push(g);
          }
          null !== c &&
            (c.hasOwnProperty("class") && (t.flags |= 8),
            c.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = c),
            (t.outputs = u);
        })(e, n, i);
      }
      function Jg(e, t, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function lb() {
            return O.lFrame.currentDirectiveIndex;
          })();
        try {
          Fn(i);
          for (let a = r; a < o; a++) {
            const c = e.data[a],
              u = t[a];
            Fc(a),
              (null !== c.hostBindings ||
                0 !== c.hostVars ||
                null !== c.hostAttrs) &&
                yS(c, u);
          }
        } finally {
          Fn(-1), Fc(s);
        }
      }
      function yS(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Xu(e, t, n) {
        (t.componentOffset = n), (e.components ??= []).push(t.index);
      }
      function wS(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          _t(t) && (n[""] = e);
        }
      }
      function ES(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = kn(o.type)),
          s = new So(i, _t(o), S);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function gS(e, t, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function mS(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(e, t, r, zo(e, n, o.hostVars, k), o);
      }
      function MS(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s)
          for (let a = 0; a < s.length; ) Kg(r, n, s[a++], s[a++], s[a++]);
      }
      function Kg(e, t, n, r, o) {
        const i = lt(null);
        try {
          const s = e.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (o = s[r].call(t, o)),
            null !== e.setInput ? e.setInput(t, o, n, r) : (t[r] = o);
        } finally {
          lt(i);
        }
      }
      function IS(e, t, n) {
        let r = null,
          o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(i, s[a + 1], n[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function em(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null, null];
      }
      function tm(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              jc(n[r]), s.contentQueries(2, t[i], i);
            }
          }
      }
      function Us(e, t) {
        return e[Co] ? (e[oh][wt] = t) : (e[Co] = t), (e[oh] = t), t;
      }
      function Ku(e, t, n) {
        jc(0);
        const r = lt(null);
        try {
          t(e, n);
        } finally {
          lt(r);
        }
      }
      function im(e, t) {
        const n = e[vn],
          r = n ? n.get(en, null) : null;
        r && r.handleError(t);
      }
      function el(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++];
          Kg(e.data[s], t[s], r, a, o);
        }
      }
      function nn(e, t, n) {
        const r = Ki(t, e);
        !(function Np(e, t, n) {
          e.setValue(t, n);
        })(e[P], r, n);
      }
      function SS(e, t) {
        const n = Ke(t, e),
          r = n[w];
        !(function TS(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n);
        const o = n[ue];
        null !== o && null === n[Qt] && (n[Qt] = Pu(o, n[vn])), tl(r, n, n[de]);
      }
      function tl(e, t, n) {
        Hc(t);
        try {
          const r = e.viewQuery;
          null !== r && Ku(1, r, n);
          const o = e.template;
          null !== o && Gg(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && tm(e, t),
            e.staticViewQueries && Ku(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function AS(e, t) {
              for (let n = 0; n < t.length; n++) SS(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[F] &= -5), $c();
        }
      }
      let sm = (() => {
        class e {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, r, o) {
            const i = typeof Zone > "u" ? null : Zone.current,
              s = (function $E(e, t, n) {
                const r = Object.create(VE);
                n && (r.consumerAllowSignalWrites = !0),
                  (r.fn = e),
                  (r.schedule = t);
                const o = (s) => {
                  r.cleanupFn = s;
                };
                return (
                  (r.ref = {
                    notify: () => hh(r),
                    run: () => {
                      if (((r.dirty = !1), r.hasRun && !ph(r))) return;
                      r.hasRun = !0;
                      const s = Tc(r);
                      try {
                        r.cleanupFn(), (r.cleanupFn = _h), r.fn(o);
                      } finally {
                        Ac(r, s);
                      }
                    },
                    cleanup: () => r.cleanupFn(),
                  }),
                  r.ref
                );
              })(
                n,
                (u) => {
                  this.all.has(u) && this.queue.set(u, i);
                },
                o
              );
            let a;
            this.all.add(s), s.notify();
            const c = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(c)), { destroy: c };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [n, r] of this.queue)
                this.queue.delete(n), r ? r.run(() => n.run()) : n.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
          static #e = (this.ɵprov = I({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function zs(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = cc(o, a))
              : 2 == i && (r = cc(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function qo(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          null !== i && r.push(ne(i)), Fe(i) && am(i, r);
          const s = n.type;
          if (8 & s) qo(e, t, n.child, r);
          else if (32 & s) {
            const a = ou(n, t);
            let c;
            for (; (c = a()); ) r.push(c);
          } else if (16 & s) {
            const a = Bp(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const c = ko(t[fe]);
              qo(c[w], c, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      function am(e, t) {
        for (let n = Ie; n < e.length; n++) {
          const r = e[n],
            o = r[w].firstChild;
          null !== o && qo(r[w], r, o, t);
        }
        e[Nt] !== e[ue] && t.push(e[Nt]);
      }
      function qs(e, t, n, r = !0) {
        const o = t[or],
          i = o.rendererFactory,
          s = o.afterRenderEventManager;
        i.begin?.(), s?.begin();
        try {
          cm(e, t, e.template, n);
        } catch (c) {
          throw (r && im(t, c), c);
        } finally {
          i.end?.(), o.effectManager?.flush(), s?.end();
        }
      }
      function cm(e, t, n, r) {
        const o = t[F];
        if (256 != (256 & o)) {
          t[or].effectManager?.flush(), Hc(t);
          try {
            Ah(t),
              (function Hh(e) {
                return (O.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && Gg(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const u = e.preOrderCheckHooks;
              null !== u && ns(t, u, null);
            } else {
              const u = e.preOrderHooks;
              null !== u && rs(t, u, 0, null), Vc(t, 0);
            }
            if (
              ((function RS(e) {
                for (let t = Op(e); null !== t; t = xp(t)) {
                  if (!t[sh]) continue;
                  const n = t[ar];
                  for (let r = 0; r < n.length; r++) {
                    XE(n[r]);
                  }
                }
              })(t),
              um(t, 2),
              null !== e.contentQueries && tm(e, t),
              s)
            ) {
              const u = e.contentCheckHooks;
              null !== u && ns(t, u);
            } else {
              const u = e.contentHooks;
              null !== u && rs(t, u, 1), Vc(t, 1);
            }
            !(function rS(e, t) {
              const n = e.hostBindingOpCodes;
              if (null === n) return;
              const r = $g(t, Eo);
              try {
                for (let o = 0; o < n.length; o++) {
                  const i = n[o];
                  if (i < 0) Fn(~i);
                  else {
                    const s = i,
                      a = n[++o],
                      c = n[++o];
                    ub(a, s), (r.dirty = !1);
                    const u = Tc(r);
                    try {
                      c(2, t[s]);
                    } finally {
                      Ac(r, u);
                    }
                  }
                }
              } finally {
                null === t[Eo] && Vg(t, Eo), Fn(-1);
              }
            })(e, t);
            const a = e.components;
            null !== a && dm(t, a, 0);
            const c = e.viewQuery;
            if ((null !== c && Ku(2, c, r), s)) {
              const u = e.viewCheckHooks;
              null !== u && ns(t, u);
            } else {
              const u = e.viewHooks;
              null !== u && rs(t, u, 2), Vc(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[F] &= -73),
              Oh(t);
          } finally {
            $c();
          }
        }
      }
      function um(e, t) {
        for (let n = Op(e); null !== n; n = xp(n))
          for (let r = Ie; r < n.length; r++) lm(n[r], t);
      }
      function NS(e, t, n) {
        lm(Ke(t, e), n);
      }
      function lm(e, t) {
        if (
          !(function QE(e) {
            return 128 == (128 & e[F]);
          })(e)
        )
          return;
        const n = e[w],
          r = e[F];
        if ((80 & r && 0 === t) || 1024 & r || 2 === t)
          cm(n, e, n.template, e[de]);
        else if (e[yo] > 0) {
          um(e, 1);
          const o = n.components;
          null !== o && dm(e, o, 1);
        }
      }
      function dm(e, t, n) {
        for (let r = 0; r < t.length; r++) NS(e, t[r], n);
      }
      class Go {
        get rootNodes() {
          const t = this._lView,
            n = t[w];
          return qo(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[de];
        }
        set context(t) {
          this._lView[de] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[F]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[se];
            if (Fe(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (ws(t, r), us(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          su(this._lView[w], this._lView);
        }
        onDestroy(t) {
          !(function Rh(e, t) {
            if (256 == (256 & e[F])) throw new D(911, !1);
            null === e[yn] && (e[yn] = []), e[yn].push(t);
          })(this._lView, t);
        }
        markForCheck() {
          Uo(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[F] &= -129;
        }
        reattach() {
          this._lView[F] |= 128;
        }
        detectChanges() {
          qs(this._lView[w], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new D(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function EM(e, t) {
              Lo(e, t, t[P], 2, null, null);
            })(this._lView[w], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new D(902, !1);
          this._appRef = t;
        }
      }
      class PS extends Go {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          qs(t[w], t, t[de], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class fm extends Ls {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = U(t);
          return new Wo(n, this.ngModule);
        }
      }
      function hm(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class FS {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = qi(r);
          const o = this.injector.get(t, Lu, r);
          return o !== Lu || n === Lu ? o : this.parentInjector.get(t, n, r);
        }
      }
      class Wo extends yg {
        get inputs() {
          const t = this.componentDef,
            n = t.inputTransforms,
            r = hm(t.inputs);
          if (null !== n)
            for (const o of r)
              n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
          return r;
        }
        get outputs() {
          return hm(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function wE(e) {
              return e.map(DE).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof ft ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new FS(t, i) : t,
            a = s.get(Dg, null);
          if (null === a) throw new D(407, !1);
          const d = {
              rendererFactory: a,
              sanitizer: s.get(RI, null),
              effectManager: s.get(sm, null),
              afterRenderEventManager: s.get(zu, null),
            },
            f = a.createRenderer(null, this.componentDef),
            h = this.componentDef.selectors[0][0] || "div",
            p = r
              ? (function iS(e, t, n, r) {
                  const i = r.get(Fg, !1) || n === Ct.ShadowDom,
                    s = e.selectRootElement(t, i);
                  return (
                    (function sS(e) {
                      Zg(e);
                    })(s),
                    s
                  );
                })(f, r, this.componentDef.encapsulation, s)
              : Ds(
                  f,
                  h,
                  (function kS(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(h)
                ),
            C = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528;
          let m = null;
          null !== p && (m = Pu(p, s, !0));
          const b = Qu(0, null, null, 1, 0, null, null, null, null, null, null),
            T = Bs(null, b, null, C, null, null, d, f, s, null, m);
          let H, Oe;
          Hc(T);
          try {
            const Ut = this.componentDef;
            let Jn,
              uf = null;
            Ut.findHostDirectiveDefs
              ? ((Jn = []),
                (uf = new Map()),
                Ut.findHostDirectiveDefs(Ut, Jn, uf),
                Jn.push(Ut))
              : (Jn = [Ut]);
            const ZF = (function jS(e, t) {
                const n = e[w],
                  r = V;
                return (e[r] = t), Fr(n, r, 2, "#host", null);
              })(T, p),
              QF = (function HS(e, t, n, r, o, i, s) {
                const a = o[w];
                !(function $S(e, t, n, r) {
                  for (const o of e)
                    t.mergedAttrs = vo(t.mergedAttrs, o.hostAttrs);
                  null !== t.mergedAttrs &&
                    (zs(t, t.mergedAttrs, !0), null !== n && Gp(r, n, t));
                })(r, e, t, s);
                let c = null;
                null !== t && (c = Pu(t, o[vn]));
                const u = i.rendererFactory.createRenderer(t, n);
                let l = 16;
                n.signals ? (l = 4096) : n.onPush && (l = 64);
                const d = Bs(
                  o,
                  Wg(n),
                  null,
                  l,
                  o[e.index],
                  e,
                  i,
                  u,
                  null,
                  null,
                  c
                );
                return (
                  a.firstCreatePass && Xu(a, e, r.length - 1),
                  Us(o, d),
                  (o[e.index] = d)
                );
              })(ZF, p, Ut, Jn, T, d, f);
            (Oe = Th(b, V)),
              p &&
                (function BS(e, t, n, r) {
                  if (r) Ec(e, n, ["ng-version", NI.full]);
                  else {
                    const { attrs: o, classes: i } = (function _E(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && t.push(i, e[++r])
                            : 8 === o && n.push(i);
                        else {
                          if (!Dt(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    o && Ec(e, n, o),
                      i && i.length > 0 && qp(e, n, i.join(" "));
                  }
                })(f, Ut, p, r),
              void 0 !== n &&
                (function US(e, t, n) {
                  const r = (e.projection = []);
                  for (let o = 0; o < t.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(Oe, this.ngContentSelectors, n),
              (H = (function VS(e, t, n, r, o, i) {
                const s = Te(),
                  a = o[w],
                  c = Ge(s, o);
                Xg(a, o, s, n, null, r);
                for (let l = 0; l < n.length; l++)
                  Re(Ln(o, a, s.directiveStart + l, s), o);
                Jg(a, o, s), c && Re(c, o);
                const u = Ln(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[de] = o[de] = u), null !== i))
                  for (const l of i) l(u, t);
                return Gu(a, s, e), u;
              })(QF, Ut, Jn, uf, T, [zS])),
              tl(b, T, null);
          } finally {
            $c();
          }
          return new LS(this.componentType, H, Nr(Oe, T), T, Oe);
        }
      }
      class LS extends II {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new PS(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(t) &&
                Object.is(this.previousInputValues.get(t), n))
            )
              return;
            const i = this._rootLView;
            el(i[w], i, o, t, n),
              this.previousInputValues.set(t, n),
              Uo(Ke(this._tNode.index, i));
          }
        }
        get injector() {
          return new He(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function zS() {
        const e = Te();
        ts(y()[w], e);
      }
      function Ws(e) {
        return (
          !!(function nl(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function Ne(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function $n(e, t, n, r) {
        const o = Ne(e, t, n);
        return Ne(e, t + 1, r) || o;
      }
      function Ur(e, t, n, r, o, i, s, a, c, u, l, d, f, h) {
        const p = (function Xt() {
          return O.lFrame.bindingIndex;
        })();
        let g = (function pt(e, t, n, r, o, i) {
          const s = $n(e, t, n, r);
          return $n(e, t + 2, o, i) || s;
        })(e, p, n, o, s, c);
        return (
          (g = $n(e, p + 4, l, f) || g),
          Jt(6),
          g
            ? t +
              N(n) +
              r +
              N(o) +
              i +
              N(s) +
              a +
              N(c) +
              u +
              N(l) +
              d +
              N(f) +
              h
            : k
        );
      }
      const f0 = new RegExp(`^(\\d+)*(${Tu}|${Su})*(.*)`);
      function al(e) {
        return e.index - V;
      }
      function Ys(e, t, n, r) {
        let o = null;
        const i = al(r),
          s = e.data[Ru];
        if (s?.[i])
          o = (function v0(e, t) {
            const [n, ...r] = (function p0(e) {
              const t = e.match(f0),
                [n, r, o, i] = t,
                s = r ? parseInt(r, 10) : o,
                a = [];
              for (const [c, u, l] of i.matchAll(/(f|n)(\d*)/g)) {
                const d = parseInt(l, 10) || 1;
                a.push(u, d);
              }
              return [s, ...a];
            })(e);
            let o;
            return (
              (o =
                n === Su
                  ? t[fe][ue]
                  : n === Tu
                  ? (function Rg(e) {
                      return e.ownerDocument.body;
                    })(t[fe][ue])
                  : ne(t[Number(n) + V])),
              (function m0(e, t) {
                let n = e;
                for (let r = 0; r < t.length; r += 2) {
                  const o = t[r],
                    i = t[r + 1];
                  for (let s = 0; s < i; s++)
                    switch (o) {
                      case xr.FirstChild:
                        n = n.firstChild;
                        break;
                      case xr.NextSibling:
                        n = n.nextSibling;
                    }
                }
                return n;
              })(o, r)
            );
          })(s[i], n);
        else if (t.firstChild === r) o = e.firstChild;
        else {
          const a = null === r.prev,
            c = r.prev ?? r.parent;
          if (
            (function g0(e) {
              return !e.prev && 8 === e.parent?.type;
            })(r)
          )
            o = ku(e, al(r.parent));
          else {
            let u = Ge(c, n);
            if (a) o = u.firstChild;
            else {
              const l = al(c),
                d = ku(e, l);
              o = 2 === c.type && d ? Xs(Fu(e, l) + 1, d) : u.nextSibling;
            }
          }
        }
        return o;
      }
      function Xs(e, t) {
        let n = t;
        for (let r = 0; r < e; r++) n = n.nextSibling;
        return n;
      }
      function Jo(e, t, n, r, o, i, s, a) {
        const c = y(),
          u = z(),
          l = e + V,
          d = u.firstCreatePass
            ? (function D0(e, t, n, r, o, i, s, a, c) {
                const u = t.consts,
                  l = Fr(t, e, 4, s || null, Dn(u, a));
                Yu(t, n, l, Dn(u, c)), ts(t, l);
                const d = (l.tView = Qu(
                  2,
                  l,
                  r,
                  o,
                  i,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  u,
                  null
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, l),
                    (d.queries = t.queries.embeddedTView(l))),
                  l
                );
              })(l, u, c, t, n, r, o, i, s)
            : u.data[l];
        kt(d, !1);
        const f = Rm(u, c, d, e);
        es() && Es(u, c, f, d),
          Re(f, c),
          Us(c, (c[l] = em(f, c, f, d))),
          Yi(d) && Wu(u, c, d),
          null != s && Zu(c, d, a);
      }
      let Rm = Nm;
      function Nm(e, t, n, r) {
        return wn(!0), t[P].createComment("");
      }
      function w0(e, t, n, r) {
        const o = t[Qt],
          i = !o || lr() || Fs(o, r);
        if ((wn(i), i)) return Nm(0, t);
        const s = o.data[Ou]?.[r] ?? null;
        null !== s &&
          null !== n.tView &&
          null === n.tView.ssrId &&
          (n.tView.ssrId = s);
        const a = Ys(o, e, t, n);
        return ks(o, r, a), Xs(Fu(o, r), a);
      }
      function nt(e, t, n) {
        const r = y();
        return (
          Ne(r, dr(), t) &&
            (function tt(e, t, n, r, o, i, s, a) {
              const c = Ge(t, n);
              let l,
                u = t.inputs;
              !a && null != u && (l = u[r])
                ? (el(e, n, l, r, o),
                  Pn(t) &&
                    (function hS(e, t) {
                      const n = Ke(t, e);
                      16 & n[F] || (n[F] |= 64);
                    })(n, t.index))
                : 3 & t.type &&
                  ((r = (function fS(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, t.value || "", r) : o),
                  i.setProperty(c, r, o));
            })(
              z(),
              (function ae() {
                const e = O.lFrame;
                return Th(e.tView, e.selectedIndex);
              })(),
              r,
              e,
              t,
              r[P],
              n,
              !1
            ),
          nt
        );
      }
      function ul(e, t, n, r, o) {
        const s = o ? "class" : "style";
        el(e, n, t.inputs[s], s, r);
      }
      function j(e, t, n, r) {
        const o = y(),
          i = z(),
          s = V + e,
          a = o[P],
          c = i.firstCreatePass
            ? (function M0(e, t, n, r, o, i) {
                const s = t.consts,
                  c = Fr(t, e, 2, r, Dn(s, o));
                return (
                  Yu(t, n, c, Dn(s, i)),
                  null !== c.attrs && zs(c, c.attrs, !1),
                  null !== c.mergedAttrs && zs(c, c.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, c),
                  c
                );
              })(s, i, o, t, n, r)
            : i.data[s],
          u = Pm(i, o, c, a, t, e);
        o[s] = u;
        const l = Yi(c);
        return (
          kt(c, !0),
          Gp(a, u, c),
          32 != (32 & c.flags) && es() && Es(i, o, u, c),
          0 ===
            (function KE() {
              return O.lFrame.elementDepthCount;
            })() && Re(u, o),
          (function eb() {
            O.lFrame.elementDepthCount++;
          })(),
          l && (Wu(i, o, c), Gu(i, c, o)),
          null !== r && Zu(o, c),
          j
        );
      }
      function B() {
        let e = Te();
        Pc()
          ? (function kc() {
              O.lFrame.isParent = !1;
            })()
          : ((e = e.parent), kt(e, !1));
        const t = e;
        (function nb(e) {
          return O.skipHydrationRootTNode === e;
        })(t) &&
          (function sb() {
            O.skipHydrationRootTNode = null;
          })(),
          (function tb() {
            O.lFrame.elementDepthCount--;
          })();
        const n = z();
        return (
          n.firstCreatePass && (ts(n, e), Mc(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function wb(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            ul(n, t, y(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function _b(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            ul(n, t, y(), t.stylesWithoutHost, !1),
          B
        );
      }
      function gt(e, t, n, r) {
        return j(e, t, n, r), B(), gt;
      }
      let Pm = (e, t, n, r, o, i) => (wn(!0), Ds(r, o, Wh()));
      function I0(e, t, n, r, o, i) {
        const s = t[Qt],
          a = !s || lr() || Fs(s, i);
        if ((wn(a), a)) return Ds(r, o, Wh());
        const c = Ys(s, e, t, n);
        return (
          vg(s, i) && ks(s, i, c.nextSibling),
          s &&
            (Dp(n) || wp(c)) &&
            Pn(n) &&
            ((function ob(e) {
              O.skipHydrationRootTNode = e;
            })(n),
            Up(c)),
          c
        );
      }
      let Fm = (e, t, n, r) => (wn(!0), iu(t[P], ""));
      function A0(e, t, n, r) {
        let o;
        const i = t[Qt],
          s = !i || lr();
        if ((wn(s), s)) return iu(t[P], "");
        const a = Ys(i, e, t, n),
          c = (function MI(e, t) {
            const n = e.data;
            let r = n[Au]?.[t] ?? null;
            return null === r && n[Vo]?.[t] && (r = Fu(e, t)), r;
          })(i, r);
        return ks(i, r, a), (o = Xs(c, a)), o;
      }
      function Js(e) {
        return !!e && "function" == typeof e.then;
      }
      function jm(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      function De(e, t, n, r) {
        const o = y(),
          i = z(),
          s = Te();
        return (
          (function $m(e, t, n, r, o, i, s) {
            const a = Yi(r),
              u =
                e.firstCreatePass &&
                (function rm(e) {
                  return e.cleanup || (e.cleanup = []);
                })(e),
              l = t[de],
              d = (function nm(e) {
                return e[rr] || (e[rr] = []);
              })(t);
            let f = !0;
            if (3 & r.type || s) {
              const g = Ge(r, t),
                v = s ? s(g) : g,
                C = d.length,
                m = s ? (T) => s(ne(T[r.index])) : r.index;
              let b = null;
              if (
                (!s &&
                  a &&
                  (b = (function x0(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[rr],
                            c = o[i + 2];
                          return a.length > c ? a[c] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== b)
              )
                ((b.__ngLastListenerFn__ || b).__ngNextListenerFn__ = i),
                  (b.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = Bm(r, t, l, i, !1);
                const T = n.listen(v, o, i);
                d.push(i, T), u && u.push(o, m, C, C + 1);
              }
            } else i = Bm(r, t, l, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let v = 0; v < g; v += 2) {
                  const H = t[p[v]][p[v + 1]].subscribe(i),
                    Oe = d.length;
                  d.push(i, H), u && u.push(o, r.index, Oe, -(Oe + 1));
                }
            }
          })(i, o, o[P], s, e, t, r),
          De
        );
      }
      function Vm(e, t, n, r) {
        try {
          return Pt(6, t, n), !1 !== n(r);
        } catch (o) {
          return im(e, o), !1;
        } finally {
          Pt(7, t, n);
        }
      }
      function Bm(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          Uo(e.componentOffset > -1 ? Ke(e.index, t) : t);
          let c = Vm(t, n, r, s),
            u = i.__ngNextListenerFn__;
          for (; u; ) (c = Vm(t, n, u, s) && c), (u = u.__ngNextListenerFn__);
          return o && !1 === c && s.preventDefault(), c;
        };
      }
      function Ko(e = 1) {
        return (function fb(e) {
          return (O.lFrame.contextLView = (function hb(e, t) {
            for (; e > 0; ) (t = t[ir]), e--;
            return t;
          })(e, O.lFrame.contextLView))[de];
        })(e);
      }
      function Ks(e, t) {
        return (e << 17) | (t << 2);
      }
      function Mn(e) {
        return (e >> 17) & 32767;
      }
      function hl(e) {
        return 2 | e;
      }
      function Vn(e) {
        return (131068 & e) >> 2;
      }
      function pl(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function gl(e) {
        return 1 | e;
      }
      function Jm(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? Mn(i) : Vn(i),
          c = !1;
        for (; 0 !== a && (!1 === c || s); ) {
          const l = e[a + 1];
          $0(e[a], t) && ((c = !0), (e[a + 1] = r ? gl(l) : hl(l))),
            (a = r ? Mn(l) : Vn(l));
        }
        c && (e[n + 1] = r ? hl(i) : gl(i));
      }
      function $0(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Cr(e, t) >= 0)
        );
      }
      function rt(e, t) {
        return (
          (function Et(e, t, n, r) {
            const o = y(),
              i = z(),
              s = Jt(2);
            i.firstUpdatePass &&
              (function av(e, t, n, r) {
                const o = e.data;
                if (null === o[n + 1]) {
                  const i = o[je()],
                    s = (function sv(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, n);
                  (function dv(e, t) {
                    return 0 != (e.flags & (t ? 8 : 16));
                  })(i, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function Q0(e, t, n, r) {
                      const o = (function Lc(e) {
                        const t = O.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let i = r ? t.residualClasses : t.residualStyles;
                      if (null === o)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((n = ei((n = ml(null, e, t, n, r)), t.attrs, r)),
                          (i = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((n = ml(o, e, t, n, r)), null === i)) {
                            let c = (function Y0(e, t, n) {
                              const r = n ? t.classBindings : t.styleBindings;
                              if (0 !== Vn(r)) return e[Mn(r)];
                            })(e, t, r);
                            void 0 !== c &&
                              Array.isArray(c) &&
                              ((c = ml(null, e, t, c[1], r)),
                              (c = ei(c, t.attrs, r)),
                              (function X0(e, t, n, r) {
                                e[Mn(n ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(e, t, r, c));
                          } else
                            i = (function J0(e, t, n) {
                              let r;
                              const o = t.directiveEnd;
                              for (
                                let i = 1 + t.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = ei(r, e[i].hostAttrs, n);
                              return ei(r, t.attrs, n);
                            })(e, t, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (t.residualClasses = i)
                            : (t.residualStyles = i)),
                        n
                      );
                    })(o, i, t, r)),
                    (function j0(e, t, n, r, o, i) {
                      let s = i ? t.classBindings : t.styleBindings,
                        a = Mn(s),
                        c = Vn(s);
                      e[r] = n;
                      let l,
                        u = !1;
                      if (
                        (Array.isArray(n)
                          ? ((l = n[1]),
                            (null === l || Cr(n, l) > 0) && (u = !0))
                          : (l = n),
                        o)
                      )
                        if (0 !== c) {
                          const f = Mn(e[a + 1]);
                          (e[r + 1] = Ks(f, a)),
                            0 !== f && (e[f + 1] = pl(e[f + 1], r)),
                            (e[a + 1] = (function F0(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = Ks(a, 0)),
                            0 !== a && (e[a + 1] = pl(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = Ks(c, 0)),
                          0 === a ? (a = r) : (e[c + 1] = pl(e[c + 1], r)),
                          (c = r);
                      u && (e[r + 1] = hl(e[r + 1])),
                        Jm(e, l, r, !0),
                        Jm(e, l, r, !1),
                        (function H0(e, t, n, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof t &&
                            Cr(i, t) >= 0 &&
                            (n[r + 1] = gl(n[r + 1]));
                        })(t, l, e, r, i),
                        (s = Ks(a, c)),
                        i ? (t.classBindings = s) : (t.styleBindings = s);
                    })(o, i, t, n, s, r);
                }
              })(i, e, s, r),
              t !== k &&
                Ne(o, s, t) &&
                (function uv(e, t, n, r, o, i, s, a) {
                  if (!(3 & t.type)) return;
                  const c = e.data,
                    u = c[a + 1],
                    l = (function L0(e) {
                      return 1 == (1 & e);
                    })(u)
                      ? lv(c, t, n, o, Vn(u), s)
                      : void 0;
                  ea(l) ||
                    (ea(i) ||
                      ((function k0(e) {
                        return 2 == (2 & e);
                      })(u) &&
                        (i = lv(c, null, n, o, a, s))),
                    (function NM(e, t, n, r, o) {
                      if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : _n.DashCase;
                        null == o
                          ? e.removeStyle(n, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= _n.Important)),
                            e.setStyle(n, r, o, i));
                      }
                    })(r, s, Ki(je(), n), o, i));
                })(
                  i,
                  i.data[je()],
                  o,
                  o[P],
                  e,
                  (o[s + 1] = (function nT(e, t) {
                    return (
                      null == e ||
                        "" === e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e && (e = ye(En(e)))),
                      e
                    );
                  })(t, n)),
                  r,
                  s
                );
          })(e, t, null, !0),
          rt
        );
      }
      function ml(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = t[a]), (r = ei(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function ei(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                et(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function lv(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const c = e[o],
            u = Array.isArray(c),
            l = u ? c[1] : c,
            d = null === l;
          let f = n[o + 1];
          f === k && (f = d ? q : void 0);
          let h = d ? Qc(f, r) : l === r ? f : void 0;
          if ((u && !ea(h) && (h = Qc(c, r)), ea(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? Mn(p) : Vn(p);
        }
        if (null !== t) {
          let c = i ? t.residualClasses : t.residualStyles;
          null != c && (a = Qc(c, r));
        }
        return a;
      }
      function ea(e) {
        return void 0 !== e;
      }
      function ce(e, t = "") {
        const n = y(),
          r = z(),
          o = e + V,
          i = r.firstCreatePass ? Fr(r, o, 1, t, null) : r.data[o],
          s = fv(r, n, i, t, e);
        (n[o] = s), es() && Es(r, n, s, i), kt(i, !1);
      }
      let fv = (e, t, n, r, o) => (wn(!0), Cs(t[P], r));
      function rT(e, t, n, r, o) {
        const i = t[Qt],
          s = !i || lr() || Fs(i, o);
        return wn(s), s ? Cs(t[P], r) : Ys(i, e, t, n);
      }
      function ta(e) {
        return ti("", e, ""), ta;
      }
      function ti(e, t, n) {
        const r = y(),
          o = (function jr(e, t, n, r) {
            return Ne(e, dr(), n) ? t + N(n) + r : k;
          })(r, e, t, n);
        return o !== k && nn(r, je(), o), ti;
      }
      function vl(e, t, n, r, o, i, s, a, c, u, l, d, f) {
        const h = y(),
          p = Ur(h, e, t, n, r, o, i, s, a, c, u, l, d, f);
        return p !== k && nn(h, je(), p), vl;
      }
      const Zr = "en-US";
      let Nv = Zr;
      class Un {}
      class iy {}
      class bl extends Un {
        constructor(t, n, r) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new fm(this));
          const o = Je(t);
          (this._bootstrapComponents = tn(o.bootstrap)),
            (this._r3Injector = Mg(
              t,
              n,
              [
                { provide: Un, useValue: this },
                { provide: Ls, useValue: this.componentFactoryResolver },
                ...r,
              ],
              ye(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class Ml extends iy {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new bl(this.moduleType, t, []);
        }
      }
      class sy extends Un {
        constructor(t) {
          super(),
            (this.componentFactoryResolver = new fm(this)),
            (this.instance = null);
          const n = new xs(
            [
              ...t.providers,
              { provide: Un, useValue: this },
              { provide: Ls, useValue: this.componentFactoryResolver },
            ],
            t.parent || Os(),
            t.debugName,
            new Set(["environment"])
          );
          (this.injector = n),
            t.runEnvironmentInitializers && n.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function Il(e, t, n = null) {
        return new sy({
          providers: e,
          parent: t,
          debugName: n,
          runEnvironmentInitializers: !0,
        }).injector;
      }
      let SA = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n)) {
              const r = ag(0, n.type),
                o =
                  r.length > 0
                    ? Il([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n, o);
            }
            return this.cachedInjectors.get(n);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
          static #e = (this.ɵprov = I({
            token: e,
            providedIn: "environment",
            factory: () => new e(M(ft)),
          }));
        }
        return e;
      })();
      function ay(e) {
        e.getStandaloneInjector = (t) =>
          t.get(SA).getOrCreateStandaloneInjector(e);
      }
      function tO(e, t, n, r = !0) {
        const o = t[w];
        if (
          ((function MM(e, t, n, r) {
            const o = Ie + r,
              i = n.length;
            r > 0 && (n[o - 1][wt] = t),
              r < i - Ie
                ? ((t[wt] = n[o]), up(n, Ie + r, t))
                : (n.push(t), (t[wt] = null)),
              (t[se] = n);
            const s = t[Do];
            null !== s &&
              n !== s &&
              (function IM(e, t) {
                const n = e[ar];
                t[fe] !== t[se][se][fe] && (e[sh] = !0),
                  null === n ? (e[ar] = [t]) : n.push(t);
              })(s, t);
            const a = t[Rt];
            null !== a && a.insertView(e), (t[F] |= 128);
          })(o, t, e, n),
          r)
        ) {
          const i = lu(n, e),
            s = t[P],
            a = _s(s, e[Nt]);
          null !== a &&
            (function _M(e, t, n, r, o, i) {
              (r[ue] = o), (r[xe] = t), Lo(e, r, n, 1, o, i);
            })(o, e[xe], s, t, a, i);
        }
      }
      Symbol;
      let rn = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = oO);
        }
        return e;
      })();
      const nO = rn,
        rO = class extends nO {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(t, n) {
            return this.createEmbeddedViewImpl(t, n);
          }
          createEmbeddedViewImpl(t, n, r) {
            const o = (function eO(e, t, n, r) {
              const o = t.tView,
                a = Bs(
                  e,
                  o,
                  n,
                  4096 & e[F] ? 4096 : 16,
                  null,
                  t,
                  null,
                  null,
                  null,
                  r?.injector ?? null,
                  r?.hydrationInfo ?? null
                );
              a[Do] = e[t.index];
              const u = e[Rt];
              return (
                null !== u && (a[Rt] = u.createEmbeddedView(o)), tl(o, a, n), a
              );
            })(this._declarationLView, this._declarationTContainer, t, {
              injector: n,
              hydrationInfo: r,
            });
            return new Go(o);
          }
        };
      function oO() {
        return (function sa(e, t) {
          return 4 & e.type ? new rO(t, e, Nr(e, t)) : null;
        })(Te(), y());
      }
      function Cy(e) {
        const t = e[bo] ?? [],
          r = e[se][P];
        for (const o of t) iO(o, r);
        e[bo] = q;
      }
      function iO(e, t) {
        let n = 0,
          r = e.firstChild;
        if (r) {
          const o = e.data[Rr];
          for (; n < o; ) {
            const i = r.nextSibling;
            bs(t, r, !1), (r = i), n++;
          }
        }
      }
      function Dy(e) {
        Cy(e);
        for (let t = Ie; t < e.length; t++) aa(e[t]);
      }
      function aa(e) {
        const t = e[w];
        for (let n = V; n < t.bindingStartIndex; n++)
          Fe(e[n]) ? Dy(e[n]) : Array.isArray(e[n]) && aa(e[n]);
      }
      let wy = (e, t) => null;
      function cO(e, t) {
        const n = e[bo];
        return t && null !== n && 0 !== n.length
          ? n[0].data[xu] === t
            ? n.shift()
            : (Cy(e), null)
          : null;
      }
      function _y(e, t) {
        return wy(e, t);
      }
      let Mt = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = lO);
        }
        return e;
      })();
      function lO() {
        return (function My(e, t) {
          let n;
          const r = t[e.index];
          return (
            Fe(r)
              ? (n = r)
              : ((n = em(r, t, null, e)), (t[e.index] = n), Us(t, n)),
            Iy(n, t, e, r),
            new Ey(n, e, t)
          );
        })(Te(), y());
      }
      const dO = Mt,
        Ey = class extends dO {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Nr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new He(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = ss(this._hostTNode, this._hostLView);
            if (Uc(t)) {
              const n = Ao(t, this._hostLView),
                r = To(t);
              return new He(n[w].data[r + 8], n);
            }
            return new He(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = by(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - Ie;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const s = _y(this._lContainer, t.ssrId),
              a = t.createEmbeddedViewImpl(n || {}, i, s),
              c = !!s && !vs(this._hostTNode);
            return this.insertImpl(a, o, c), a;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function xo(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const g = n || {};
              (a = g.index),
                (r = g.injector),
                (o = g.projectableNodes),
                (i = g.environmentInjector || g.ngModuleRef);
            }
            const c = s ? t : new Wo(U(t)),
              u = r || this.parentInjector;
            if (!i && null == c.ngModule) {
              const v = (s ? u : this.parentInjector).get(ft, null);
              v && (i = v);
            }
            const l = U(c.componentType ?? {}),
              d = _y(this._lContainer, l?.id ?? null),
              h = c.create(u, o, d?.firstChild ?? null, i),
              p = !!d && !vs(this._hostTNode);
            return this.insertImpl(h.hostView, a, p), h;
          }
          insert(t, n) {
            return this.insertImpl(t, n, !1);
          }
          insertImpl(t, n, r) {
            const o = t._lView;
            if (
              (function YE(e) {
                return Fe(e[se]);
              })(o)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const u = o[se],
                  l = new Ey(u, u[xe], u[se]);
                l.detach(l.indexOf(t));
              }
            }
            const s = this._adjustIndex(n),
              a = this._lContainer;
            return (
              tO(a, o, s, !r), t.attachToViewContainerRef(), up(Al(a), s, t), t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = by(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = ws(this._lContainer, n);
            r && (us(Al(this._lContainer), n), su(r[w], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = ws(this._lContainer, n);
            return r && null != us(Al(this._lContainer), n) ? new Go(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function by(e) {
        return e[8];
      }
      function Al(e) {
        return e[8] || (e[8] = []);
      }
      let Iy = Sy;
      function Sy(e, t, n, r) {
        if (e[Nt]) return;
        let o;
        (o =
          8 & n.type
            ? ne(r)
            : (function fO(e, t) {
                const n = e[P],
                  r = n.createComment(""),
                  o = Ge(t, e);
                return (
                  jn(
                    n,
                    _s(n, o),
                    r,
                    (function OM(e, t) {
                      return e.nextSibling(t);
                    })(n, o),
                    !1
                  ),
                  r
                );
              })(t, n)),
          (e[Nt] = o);
      }
      function hO(e, t, n, r) {
        if (e[Nt] && e[bo]) return;
        const o = t[Qt],
          i = n.index - V,
          s =
            (function ys(e) {
              let t = e.parent;
              for (; t; ) {
                if (Dp(t)) return !0;
                t = t.parent;
              }
              return !1;
            })(n) || vs(n);
        if (!o || s || Fs(o, i)) return Sy(e, t, n, r);
        const c = ku(o, i),
          u = o.data[Vo]?.[i],
          [l, d] = (function aO(e, t) {
            const n = [];
            for (const r of t)
              for (let o = 0; o < (r[Ns] ?? 1); o++) {
                const i = { data: r, firstChild: null };
                r[Rr] > 0 && ((i.firstChild = e), (e = Xs(r[Rr], e))),
                  n.push(i);
              }
            return [e, n];
          })(c, u);
        (e[Nt] = l), (e[bo] = d);
      }
      const $l = new E("Application Initializer");
      let Vl = (() => {
          class e {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((n, r) => {
                  (this.resolve = n), (this.reject = r);
                })),
                (this.appInits = _($l, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const n = [];
              for (const o of this.appInits) {
                const i = o();
                if (Js(i)) n.push(i);
                else if (jm(i)) {
                  const s = new Promise((a, c) => {
                    i.subscribe({ complete: a, error: c });
                  });
                  n.push(s);
                }
              }
              const r = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(n)
                .then(() => {
                  r();
                })
                .catch((o) => {
                  this.reject(o);
                }),
                0 === n.length && r(),
                (this.initialized = !0);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        Bl = (() => {
          class e {
            log(n) {
              console.log(n);
            }
            warn(n) {
              console.warn(n);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            }));
          }
          return e;
        })();
      const on = new E("LocaleId", {
        providedIn: "root",
        factory: () =>
          _(on, $.Optional | $.SkipSelf) ||
          (function UO() {
            return (typeof $localize < "u" && $localize.locale) || Zr;
          })(),
      });
      let Jy = (() => {
        class e {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new ct(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const n = this.taskId++;
            return this.pendingTasks.add(n), n;
          }
          remove(n) {
            this.pendingTasks.delete(n),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      class GO {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Ky = (() => {
        class e {
          compileModuleSync(n) {
            return new Ml(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = tn(Je(n).declarations).reduce((s, a) => {
                const c = U(a);
                return c && s.push(new Wo(c)), s;
              }, []);
            return new GO(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const rC = new E(""),
        la = new E("");
      let Wl,
        ql = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Wl ||
                  ((function fx(e) {
                    Wl = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      Y.assertNotInAngularZone(),
                        queueMicrotask(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                queueMicrotask(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(Y), M(Gl), M(la));
            });
            static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
          }
          return e;
        })(),
        Gl = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Wl?.findTestabilityInTree(this, n, r) ?? null;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            }));
          }
          return e;
        })(),
        In = null;
      const oC = new E("AllowMultipleToken"),
        Zl = new E("PlatformDestroyListeners"),
        da = new E("appBootstrapListener");
      class sC {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function cC(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new E(r);
        return (i = []) => {
          let s = Ql();
          if (!s || s.injector.get(oC, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function gx(e) {
                  if (In && !In.get(oC, !1)) throw new D(400, !1);
                  (function iC() {
                    !(function kE(e) {
                      yh = e;
                    })(() => {
                      throw new D(600, !1);
                    });
                  })(),
                    (In = e);
                  const t = e.get(lC);
                  (function aC(e) {
                    e.get(fg, null)?.forEach((n) => n());
                  })(e);
                })(
                  (function uC(e = [], t) {
                    return ht.create({
                      name: t,
                      providers: [
                        { provide: Eu, useValue: "platform" },
                        { provide: Zl, useValue: new Set([() => (In = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function vx(e) {
            const t = Ql();
            if (!t) throw new D(401, !1);
            return t;
          })();
        };
      }
      function Ql() {
        return In?.get(lC) ?? null;
      }
      let lC = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function yx(e = "zone.js", t) {
              return "noop" === e ? new qI() : "zone.js" === e ? new Y(t) : e;
            })(
              r?.ngZone,
              (function dC(e) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: r?.ngZoneEventCoalescing,
                runCoalescing: r?.ngZoneRunCoalescing,
              })
            );
            return o.run(() => {
              const i = (function IA(e, t, n) {
                  return new bl(e, t, n);
                })(
                  n.moduleType,
                  this.injector,
                  (function mC(e) {
                    return [
                      { provide: Y, useFactory: e },
                      {
                        provide: Sr,
                        multi: !0,
                        useFactory: () => {
                          const t = _(Dx, { optional: !0 });
                          return () => t.initialize();
                        },
                      },
                      { provide: gC, useFactory: Cx },
                      { provide: Og, useFactory: xg },
                    ];
                  })(() => o)
                ),
                s = i.injector.get(en, null);
              return (
                o.runOutsideAngular(() => {
                  const a = o.onError.subscribe({
                    next: (c) => {
                      s.handleError(c);
                    },
                  });
                  i.onDestroy(() => {
                    fa(this._modules, i), a.unsubscribe();
                  });
                }),
                (function fC(e, t, n) {
                  try {
                    const r = n();
                    return Js(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(s, o, () => {
                  const a = i.injector.get(Vl);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function Pv(e) {
                          ut(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (Nv = e.toLowerCase().replace(/_/g, "-"));
                        })(i.injector.get(on, Zr) || Zr),
                        this._moduleDoBootstrap(i),
                        i
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = hC({}, r);
            return (function hx(e, t, n) {
              const r = new Ml(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(zn);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new D(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new D(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Zl, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(ht));
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "platform",
          }));
        }
        return e;
      })();
      function hC(e, t) {
        return Array.isArray(t) ? t.reduce(hC, e) : { ...e, ...t };
      }
      let zn = (() => {
        class e {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = _(gC)),
              (this.zoneIsStable = _(Og)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = _(Jy).hasPendingTasks.pipe(
                Ot((n) => (n ? x(!1) : this.zoneIsStable)),
                (function q_(e, t = dn) {
                  return (
                    (e = e ?? G_),
                    me((n, r) => {
                      let o,
                        i = !0;
                      n.subscribe(
                        ve(r, (s) => {
                          const a = t(s);
                          (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
                        })
                      );
                    })
                  );
                })(),
                kf()
              )),
              (this._injector = _(ft));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const o = n instanceof yg;
            if (!this._injector.get(Vl).done)
              throw (
                (!o &&
                  (function nr(e) {
                    const t = U(e) || Me(e) || ke(e);
                    return null !== t && t.standalone;
                  })(n),
                new D(405, !1))
              );
            let s;
            (s = o ? n : this._injector.get(Ls).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function px(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(Un),
              u = s.create(ht.NULL, [], r || s.selector, a),
              l = u.location.nativeElement,
              d = u.injector.get(rC, null);
            return (
              d?.registerApplication(l),
              u.onDestroy(() => {
                this.detachView(u.hostView),
                  fa(this.components, u),
                  d?.unregisterApplication(l);
              }),
              this._loadComponent(u),
              u
            );
          }
          tick() {
            if (this._runningTick) throw new D(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this.internalErrorHandler(n);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            fa(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(da, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => fa(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new D(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function fa(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const gC = new E("", {
        providedIn: "root",
        factory: () => _(en).handleError.bind(void 0),
      });
      function Cx() {
        const e = _(Y),
          t = _(en);
        return (n) => e.runOutsideAngular(() => t.handleError(n));
      }
      let Dx = (() => {
        class e {
          constructor() {
            (this.zone = _(Y)), (this.applicationRef = _(zn));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription =
                this.zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                  },
                }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      let Yl = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = _x);
        }
        return e;
      })();
      function _x(e) {
        return (function Ex(e, t, n) {
          if (Pn(e) && !n) {
            const r = Ke(e.index, t);
            return new Go(r, r);
          }
          return 47 & e.type ? new Go(t[fe], t) : null;
        })(Te(), y(), 16 == (16 & e));
      }
      class DC {
        constructor() {}
        supports(t) {
          return Ws(t);
        }
        create(t) {
          return new Ax(t);
        }
      }
      const Tx = (e, t) => t;
      class Ax {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || Tx);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < _C(r, o, i)) ? n : r,
              a = _C(s, o, i),
              c = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const u = a - o,
                l = c - o;
              if (u != l) {
                for (let f = 0; f < u; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  l <= p && p < u && (i[f] = h + 1);
                }
                i[s.previousIndex] = l - u;
              }
            }
            a !== c && t(s, a, c);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !Ws(t))) throw new D(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function t0(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Symbol.iterator]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, i, o))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new Ox(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (t = this._reinsertAfter(i, t._prev, o))
              : t.currentIndex != o &&
                ((t.currentIndex = o), this._addToMoves(t, o)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new wC()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new wC()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class Ox {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class xx {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class wC {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new xx()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function _C(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      function bC() {
        return new ga([new DC()]);
      }
      let ga = (() => {
        class e {
          static #e = (this.ɵprov = I({
            token: e,
            providedIn: "root",
            factory: bC,
          }));
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || bC()),
              deps: [[e, new fs(), new ds()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new D(901, !1);
          }
        }
        return e;
      })();
      const Fx = cC(null, "core", []);
      let Lx = (() => {
          class e {
            constructor(n) {}
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(zn));
            });
            static #t = (this.ɵmod = mn({ type: e }));
            static #n = (this.ɵinj = Gt({}));
          }
          return e;
        })(),
        NC = !1;
      function Wx() {
        return Du([
          {
            provide: $s,
            useFactory: () => {
              let e = !0;
              return (
                kr() && (e = !!_(Or, { optional: !0 })?.get(Nu, null)),
                e && _(pg).add("hydration"),
                e
              );
            },
          },
          {
            provide: Sr,
            useValue: () => {
              kr() &&
                _($s) &&
                ((function Zx() {
                  const e = br();
                  let t;
                  for (const n of e.body.childNodes)
                    if (
                      n.nodeType === Node.COMMENT_NODE &&
                      n.textContent?.trim() === CI
                    ) {
                      t = n;
                      break;
                    }
                  if (!t) throw new D(-507, !1);
                })(),
                (function qx() {
                  NC ||
                    ((NC = !0),
                    (function wI() {
                      gg = DI;
                    })(),
                    (function S0() {
                      Pm = I0;
                    })(),
                    (function oT() {
                      fv = rT;
                    })(),
                    (function O0() {
                      Fm = A0;
                    })(),
                    (function _0() {
                      Rm = w0;
                    })(),
                    (function pO() {
                      Iy = hO;
                    })(),
                    (function uO() {
                      wy = cO;
                    })(),
                    (function cS() {
                      Zg = aS;
                    })());
                })());
            },
            multi: !0,
          },
          { provide: Fg, useFactory: () => kr() && _($s) },
          {
            provide: da,
            useFactory: () => {
              if (kr() && _($s)) {
                const e = _(zn);
                return (
                  _(ht),
                  () => {
                    (function Gx(e, t) {
                      return e.isStable
                        .pipe(qt((r) => r))
                        .toPromise()
                        .then(() => {});
                    })(e).then(() => {
                      Y.assertInAngularZone(),
                        (function sO(e) {
                          const t = e._views;
                          for (const n of t) {
                            const r = mg(n);
                            null !== r &&
                              null !== r[ue] &&
                              (qe(r) ? aa(r) : (aa(r[ue]), Dy(r)));
                          }
                        })(e);
                    });
                  }
                );
              }
              return () => {};
            },
            multi: !0,
          },
        ]);
      }
      let rd = null;
      function Xr() {
        return rd;
      }
      class Jx {}
      const ot = new E("DocumentToken");
      let od = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: function () {
              return _(eR);
            },
            providedIn: "platform",
          }));
        }
        return e;
      })();
      const Kx = new E("Location Initialized");
      let eR = (() => {
        class e extends od {
          constructor() {
            super(),
              (this._doc = _(ot)),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Xr().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Xr().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Xr().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(n) {
            this._location.pathname = n;
          }
          pushState(n, r, o) {
            this._history.pushState(n, r, o);
          }
          replaceState(n, r, o) {
            this._history.replaceState(n, r, o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: function () {
              return new e();
            },
            providedIn: "platform",
          }));
        }
        return e;
      })();
      function id(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function PC(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function sn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let Gn = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: function () {
              return _(FC);
            },
            providedIn: "root",
          }));
        }
        return e;
      })();
      const kC = new E("appBaseHref");
      let FC = (() => {
          class e extends Gn {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  _(ot).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return id(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  sn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + sn(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + sn(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(od), M(kC, 8));
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        tR = (() => {
          class e extends Gn {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = id(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + sn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + sn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(od), M(kC, 8));
            });
            static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
          }
          return e;
        })(),
        sd = (() => {
          class e {
            constructor(n) {
              (this._subject = new _e()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function oR(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, n] = e.split(/\/\/[^\/]+/);
                  return n;
                }
                return e;
              })(PC(LC(r)))),
                this._locationStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + sn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function rR(e, t) {
                  if (!e || !t.startsWith(e)) return t;
                  const n = t.substring(e.length);
                  return "" === n || ["/", ";", "?", "#"].includes(n[0])
                    ? n
                    : t;
                })(this._basePath, LC(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._locationStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + sn(r)),
                  o
                );
            }
            replaceState(n, r = "", o = null) {
              this._locationStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + sn(r)),
                  o
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
            static #e = (this.normalizeQueryParams = sn);
            static #t = (this.joinWithSlash = id);
            static #n = (this.stripTrailingSlash = PC);
            static #r = (this.ɵfac = function (r) {
              return new (r || e)(M(Gn));
            });
            static #o = (this.ɵprov = I({
              token: e,
              factory: function () {
                return (function nR() {
                  return new sd(M(Gn));
                })();
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      function LC(e) {
        return e.replace(/\/index.html$/, "");
      }
      class qR {
        constructor(t, n, r, o) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let vd = (() => {
        class e {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new qR(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), ZC(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              ZC(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(Mt), S(rn), S(ga));
          });
          static #t = (this.ɵdir = Pe({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          }));
        }
        return e;
      })();
      function ZC(e, t) {
        e.context.$implicit = t.item;
      }
      let QC = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new GR()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            YC("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            YC("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(S(Mt), S(rn));
          });
          static #t = (this.ɵdir = Pe({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          }));
        }
        return e;
      })();
      class GR {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function YC(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${ye(t)}'.`
          );
      }
      let KC = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵmod = mn({ type: e }));
          static #n = (this.ɵinj = Gt({}));
        }
        return e;
      })();
      function tD(e) {
        return "server" === e;
      }
      let DN = (() => {
        class e {
          static #e = (this.ɵprov = I({
            token: e,
            providedIn: "root",
            factory: () => new wN(M(ot), window),
          }));
        }
        return e;
      })();
      class wN {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function _N(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              "function" == typeof e.body.attachShadow
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          this.supportsScrolling() &&
            (this.window.history.scrollRestoration = t);
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function Ae(e, t, n) {
        const r = J(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? me((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                ve(
                  i,
                  (c) => {
                    var u;
                    null === (u = r.next) || void 0 === u || u.call(r, c),
                      i.next(c);
                  },
                  () => {
                    var c;
                    (a = !1),
                      null === (c = r.complete) || void 0 === c || c.call(r),
                      i.complete();
                  },
                  (c) => {
                    var u;
                    (a = !1),
                      null === (u = r.error) || void 0 === u || u.call(r, c),
                      i.error(c);
                  },
                  () => {
                    var c, u;
                    a &&
                      (null === (c = r.unsubscribe) ||
                        void 0 === c ||
                        c.call(r)),
                      null === (u = r.finalize) || void 0 === u || u.call(r);
                  }
                )
              );
            })
          : dn;
      }
      class Wn {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? "string" == typeof t
                ? (this.lazyInit = () => {
                    (this.headers = new Map()),
                      t.split("\n").forEach((n) => {
                        const r = n.indexOf(":");
                        if (r > 0) {
                          const o = n.slice(0, r),
                            i = o.toLowerCase(),
                            s = n.slice(r + 1).trim();
                          this.maybeSetNormalizedName(o, i),
                            this.headers.has(i)
                              ? this.headers.get(i).push(s)
                              : this.headers.set(i, [s]);
                        }
                      });
                  })
                : typeof Headers < "u" && t instanceof Headers
                ? ((this.headers = new Map()),
                  t.forEach((n, r) => {
                    this.setHeaderEntries(r, n);
                  }))
                : (this.lazyInit = () => {
                    (this.headers = new Map()),
                      Object.entries(t).forEach(([n, r]) => {
                        this.setHeaderEntries(n, r);
                      });
                  })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Wn
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((n) => {
              this.headers.set(n, t.headers.get(n)),
                this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new Wn();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof Wn
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              o.push(...r), this.headers.set(n, o);
              break;
            case "d":
              const i = t.value;
              if (i) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        setHeaderEntries(t, n) {
          const r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
            o = t.toLowerCase();
          this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              t(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      var Md = (function (e) {
        return (
          (e[(e.Sent = 0)] = "Sent"),
          (e[(e.UploadProgress = 1)] = "UploadProgress"),
          (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
          (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
          (e[(e.Response = 4)] = "Response"),
          (e[(e.User = 5)] = "User"),
          e
        );
      })(Md || {});
      class KN {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new Wn()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Oa extends KN {
        constructor(t = {}) {
          super(t),
            (this.type = Md.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new Oa({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      const iP = new E(""),
        Ra = new E(""),
        gP = ["GET", "HEAD"];
      function mP(e, t) {
        const { isCacheActive: n } = _(Ra);
        if (!n || !gP.includes(e.method)) return t(e);
        const r = _(Or),
          o = (function yP(e) {
            const { params: t, method: n, responseType: r, url: o } = e;
            return (function CP(e) {
              let t = 0;
              for (const n of e) t = (Math.imul(31, t) + n.charCodeAt(0)) << 0;
              return (t += 2147483648), t.toString();
            })(
              n +
                "." +
                r +
                "." +
                o +
                "?" +
                t
                  .keys()
                  .sort()
                  .map((c) => `${c}=${t.getAll(c)}`)
                  .join("&")
            );
          })(e),
          i = r.get(o, null);
        if (i) {
          let s = i.body;
          switch (i.responseType) {
            case "arraybuffer":
              s = new TextEncoder().encode(i.body).buffer;
              break;
            case "blob":
              s = new Blob([i.body]);
          }
          return x(
            new Oa({
              body: s,
              headers: new Wn(i.headers),
              status: i.status,
              statusText: i.statusText,
              url: i.url,
            })
          );
        }
        return t(e).pipe(
          Ae((s) => {
            s instanceof Oa &&
              r.set(o, {
                body: s.body,
                headers: vP(s.headers),
                status: s.status,
                statusText: s.statusText,
                url: s.url || "",
                responseType: e.responseType,
              });
          })
        );
      }
      function vP(e) {
        const t = {};
        for (const n of e.keys()) {
          const r = e.getAll(n);
          null !== r && (t[n] = r);
        }
        return t;
      }
      class wP extends Jx {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class Sd extends wP {
        static makeCurrent() {
          !(function Xx(e) {
            rd || (rd = e);
          })(new Sd());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r),
            () => {
              t.removeEventListener(n, r);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function _P() {
            return (
              (mi = mi || document.querySelector("base")),
              mi ? mi.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function EP(e) {
                (Na = Na || document.createElement("a")),
                  Na.setAttribute("href", e);
                const t = Na.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          mi = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function BR(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (o.trim() === t) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Na,
        mi = null,
        MP = (() => {
          class e {
            build() {
              return new XMLHttpRequest();
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
          }
          return e;
        })();
      const Td = new E("EventManagerPlugins");
      let wD = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => {
                o.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r) return r;
            if (((r = this._plugins.find((i) => i.supports(n))), !r))
              throw new D(5101, !1);
            return this._eventNameToPlugin.set(n, r), r;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(Td), M(Y));
          });
          static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class _D {
        constructor(t) {
          this._doc = t;
        }
      }
      const Ad = "ng-app-id";
      let ED = (() => {
        class e {
          constructor(n, r, o, i = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = o),
              (this.platformId = i),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = tD(i)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (const r of n)
              1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(n) {
            for (const r of n)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const n = this.styleNodesInDOM;
            n && (n.forEach((r) => r.remove()), n.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (const r of this.hostNodes) this.addStyleToHost(r, n);
          }
          onStyleRemoved(n) {
            const r = this.styleRef;
            r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
          }
          collectServerRenderedStyles() {
            const n = this.doc.head?.querySelectorAll(
              `style[${Ad}="${this.appId}"]`
            );
            if (n?.length) {
              const r = new Map();
              return (
                n.forEach((o) => {
                  null != o.textContent && r.set(o.textContent, o);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(n, r) {
            const o = this.styleRef;
            if (o.has(n)) {
              const i = o.get(n);
              return (i.usage += r), i.usage;
            }
            return o.set(n, { usage: r, elements: [] }), r;
          }
          getStyleElement(n, r) {
            const o = this.styleNodesInDOM,
              i = o?.get(r);
            if (i?.parentNode === n)
              return o.delete(r), i.removeAttribute(Ad), i;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(Ad, this.appId),
                s
              );
            }
          }
          addStyleToHost(n, r) {
            const o = this.getStyleElement(n, r);
            n.appendChild(o);
            const i = this.styleRef,
              s = i.get(r)?.elements;
            s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
          }
          resetHostNodes() {
            const n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(ot), M(Rs), M(hg, 8), M(Ar));
          });
          static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const Od = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        xd = /%COMP%/g,
        AP = new E("RemoveStylesOnCompDestroy", {
          providedIn: "root",
          factory: () => !1,
        });
      function MD(e, t) {
        return t.map((n) => n.replace(xd, e));
      }
      let ID = (() => {
        class e {
          constructor(n, r, o, i, s, a, c, u = null) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.removeStylesOnCompDestroy = i),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = c),
              (this.nonce = u),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = tD(a)),
              (this.defaultRenderer = new Rd(n, s, c, this.platformIsServer));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === Ct.ShadowDom &&
              (r = { ...r, encapsulation: Ct.Emulated });
            const o = this.getOrCreateRenderer(n, r);
            return (
              o instanceof TD
                ? o.applyToHost(n)
                : o instanceof Nd && o.applyStyles(),
              o
            );
          }
          getOrCreateRenderer(n, r) {
            const o = this.rendererByCompId;
            let i = o.get(r.id);
            if (!i) {
              const s = this.doc,
                a = this.ngZone,
                c = this.eventManager,
                u = this.sharedStylesHost,
                l = this.removeStylesOnCompDestroy,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case Ct.Emulated:
                  i = new TD(c, u, r, this.appId, l, s, a, d);
                  break;
                case Ct.ShadowDom:
                  return new NP(c, u, n, r, s, a, this.nonce, d);
                default:
                  i = new Nd(c, u, r, l, s, a, d);
              }
              o.set(r.id, i);
            }
            return i;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(
              M(wD),
              M(ED),
              M(Rs),
              M(AP),
              M(ot),
              M(Ar),
              M(Y),
              M(hg)
            );
          });
          static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class Rd {
        constructor(t, n, r, o) {
          (this.eventManager = t),
            (this.doc = n),
            (this.ngZone = r),
            (this.platformIsServer = o),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? this.doc.createElementNS(Od[n] || n, t)
            : this.doc.createElement(t);
        }
        createComment(t) {
          return this.doc.createComment(t);
        }
        createText(t) {
          return this.doc.createTextNode(t);
        }
        appendChild(t, n) {
          (SD(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (SD(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? this.doc.querySelector(t) : t;
          if (!r) throw new D(-5104, !1);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = Od[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = Od[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (_n.DashCase | _n.Important)
            ? t.style.setProperty(n, r, o & _n.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & _n.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          if (
            "string" == typeof t &&
            !(t = Xr().getGlobalEventTarget(this.doc, t))
          )
            throw new Error(`Unsupported event target ${t} for event ${n}`);
          return this.eventManager.addEventListener(
            t,
            n,
            this.decoratePreventDefault(r)
          );
        }
        decoratePreventDefault(t) {
          return (n) => {
            if ("__ngUnwrap__" === n) return t;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => t(n))
                : t(n)) && n.preventDefault();
          };
        }
      }
      function SD(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class NP extends Rd {
        constructor(t, n, r, o, i, s, a, c) {
          super(t, i, s, c),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const u = MD(o.id, o.styles);
          for (const l of u) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = l),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class Nd extends Rd {
        constructor(t, n, r, o, i, s, a, c) {
          super(t, i, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestroy = o),
            (this.styles = c ? MD(c, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles);
        }
        destroy() {
          this.removeStylesOnCompDestroy &&
            this.sharedStylesHost.removeStyles(this.styles);
        }
      }
      class TD extends Nd {
        constructor(t, n, r, o, i, s, a, c) {
          const u = o + "-" + r.id;
          super(t, n, r, i, s, a, c, u),
            (this.contentAttr = (function OP(e) {
              return "_ngcontent-%COMP%".replace(xd, e);
            })(u)),
            (this.hostAttr = (function xP(e) {
              return "_nghost-%COMP%".replace(xd, e);
            })(u));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let PP = (() => {
        class e extends _D {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(ot));
          });
          static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const AD = ["alt", "control", "meta", "shift"],
        kP = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        FP = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let LP = (() => {
        class e extends _D {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Xr().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              AD.forEach((u) => {
                const l = r.indexOf(u);
                l > -1 && (r.splice(l, 1), (s += u + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const c = {};
            return (c.domEventName = o), (c.fullKey = s), c;
          }
          static matchEventFullKeyCode(n, r) {
            let o = kP[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                AD.forEach((s) => {
                  s !== o && (0, FP[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(ot));
          });
          static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const VP = cC(Fx, "browser", [
          { provide: Ar, useValue: "browser" },
          {
            provide: fg,
            useValue: function jP() {
              Sd.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: ot,
            useFactory: function $P() {
              return (
                (function jM(e) {
                  hu = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        BP = new E(""),
        RD = [
          {
            provide: la,
            useClass: class bP {
              addToWindow(t) {
                (te.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i) throw new D(5103, !1);
                  return i;
                }),
                  (te.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (te.getAllAngularRootElements = () => t.getAllRootElements()),
                  te.frameworkStabilizers || (te.frameworkStabilizers = []),
                  te.frameworkStabilizers.push((r) => {
                    const o = te.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (c) {
                      (s = s || c), i--, 0 == i && r(s);
                    };
                    o.forEach((c) => {
                      c.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? Xr().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: rC, useClass: ql, deps: [Y, Gl, la] },
          { provide: ql, useClass: ql, deps: [Y, Gl, la] },
        ],
        ND = [
          { provide: Eu, useValue: "root" },
          {
            provide: en,
            useFactory: function HP() {
              return new en();
            },
            deps: [],
          },
          { provide: Td, useClass: PP, multi: !0, deps: [ot, Y, Ar] },
          { provide: Td, useClass: LP, multi: !0, deps: [ot] },
          ID,
          ED,
          wD,
          { provide: Dg, useExisting: ID },
          { provide: class EN {}, useClass: MP, deps: [] },
          [],
        ];
      let UP = (() => {
          class e {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: e,
                providers: [{ provide: Rs, useValue: n.appId }],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(BP, 12));
            });
            static #t = (this.ɵmod = mn({ type: e }));
            static #n = (this.ɵinj = Gt({
              providers: [...ND, ...RD],
              imports: [KC, Lx],
            }));
          }
          return e;
        })(),
        PD = (() => {
          class e {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(ot));
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: function (r) {
                let o = null;
                return (
                  (o = r
                    ? new r()
                    : (function qP() {
                        return new PD(M(ot));
                      })()),
                  o
                );
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      function YP(...e) {
        const t = [],
          n = new Set();
        for (const { ɵproviders: r, ɵkind: o } of e)
          n.add(o), r.length && t.push(r);
        return Du([
          [],
          n.has(0) ? [] : Wx(),
          n.has(1)
            ? []
            : [
                {
                  provide: Ra,
                  useFactory: () => (
                    _(pg).add("httpcache"), { isCacheActive: !0 }
                  ),
                },
                { provide: iP, useValue: mP, multi: !0, deps: [Or, Ra] },
                {
                  provide: da,
                  multi: !0,
                  useFactory: () => {
                    const e = _(zn),
                      t = _(Ra);
                    return () => {
                      e.isStable
                        .pipe(qt((n) => n))
                        .toPromise()
                        .then(() => {
                          t.isCacheActive = !1;
                        });
                    };
                  },
                },
              ],
          t,
        ]);
      }
      typeof window < "u" && window;
      const { isArray: JP } = Array,
        { getPrototypeOf: KP, prototype: e1, keys: t1 } = Object;
      const { isArray: o1 } = Array;
      function kd(...e) {
        const t = fo(e),
          n = (function F_(e) {
            return J(sc(e)) ? e.pop() : void 0;
          })(e),
          { args: r, keys: o } = (function n1(e) {
            if (1 === e.length) {
              const t = e[0];
              if (JP(t)) return { args: t, keys: null };
              if (
                (function r1(e) {
                  return e && "object" == typeof e && KP(e) === e1;
                })(t)
              ) {
                const n = t1(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e);
        if (0 === r.length) return be([], t);
        const i = new ge(
          (function u1(e, t, n = dn) {
            return (r) => {
              jD(
                t,
                () => {
                  const { length: o } = e,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let c = 0; c < o; c++)
                    jD(
                      t,
                      () => {
                        const u = be(e[c], t);
                        let l = !1;
                        u.subscribe(
                          ve(
                            r,
                            (d) => {
                              (i[c] = d),
                                l || ((l = !0), a--),
                                a || r.next(n(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(
            r,
            t,
            o
              ? (s) =>
                  (function c1(e, t) {
                    return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
                  })(o, s)
              : dn
          )
        );
        return n
          ? i.pipe(
              (function a1(e) {
                return ee((t) =>
                  (function s1(e, t) {
                    return o1(t) ? e(...t) : e(t);
                  })(e, t)
                );
              })(n)
            )
          : i;
      }
      function jD(e, t, n) {
        e ? zt(n, e, t) : t();
      }
      function Fd(...e) {
        return (function l1() {
          return Kn(1);
        })()(be(e, fo(e)));
      }
      function HD(e) {
        return new ge((t) => {
          at(e()).subscribe(t);
        });
      }
      function vi(e, t) {
        const n = J(e) ? e : () => e,
          r = (o) => o.error(n());
        return new ge(t ? (o) => t.schedule(r, 0, o) : r);
      }
      function Ld() {
        return me((e, t) => {
          let n = null;
          e._refCount++;
          const r = ve(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const o = e._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class $D extends ge {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            vf(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new Ye();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                ve(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = Ye.EMPTY));
          }
          return t;
        }
        refCount() {
          return Ld()(this);
        }
      }
      function yi(e, t) {
        return J(t) ? Ee(e, t, 1) : Ee(e, 1);
      }
      function Qn(e) {
        return me((t, n) => {
          let i,
            r = null,
            o = !1;
          (r = t.subscribe(
            ve(n, void 0, void 0, (s) => {
              (i = at(e(s, Qn(e)(t)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function jd(e) {
        return e <= 0
          ? () => At
          : me((t, n) => {
              let r = [];
              t.subscribe(
                ve(
                  n,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function Hd(e) {
        return me((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      const L = "primary",
        Ci = Symbol("RouteTitle");
      class v1 {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Kr(e) {
        return new v1(e);
      }
      function y1(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function Vt(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !VD(e[o], t[o]))) return !1;
        return !0;
      }
      function VD(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((o, i) => r[i] === o);
        }
        return e === t;
      }
      function BD(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function An(e) {
        return (function XP(e) {
          return !!e && (e instanceof ge || (J(e.lift) && J(e.subscribe)));
        })(e)
          ? e
          : Js(e)
          ? be(Promise.resolve(e))
          : x(e);
      }
      const D1 = {
          exact: function qD(e, t, n) {
            if (
              !Yn(e.segments, t.segments) ||
              !Pa(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !qD(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: GD,
        },
        UD = {
          exact: function w1(e, t) {
            return Vt(e, t);
          },
          subset: function _1(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => VD(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function zD(e, t, n) {
        return (
          D1[n.paths](e.root, t.root, n.matrixParams) &&
          UD[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function GD(e, t, n) {
        return WD(e, t, t.segments, n);
      }
      function WD(e, t, n, r) {
        if (e.segments.length > n.length) {
          const o = e.segments.slice(0, n.length);
          return !(!Yn(o, n) || t.hasChildren() || !Pa(o, n, r));
        }
        if (e.segments.length === n.length) {
          if (!Yn(e.segments, n) || !Pa(e.segments, n, r)) return !1;
          for (const o in t.children)
            if (!e.children[o] || !GD(e.children[o], t.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
          return (
            !!(Yn(e.segments, o) && Pa(e.segments, o, r) && e.children[L]) &&
            WD(e.children[L], t, i, r)
          );
        }
      }
      function Pa(e, t, n) {
        return t.every((r, o) => UD[n](e[o].parameters, r.parameters));
      }
      class eo {
        constructor(t = new X([], {}), n = {}, r = null) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Kr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return M1.serialize(this);
        }
      }
      class X {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Object.values(n).forEach((r) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return ka(this);
        }
      }
      class Di {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = Kr(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return YD(this);
        }
      }
      function Yn(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      let wi = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: function () {
              return new $d();
            },
            providedIn: "root",
          }));
        }
        return e;
      })();
      class $d {
        parse(t) {
          const n = new F1(t);
          return new eo(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(t) {
          const n = `/${_i(t.root, !0)}`,
            r = (function T1(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${Fa(n)}=${Fa(o)}`).join("&")
                    : `${Fa(n)}=${Fa(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function I1(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const M1 = new $d();
      function ka(e) {
        return e.segments.map((t) => YD(t)).join("/");
      }
      function _i(e, t) {
        if (!e.hasChildren()) return ka(e);
        if (t) {
          const n = e.children[L] ? _i(e.children[L], !1) : "",
            r = [];
          return (
            Object.entries(e.children).forEach(([o, i]) => {
              o !== L && r.push(`${o}:${_i(i, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function b1(e, t) {
            let n = [];
            return (
              Object.entries(e.children).forEach(([r, o]) => {
                r === L && (n = n.concat(t(o, r)));
              }),
              Object.entries(e.children).forEach(([r, o]) => {
                r !== L && (n = n.concat(t(o, r)));
              }),
              n
            );
          })(e, (r, o) =>
            o === L ? [_i(e.children[L], !1)] : [`${o}:${_i(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[L]
            ? `${ka(e)}/${n[0]}`
            : `${ka(e)}/(${n.join("//")})`;
        }
      }
      function ZD(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function Fa(e) {
        return ZD(e).replace(/%3B/gi, ";");
      }
      function Vd(e) {
        return ZD(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function La(e) {
        return decodeURIComponent(e);
      }
      function QD(e) {
        return La(e.replace(/\+/g, "%20"));
      }
      function YD(e) {
        return `${Vd(e.path)}${(function S1(e) {
          return Object.keys(e)
            .map((t) => `;${Vd(t)}=${Vd(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const A1 = /^[^\/()?;#]+/;
      function Bd(e) {
        const t = e.match(A1);
        return t ? t[0] : "";
      }
      const O1 = /^[^\/()?;=#]+/,
        R1 = /^[^=?&#]+/,
        P1 = /^[^&#]+/;
      class F1 {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new X([], {})
              : new X([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[L] = new X(t, n)),
            r
          );
        }
        parseSegment() {
          const t = Bd(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new D(4009, !1);
          return this.capture(t), new Di(La(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = (function x1(e) {
            const t = e.match(O1);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = Bd(this.remaining);
            o && ((r = o), this.capture(r));
          }
          t[La(n)] = La(r);
        }
        parseQueryParam(t) {
          const n = (function N1(e) {
            const t = e.match(R1);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function k1(e) {
              const t = e.match(P1);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = QD(n),
            i = QD(r);
          if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
          } else t[o] = i;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = Bd(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o) throw new D(4010, !1);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.slice(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : t && (i = L);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[L] : new X([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new D(4011, !1);
        }
      }
      function XD(e) {
        return e.segments.length > 0 ? new X([], { [L]: e }) : e;
      }
      function JD(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const i = JD(e.children[r]);
          if (r === L && 0 === i.segments.length && i.hasChildren())
            for (const [s, a] of Object.entries(i.children)) t[s] = a;
          else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
        }
        return (function L1(e) {
          if (1 === e.numberOfChildren && e.children[L]) {
            const t = e.children[L];
            return new X(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new X(e.segments, t));
      }
      function Xn(e) {
        return e instanceof eo;
      }
      function KD(e) {
        let t;
        const o = XD(
          (function n(i) {
            const s = {};
            for (const c of i.children) {
              const u = n(c);
              s[c.outlet] = u;
            }
            const a = new X(i.url, s);
            return i === e && (t = a), a;
          })(e.root)
        );
        return t ?? o;
      }
      function ew(e, t, n, r) {
        let o = e;
        for (; o.parent; ) o = o.parent;
        if (0 === t.length) return Ud(o, o, o, n, r);
        const i = (function H1(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new nw(!0, 0, e);
          let t = 0,
            n = !1;
          const r = e.reduce((o, i, s) => {
            if ("object" == typeof i && null != i) {
              if (i.outlets) {
                const a = {};
                return (
                  Object.entries(i.outlets).forEach(([c, u]) => {
                    a[c] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...o, { outlets: a }]
                );
              }
              if (i.segmentPath) return [...o, i.segmentPath];
            }
            return "string" != typeof i
              ? [...o, i]
              : 0 === s
              ? (i.split("/").forEach((a, c) => {
                  (0 == c && "." === a) ||
                    (0 == c && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? t++
                      : "" != a && o.push(a));
                }),
                o)
              : [...o, i];
          }, []);
          return new nw(n, t, r);
        })(t);
        if (i.toRoot()) return Ud(o, o, new X([], {}), n, r);
        const s = (function $1(e, t, n) {
            if (e.isAbsolute) return new Ha(t, !0, 0);
            if (!n) return new Ha(t, !1, NaN);
            if (null === n.parent) return new Ha(n, !0, 0);
            const r = ja(e.commands[0]) ? 0 : 1;
            return (function V1(e, t, n) {
              let r = e,
                o = t,
                i = n;
              for (; i > o; ) {
                if (((i -= o), (r = r.parent), !r)) throw new D(4005, !1);
                o = r.segments.length;
              }
              return new Ha(r, !1, o - i);
            })(n, n.segments.length - 1 + r, e.numberOfDoubleDots);
          })(i, o, e),
          a = s.processChildren
            ? bi(s.segmentGroup, s.index, i.commands)
            : rw(s.segmentGroup, s.index, i.commands);
        return Ud(o, s.segmentGroup, a, n, r);
      }
      function ja(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function Ei(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function Ud(e, t, n, r, o) {
        let s,
          i = {};
        r &&
          Object.entries(r).forEach(([c, u]) => {
            i[c] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
          }),
          (s = e === t ? n : tw(e, t, n));
        const a = XD(JD(s));
        return new eo(a, i, o);
      }
      function tw(e, t, n) {
        const r = {};
        return (
          Object.entries(e.children).forEach(([o, i]) => {
            r[o] = i === t ? n : tw(i, t, n);
          }),
          new X(e.segments, r)
        );
      }
      class nw {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && ja(r[0]))
          )
            throw new D(4003, !1);
          const o = r.find(Ei);
          if (o && o !== BD(r)) throw new D(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class Ha {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function rw(e, t, n) {
        if (
          (e || (e = new X([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return bi(e, t, n);
        const r = (function U1(e, t, n) {
            let r = 0,
              o = t;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= n.length) return i;
              const s = e.segments[o],
                a = n[r];
              if (Ei(a)) break;
              const c = `${a}`,
                u = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === c) break;
              if (c && u && "object" == typeof u && void 0 === u.outlets) {
                if (!iw(c, u, s)) return i;
                r += 2;
              } else {
                if (!iw(c, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, t, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new X(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[L] = new X(e.segments.slice(r.pathIndex), e.children)),
            bi(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new X(e.segments, {})
          : r.match && !e.hasChildren()
          ? zd(e, t, n)
          : r.match
          ? bi(e, 0, o)
          : zd(e, t, n);
      }
      function bi(e, t, n) {
        if (0 === n.length) return new X(e.segments, {});
        {
          const r = (function B1(e) {
              return Ei(e[0]) ? e[0].outlets : { [L]: e };
            })(n),
            o = {};
          if (
            Object.keys(r).some((i) => i !== L) &&
            e.children[L] &&
            1 === e.numberOfChildren &&
            0 === e.children[L].segments.length
          ) {
            const i = bi(e.children[L], t, n);
            return new X(e.segments, i.children);
          }
          return (
            Object.entries(r).forEach(([i, s]) => {
              "string" == typeof s && (s = [s]),
                null !== s && (o[i] = rw(e.children[i], t, s));
            }),
            Object.entries(e.children).forEach(([i, s]) => {
              void 0 === r[i] && (o[i] = s);
            }),
            new X(e.segments, o)
          );
        }
      }
      function zd(e, t, n) {
        const r = e.segments.slice(0, t);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (Ei(i)) {
            const c = z1(i.outlets);
            return new X(r, c);
          }
          if (0 === o && ja(n[0])) {
            r.push(new Di(e.segments[t].path, ow(n[0]))), o++;
            continue;
          }
          const s = Ei(i) ? i.outlets[L] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && ja(a)
            ? (r.push(new Di(s, ow(a))), (o += 2))
            : (r.push(new Di(s, {})), o++);
        }
        return new X(r, {});
      }
      function z1(e) {
        const t = {};
        return (
          Object.entries(e).forEach(([n, r]) => {
            "string" == typeof r && (r = [r]),
              null !== r && (t[n] = zd(new X([], {}), 0, r));
          }),
          t
        );
      }
      function ow(e) {
        const t = {};
        return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
      }
      function iw(e, t, n) {
        return e == n.path && Vt(t, n.parameters);
      }
      const Mi = "imperative";
      class Bt {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class $a extends Bt {
        constructor(t, n, r = "imperative", o = null) {
          super(t, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class On extends Bt {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Ii extends Bt {
        constructor(t, n, r, o) {
          super(t, n), (this.reason = r), (this.code = o), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class to extends Bt {
        constructor(t, n, r, o) {
          super(t, n), (this.reason = r), (this.code = o), (this.type = 16);
        }
      }
      class Va extends Bt {
        constructor(t, n, r, o) {
          super(t, n), (this.error = r), (this.target = o), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class sw extends Bt {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class q1 extends Bt {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class G1 extends Bt {
        constructor(t, n, r, o, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class W1 extends Bt {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Z1 extends Bt {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Q1 {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class Y1 {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class X1 {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class J1 {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class K1 {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class ek {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class aw {
        constructor(t, n, r) {
          (this.routerEvent = t),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class qd {}
      class Gd {
        constructor(t) {
          this.url = t;
        }
      }
      class tk {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new Si()),
            (this.attachRef = null);
        }
      }
      let Si = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const o = this.getOrCreateContext(n);
            (o.outlet = r), this.contexts.set(n, o);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new tk()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      class cw {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = Wd(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = Wd(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = Zd(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== t);
        }
        pathFromRoot(t) {
          return Zd(t, this._root).map((n) => n.value);
        }
      }
      function Wd(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = Wd(e, n);
          if (r) return r;
        }
        return null;
      }
      function Zd(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = Zd(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class un {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function no(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class uw extends cw {
        constructor(t, n) {
          super(t), (this.snapshot = n), Qd(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function lw(e, t) {
        const n = (function nk(e, t) {
            const s = new Ba([], {}, {}, "", {}, L, t, null, {});
            return new fw("", new un(s, []));
          })(0, t),
          r = new ct([new Di("", {})]),
          o = new ct({}),
          i = new ct({}),
          s = new ct({}),
          a = new ct(""),
          c = new ro(r, o, s, a, i, L, t, n.root);
        return (c.snapshot = n.root), new uw(new un(c, []), n);
      }
      class ro {
        constructor(t, n, r, o, i, s, a, c) {
          (this.urlSubject = t),
            (this.paramsSubject = n),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = o),
            (this.dataSubject = i),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = c),
            (this.title =
              this.dataSubject?.pipe(ee((u) => u[Ci])) ?? x(void 0)),
            (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(ee((t) => Kr(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(ee((t) => Kr(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function dw(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function rk(e) {
          return e.reduce(
            (t, n) => ({
              params: { ...t.params, ...n.params },
              data: { ...t.data, ...n.data },
              resolve: {
                ...n.data,
                ...t.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class Ba {
        get title() {
          return this.data?.[Ci];
        }
        constructor(t, n, r, o, i, s, a, c, u) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = c),
            (this._resolve = u);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = Kr(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Kr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class fw extends cw {
        constructor(t, n) {
          super(n), (this.url = t), Qd(this, n);
        }
        toString() {
          return hw(this._root);
        }
      }
      function Qd(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => Qd(e, n));
      }
      function hw(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(hw).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function Yd(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            Vt(t.queryParams, n.queryParams) ||
              e.queryParamsSubject.next(n.queryParams),
            t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
            Vt(t.params, n.params) || e.paramsSubject.next(n.params),
            (function C1(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!Vt(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.urlSubject.next(n.url),
            Vt(t.data, n.data) || e.dataSubject.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data);
      }
      function Xd(e, t) {
        const n =
          Vt(e.params, t.params) &&
          (function E1(e, t) {
            return (
              Yn(e, t) && e.every((n, r) => Vt(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || Xd(e.parent, t.parent))
        );
      }
      let pw = (() => {
        class e {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = L),
              (this.activateEvents = new _e()),
              (this.deactivateEvents = new _e()),
              (this.attachEvents = new _e()),
              (this.detachEvents = new _e()),
              (this.parentContexts = _(Si)),
              (this.location = _(Mt)),
              (this.changeDetector = _(Yl)),
              (this.environmentInjector = _(ft)),
              (this.inputBinder = _(Ua, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(n) {
            if (n.name) {
              const { firstChange: r, previousValue: o } = n.name;
              if (r) return;
              this.isTrackedInParentContexts(o) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(o)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const n = this.parentContexts.getContext(this.name);
            n?.route &&
              (n.attachRef
                ? this.attach(n.attachRef, n.route)
                : this.activateWith(n.route, n.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new D(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new D(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new D(4012, !1);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new D(4013, !1);
            this._activatedRoute = n;
            const o = this.location,
              s = n.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              c = new ok(n, a, o.injector);
            (this.activated = o.createComponent(s, {
              index: o.length,
              injector: c,
              environmentInjector: r ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵdir = Pe({
            type: e,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [Yt],
          }));
        }
        return e;
      })();
      class ok {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === ro
            ? this.route
            : t === Si
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      const Ua = new E("");
      let gw = (() => {
        class e {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(n) {
            this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
          }
          unsubscribeFromRouteData(n) {
            this.outletDataSubscriptions.get(n)?.unsubscribe(),
              this.outletDataSubscriptions.delete(n);
          }
          subscribeToRouteData(n) {
            const { activatedRoute: r } = n,
              o = kd([r.queryParams, r.params, r.data])
                .pipe(
                  Ot(
                    ([i, s, a], c) => (
                      (a = { ...i, ...s, ...a }),
                      0 === c ? x(a) : Promise.resolve(a)
                    )
                  )
                )
                .subscribe((i) => {
                  if (
                    !n.isActivated ||
                    !n.activatedComponentRef ||
                    n.activatedRoute !== r ||
                    null === r.component
                  )
                    return void this.unsubscribeFromRouteData(n);
                  const s = (function Yx(e) {
                    const t = U(e);
                    if (!t) return null;
                    const n = new Wo(t);
                    return {
                      get selector() {
                        return n.selector;
                      },
                      get type() {
                        return n.componentType;
                      },
                      get inputs() {
                        return n.inputs;
                      },
                      get outputs() {
                        return n.outputs;
                      },
                      get ngContentSelectors() {
                        return n.ngContentSelectors;
                      },
                      get isStandalone() {
                        return t.standalone;
                      },
                      get isSignal() {
                        return t.signals;
                      },
                    };
                  })(r.component);
                  if (s)
                    for (const { templateName: a } of s.inputs)
                      n.activatedComponentRef.setInput(a, i[a]);
                  else this.unsubscribeFromRouteData(n);
                });
            this.outletDataSubscriptions.set(n, o);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function Ti(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const o = (function sk(e, t, n) {
            return t.children.map((r) => {
              for (const o of n.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return Ti(e, r, o);
              return Ti(e, r);
            });
          })(e, t, n);
          return new un(r, o);
        }
        {
          if (e.shouldAttach(t.value)) {
            const i = e.retrieve(t.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => Ti(e, a))),
                s
              );
            }
          }
          const r = (function ak(e) {
              return new ro(
                new ct(e.url),
                new ct(e.params),
                new ct(e.queryParams),
                new ct(e.fragment),
                new ct(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            o = t.children.map((i) => Ti(e, i));
          return new un(r, o);
        }
      }
      const Jd = "ngNavigationCancelingError";
      function mw(e, t) {
        const { redirectTo: n, navigationBehaviorOptions: r } = Xn(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          o = vw(!1, 0, t);
        return (o.url = n), (o.navigationBehaviorOptions = r), o;
      }
      function vw(e, t, n) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Jd] = !0), (r.cancellationCode = t), n && (r.url = n), r;
      }
      function yw(e) {
        return e && e[Jd];
      }
      let Cw = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵcmp = gn({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [ay],
            decls: 1,
            vars: 0,
            template: function (r, o) {
              1 & r && gt(0, "router-outlet");
            },
            dependencies: [pw],
            encapsulation: 2,
          }));
        }
        return e;
      })();
      function Kd(e) {
        const t = e.children && e.children.map(Kd),
          n = t ? { ...e, children: t } : { ...e };
        return (
          !n.component &&
            !n.loadComponent &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== L &&
            (n.component = Cw),
          n
        );
      }
      function Tt(e) {
        return e.outlet || L;
      }
      function Ai(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const n = t.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class gk {
        constructor(t, n, r, o, i) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o),
            (this.inputBindingEnabled = i);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            Yd(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const o = no(n);
          t.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Object.values(o).forEach((i) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = no(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = no(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const o = no(n);
          t.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new ek(i.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new J1(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if ((Yd(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Yd(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = Ai(o.snapshot);
              (s.attachRef = null),
                (s.route = o),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class Dw {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class za {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function mk(e, t, n) {
        const r = e._root;
        return Oi(r, t ? t._root : null, n, [r.value]);
      }
      function oo(e, t) {
        const n = Symbol(),
          r = t.get(e, n);
        return r === n
          ? "function" != typeof e ||
            (function eE(e) {
              return null !== Vi(e);
            })(e)
            ? t.get(e)
            : e
          : r;
      }
      function Oi(
        e,
        t,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = no(t);
        return (
          e.children.forEach((s) => {
            (function yk(
              e,
              t,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const c = (function Ck(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !Yn(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !Yn(e.url, t.url) || !Vt(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Xd(e, t) || !Vt(e.queryParams, t.queryParams);
                    default:
                      return !Xd(e, t);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                c
                  ? o.canActivateChecks.push(new Dw(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  Oi(e, t, i.component ? (a ? a.children : null) : n, r, o),
                  c &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new za(a.outlet.component, s));
              } else
                s && xi(t, a, o),
                  o.canActivateChecks.push(new Dw(r)),
                  Oi(e, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Object.entries(i).forEach(([s, a]) => xi(a, n.getContext(s), o)),
          o
        );
      }
      function xi(e, t, n) {
        const r = no(e),
          o = e.value;
        Object.entries(r).forEach(([i, s]) => {
          xi(s, o.component ? (t ? t.children.getContext(i) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new za(
              o.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              o
            )
          );
      }
      function Ri(e) {
        return "function" == typeof e;
      }
      function ww(e) {
        return e instanceof ji || "EmptyError" === e?.name;
      }
      const qa = Symbol("INITIAL_VALUE");
      function io() {
        return Ot((e) =>
          kd(
            e.map((t) =>
              t.pipe(
                er(1),
                (function d1(...e) {
                  const t = fo(e);
                  return me((n, r) => {
                    (t ? Fd(e, n, t) : Fd(e, n)).subscribe(r);
                  });
                })(qa)
              )
            )
          ).pipe(
            ee((t) => {
              for (const n of t)
                if (!0 !== n) {
                  if (n === qa) return qa;
                  if (!1 === n || n instanceof eo) return n;
                }
              return !0;
            }),
            hn((t) => t !== qa),
            er(1)
          )
        );
      }
      function _w(e) {
        return (function e_(...e) {
          return pf(e);
        })(
          Ae((t) => {
            if (Xn(t)) throw mw(0, t);
          }),
          ee((t) => !0 === t)
        );
      }
      class Ga {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class Ew {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function so(e) {
        return vi(new Ga(e));
      }
      function bw(e) {
        return vi(new Ew(e));
      }
      class Hk {
        constructor(t, n) {
          (this.urlSerializer = t), (this.urlTree = n);
        }
        noMatchError(t) {
          return new D(4002, !1);
        }
        lineralizeSegments(t, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return x(r);
            if (o.numberOfChildren > 1 || !o.children[L])
              return vi(new D(4e3, !1));
            o = o.children[L];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r
          );
        }
        applyRedirectCreateUrlTree(t, n, r, o) {
          const i = this.createSegmentGroup(t, n.root, r, o);
          return new eo(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Object.entries(t).forEach(([o, i]) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = n[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, o) {
          const i = this.createSegments(t, n.segments, r, o);
          let s = {};
          return (
            Object.entries(n.children).forEach(([a, c]) => {
              s[a] = this.createSegmentGroup(t, c, r, o);
            }),
            new X(i, s)
          );
        }
        createSegments(t, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(t, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(t, n, r) {
          const o = r[n.path.substring(1)];
          if (!o) throw new D(4001, !1);
          return o;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === t.path) return n.splice(r), o;
            r++;
          }
          return t;
        }
      }
      const ef = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function $k(e, t, n, r, o) {
        const i = tf(e, t, n);
        return i.matched
          ? ((r = (function uk(e, t) {
              return (
                e.providers &&
                  !e._injector &&
                  (e._injector = Il(e.providers, t, `Route: ${e.path}`)),
                e._injector ?? t
              );
            })(t, r)),
            (function Fk(e, t, n, r) {
              const o = t.canMatch;
              return o && 0 !== o.length
                ? x(
                    o.map((s) => {
                      const a = oo(s, e);
                      return An(
                        (function Mk(e) {
                          return e && Ri(e.canMatch);
                        })(a)
                          ? a.canMatch(t, n)
                          : e.runInContext(() => a(t, n))
                      );
                    })
                  ).pipe(io(), _w())
                : x(!0);
            })(r, t, n).pipe(ee((s) => (!0 === s ? i : { ...ef }))))
          : x(i);
      }
      function tf(e, t, n) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? { ...ef }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (t.matcher || y1)(n, e, t);
        if (!o) return { ...ef };
        const i = {};
        Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
          i[a] = c.path;
        });
        const s =
          o.consumed.length > 0
            ? { ...i, ...o.consumed[o.consumed.length - 1].parameters }
            : i;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: n.slice(o.consumed.length),
          parameters: s,
          positionalParamSegments: o.posParams ?? {},
        };
      }
      function Mw(e, t, n, r) {
        return n.length > 0 &&
          (function Uk(e, t, n) {
            return n.some((r) => Wa(e, t, r) && Tt(r) !== L);
          })(e, n, r)
          ? {
              segmentGroup: new X(t, Bk(r, new X(n, e.children))),
              slicedSegments: [],
            }
          : 0 === n.length &&
            (function zk(e, t, n) {
              return n.some((r) => Wa(e, t, r));
            })(e, n, r)
          ? {
              segmentGroup: new X(e.segments, Vk(e, 0, n, r, e.children)),
              slicedSegments: n,
            }
          : { segmentGroup: new X(e.segments, e.children), slicedSegments: n };
      }
      function Vk(e, t, n, r, o) {
        const i = {};
        for (const s of r)
          if (Wa(e, n, s) && !o[Tt(s)]) {
            const a = new X([], {});
            i[Tt(s)] = a;
          }
        return { ...o, ...i };
      }
      function Bk(e, t) {
        const n = {};
        n[L] = t;
        for (const r of e)
          if ("" === r.path && Tt(r) !== L) {
            const o = new X([], {});
            n[Tt(r)] = o;
          }
        return n;
      }
      function Wa(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      class Zk {
        constructor(t, n, r, o, i, s, a) {
          (this.injector = t),
            (this.configLoader = n),
            (this.rootComponentType = r),
            (this.config = o),
            (this.urlTree = i),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new Hk(this.urlSerializer, this.urlTree));
        }
        noMatchError(t) {
          return new D(4002, !1);
        }
        recognize() {
          const t = Mw(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            L
          ).pipe(
            Qn((n) => {
              if (n instanceof Ew)
                return (
                  (this.allowRedirects = !1),
                  (this.urlTree = n.urlTree),
                  this.match(n.urlTree)
                );
              throw n instanceof Ga ? this.noMatchError(n) : n;
            }),
            ee((n) => {
              const r = new Ba(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  L,
                  this.rootComponentType,
                  null,
                  {}
                ),
                o = new un(r, n),
                i = new fw("", o),
                s = (function j1(e, t, n = null, r = null) {
                  return ew(KD(e), t, n, r);
                })(r, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (s.queryParams = this.urlTree.queryParams),
                (i.url = this.urlSerializer.serialize(s)),
                this.inheritParamsAndData(i._root),
                { state: i, tree: s }
              );
            })
          );
        }
        match(t) {
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t.root,
            L
          ).pipe(
            Qn((r) => {
              throw r instanceof Ga ? this.noMatchError(r) : r;
            })
          );
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = dw(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, n, r)
            : this.processSegment(t, n, r, r.segments, o, !0);
        }
        processChildren(t, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return be(o).pipe(
            yi((i) => {
              const s = r.children[i],
                a = (function hk(e, t) {
                  const n = e.filter((r) => Tt(r) === t);
                  return n.push(...e.filter((r) => Tt(r) !== t)), n;
                })(n, i);
              return this.processSegmentGroup(t, a, s, i);
            }),
            (function h1(e, t) {
              return me(
                (function f1(e, t, n, r, o) {
                  return (i, s) => {
                    let a = n,
                      c = t,
                      u = 0;
                    i.subscribe(
                      ve(
                        s,
                        (l) => {
                          const d = u++;
                          (c = a ? e(c, l, d) : ((a = !0), l)), r && s.next(c);
                        },
                        o &&
                          (() => {
                            a && s.next(c), s.complete();
                          })
                      )
                    );
                  };
                })(e, t, arguments.length >= 2, !0)
              );
            })((i, s) => (i.push(...s), i)),
            Hi(null),
            (function p1(e, t) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  e ? hn((o, i) => e(o, i, r)) : dn,
                  jd(1),
                  n ? Hi(t) : Ff(() => new ji())
                );
            })(),
            Ee((i) => {
              if (null === i) return so(r);
              const s = Iw(i);
              return (
                (function Qk(e) {
                  e.sort((t, n) =>
                    t.value.outlet === L
                      ? -1
                      : n.value.outlet === L
                      ? 1
                      : t.value.outlet.localeCompare(n.value.outlet)
                  );
                })(s),
                x(s)
              );
            })
          );
        }
        processSegment(t, n, r, o, i, s) {
          return be(n).pipe(
            yi((a) =>
              this.processSegmentAgainstRoute(
                a._injector ?? t,
                n,
                a,
                r,
                o,
                i,
                s
              ).pipe(
                Qn((c) => {
                  if (c instanceof Ga) return x(null);
                  throw c;
                })
              )
            ),
            qt((a) => !!a),
            Qn((a) => {
              if (ww(a))
                return (function Gk(e, t, n) {
                  return 0 === t.length && !e.children[n];
                })(r, o, i)
                  ? x([])
                  : so(r);
              throw a;
            })
          );
        }
        processSegmentAgainstRoute(t, n, r, o, i, s, a) {
          return (function qk(e, t, n, r) {
            return (
              !!(Tt(e) === r || (r !== L && Wa(t, n, e))) &&
              ("**" === e.path || tf(t, e, n).matched)
            );
          })(r, o, i, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(t, o, r, i, s, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s)
              : so(o)
            : so(o);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
          const i = this.applyRedirects.applyRedirectCommands(
            [],
            r.redirectTo,
            {}
          );
          return r.redirectTo.startsWith("/")
            ? bw(i)
            : this.applyRedirects.lineralizeSegments(r, i).pipe(
                Ee((s) => {
                  const a = new X(s, {});
                  return this.processSegment(t, n, a, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: c,
            remainingSegments: u,
            positionalParamSegments: l,
          } = tf(n, o, i);
          if (!a) return so(n);
          const d = this.applyRedirects.applyRedirectCommands(
            c,
            o.redirectTo,
            l
          );
          return o.redirectTo.startsWith("/")
            ? bw(d)
            : this.applyRedirects
                .lineralizeSegments(o, d)
                .pipe(
                  Ee((f) => this.processSegment(t, r, n, f.concat(u), s, !1))
                );
        }
        matchSegmentAgainstRoute(t, n, r, o, i, s) {
          let a;
          if ("**" === r.path) {
            const c = o.length > 0 ? BD(o).parameters : {};
            (a = x({
              snapshot: new Ba(
                o,
                c,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                Sw(r),
                Tt(r),
                r.component ?? r._loadedComponent ?? null,
                r,
                Tw(r)
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (n.children = {});
          } else
            a = $k(n, r, o, t).pipe(
              ee(
                ({
                  matched: c,
                  consumedSegments: u,
                  remainingSegments: l,
                  parameters: d,
                }) =>
                  c
                    ? {
                        snapshot: new Ba(
                          u,
                          d,
                          Object.freeze({ ...this.urlTree.queryParams }),
                          this.urlTree.fragment,
                          Sw(r),
                          Tt(r),
                          r.component ?? r._loadedComponent ?? null,
                          r,
                          Tw(r)
                        ),
                        consumedSegments: u,
                        remainingSegments: l,
                      }
                    : null
              )
            );
          return a.pipe(
            Ot((c) =>
              null === c
                ? so(n)
                : this.getChildConfig((t = r._injector ?? t), r, o).pipe(
                    Ot(({ routes: u }) => {
                      const l = r._loadedInjector ?? t,
                        {
                          snapshot: d,
                          consumedSegments: f,
                          remainingSegments: h,
                        } = c,
                        { segmentGroup: p, slicedSegments: g } = Mw(n, f, h, u);
                      if (0 === g.length && p.hasChildren())
                        return this.processChildren(l, u, p).pipe(
                          ee((C) => (null === C ? null : [new un(d, C)]))
                        );
                      if (0 === u.length && 0 === g.length)
                        return x([new un(d, [])]);
                      const v = Tt(r) === i;
                      return this.processSegment(
                        l,
                        u,
                        p,
                        g,
                        v ? L : i,
                        !0
                      ).pipe(ee((C) => [new un(d, C)]));
                    })
                  )
            )
          );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? x({ routes: n.children, injector: t })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? x({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function kk(e, t, n, r) {
                  const o = t.canLoad;
                  return void 0 === o || 0 === o.length
                    ? x(!0)
                    : x(
                        o.map((s) => {
                          const a = oo(s, e);
                          return An(
                            (function wk(e) {
                              return e && Ri(e.canLoad);
                            })(a)
                              ? a.canLoad(t, n)
                              : e.runInContext(() => a(t, n))
                          );
                        })
                      ).pipe(io(), _w());
                })(t, n, r).pipe(
                  Ee((o) =>
                    o
                      ? this.configLoader.loadChildren(t, n).pipe(
                          Ae((i) => {
                            (n._loadedRoutes = i.routes),
                              (n._loadedInjector = i.injector);
                          })
                        )
                      : (function jk(e) {
                          return vi(vw(!1, 3));
                        })()
                  )
                )
            : x({ routes: [], injector: t });
        }
      }
      function Yk(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path;
      }
      function Iw(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!Yk(r)) {
            t.push(r);
            continue;
          }
          const o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r);
        }
        for (const r of n) {
          const o = Iw(r.children);
          t.push(new un(r.value, o));
        }
        return t.filter((r) => !n.has(r));
      }
      function Sw(e) {
        return e.data || {};
      }
      function Tw(e) {
        return e.resolve || {};
      }
      function Aw(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function nf(e) {
        return Ot((t) => {
          const n = e(t);
          return n ? be(n).pipe(ee(() => t)) : x(t);
        });
      }
      const ao = new E("ROUTES");
      let rf = (() => {
        class e {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = _(Ky));
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return x(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = An(n.loadComponent()).pipe(
                ee(Ow),
                Ae((i) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = i);
                }),
                Hd(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              o = new $D(r, () => new st()).pipe(Ld());
            return this.componentLoaders.set(n, o), o;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return x({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const i = (function rF(e, t, n, r) {
                return An(e.loadChildren()).pipe(
                  ee(Ow),
                  Ee((o) =>
                    o instanceof iy || Array.isArray(o)
                      ? x(o)
                      : be(t.compileModuleAsync(o))
                  ),
                  ee((o) => {
                    r && r(e);
                    let i,
                      s,
                      a = !1;
                    return (
                      Array.isArray(o)
                        ? ((s = o), !0)
                        : ((i = o.create(n).injector),
                          (s = i
                            .get(ao, [], { optional: !0, self: !0 })
                            .flat())),
                      { routes: s.map(Kd), injector: i }
                    );
                  })
                );
              })(r, this.compiler, n, this.onLoadEndListener).pipe(
                Hd(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new $D(i, () => new st()).pipe(Ld());
            return this.childrenLoaders.set(r, s), s;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function Ow(e) {
        return (function oF(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let Za = (() => {
        class e {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.currentTransition = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new st()),
              (this.transitionAbortSubject = new st()),
              (this.configLoader = _(rf)),
              (this.environmentInjector = _(ft)),
              (this.urlSerializer = _(wi)),
              (this.rootContexts = _(Si)),
              (this.inputBindingEnabled = null !== _(Ua, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => x(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (o) =>
                this.events.next(new Y1(o))),
              (this.configLoader.onLoadStartListener = (o) =>
                this.events.next(new Q1(o)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(n) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...n, id: r });
          }
          setupNavigations(n, r, o) {
            return (
              (this.transitions = new ct({
                id: 0,
                currentUrlTree: r,
                currentRawUrl: r,
                currentBrowserUrl: r,
                extractedUrl: n.urlHandlingStrategy.extract(r),
                urlAfterRedirects: n.urlHandlingStrategy.extract(r),
                rawUrl: r,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Mi,
                restoredState: null,
                currentSnapshot: o.snapshot,
                targetSnapshot: null,
                currentRouterState: o,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                hn((i) => 0 !== i.id),
                ee((i) => ({
                  ...i,
                  extractedUrl: n.urlHandlingStrategy.extract(i.rawUrl),
                })),
                Ot((i) => {
                  this.currentTransition = i;
                  let s = !1,
                    a = !1;
                  return x(i).pipe(
                    Ae((c) => {
                      this.currentNavigation = {
                        id: c.id,
                        initialUrl: c.rawUrl,
                        extractedUrl: c.extractedUrl,
                        trigger: c.source,
                        extras: c.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    Ot((c) => {
                      const u = c.currentBrowserUrl.toString(),
                        l =
                          !n.navigated ||
                          c.extractedUrl.toString() !== u ||
                          u !== c.currentUrlTree.toString();
                      if (
                        !l &&
                        "reload" !==
                          (c.extras.onSameUrlNavigation ??
                            n.onSameUrlNavigation)
                      ) {
                        const f = "";
                        return (
                          this.events.next(
                            new to(
                              c.id,
                              this.urlSerializer.serialize(c.rawUrl),
                              f,
                              0
                            )
                          ),
                          c.resolve(null),
                          At
                        );
                      }
                      if (n.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                        return x(c).pipe(
                          Ot((f) => {
                            const h = this.transitions?.getValue();
                            return (
                              this.events.next(
                                new $a(
                                  f.id,
                                  this.urlSerializer.serialize(f.extractedUrl),
                                  f.source,
                                  f.restoredState
                                )
                              ),
                              h !== this.transitions?.getValue()
                                ? At
                                : Promise.resolve(f)
                            );
                          }),
                          (function Xk(e, t, n, r, o, i) {
                            return Ee((s) =>
                              (function Wk(e, t, n, r, o, i, s = "emptyOnly") {
                                return new Zk(e, t, n, r, o, s, i).recognize();
                              })(e, t, n, r, s.extractedUrl, o, i).pipe(
                                ee(({ state: a, tree: c }) => ({
                                  ...s,
                                  targetSnapshot: a,
                                  urlAfterRedirects: c,
                                }))
                              )
                            );
                          })(
                            this.environmentInjector,
                            this.configLoader,
                            this.rootComponentType,
                            n.config,
                            this.urlSerializer,
                            n.paramsInheritanceStrategy
                          ),
                          Ae((f) => {
                            (i.targetSnapshot = f.targetSnapshot),
                              (i.urlAfterRedirects = f.urlAfterRedirects),
                              (this.currentNavigation = {
                                ...this.currentNavigation,
                                finalUrl: f.urlAfterRedirects,
                              });
                            const h = new sw(
                              f.id,
                              this.urlSerializer.serialize(f.extractedUrl),
                              this.urlSerializer.serialize(f.urlAfterRedirects),
                              f.targetSnapshot
                            );
                            this.events.next(h);
                          })
                        );
                      if (
                        l &&
                        n.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                      ) {
                        const {
                            id: f,
                            extractedUrl: h,
                            source: p,
                            restoredState: g,
                            extras: v,
                          } = c,
                          C = new $a(f, this.urlSerializer.serialize(h), p, g);
                        this.events.next(C);
                        const m = lw(0, this.rootComponentType).snapshot;
                        return (
                          (this.currentTransition = i =
                            {
                              ...c,
                              targetSnapshot: m,
                              urlAfterRedirects: h,
                              extras: {
                                ...v,
                                skipLocationChange: !1,
                                replaceUrl: !1,
                              },
                            }),
                          x(i)
                        );
                      }
                      {
                        const f = "";
                        return (
                          this.events.next(
                            new to(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              f,
                              1
                            )
                          ),
                          c.resolve(null),
                          At
                        );
                      }
                    }),
                    Ae((c) => {
                      const u = new q1(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects),
                        c.targetSnapshot
                      );
                      this.events.next(u);
                    }),
                    ee(
                      (c) => (
                        (this.currentTransition = i =
                          {
                            ...c,
                            guards: mk(
                              c.targetSnapshot,
                              c.currentSnapshot,
                              this.rootContexts
                            ),
                          }),
                        i
                      )
                    ),
                    (function Sk(e, t) {
                      return Ee((n) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: o,
                          guards: {
                            canActivateChecks: i,
                            canDeactivateChecks: s,
                          },
                        } = n;
                        return 0 === s.length && 0 === i.length
                          ? x({ ...n, guardsResult: !0 })
                          : (function Tk(e, t, n, r) {
                              return be(e).pipe(
                                Ee((o) =>
                                  (function Pk(e, t, n, r, o) {
                                    const i =
                                      t && t.routeConfig
                                        ? t.routeConfig.canDeactivate
                                        : null;
                                    return i && 0 !== i.length
                                      ? x(
                                          i.map((a) => {
                                            const c = Ai(t) ?? o,
                                              u = oo(a, c);
                                            return An(
                                              (function bk(e) {
                                                return e && Ri(e.canDeactivate);
                                              })(u)
                                                ? u.canDeactivate(e, t, n, r)
                                                : c.runInContext(() =>
                                                    u(e, t, n, r)
                                                  )
                                            ).pipe(qt());
                                          })
                                        ).pipe(io())
                                      : x(!0);
                                  })(o.component, o.route, n, t, r)
                                ),
                                qt((o) => !0 !== o, !0)
                              );
                            })(s, r, o, e).pipe(
                              Ee((a) =>
                                a &&
                                (function Dk(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function Ak(e, t, n, r) {
                                      return be(t).pipe(
                                        yi((o) =>
                                          Fd(
                                            (function xk(e, t) {
                                              return (
                                                null !== e && t && t(new X1(e)),
                                                x(!0)
                                              );
                                            })(o.route.parent, r),
                                            (function Ok(e, t) {
                                              return (
                                                null !== e && t && t(new K1(e)),
                                                x(!0)
                                              );
                                            })(o.route, r),
                                            (function Nk(e, t, n) {
                                              const r = t[t.length - 1],
                                                i = t
                                                  .slice(0, t.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function vk(e) {
                                                      const t = e.routeConfig
                                                        ? e.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return t && 0 !== t.length
                                                        ? { node: e, guards: t }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    HD(() =>
                                                      x(
                                                        s.guards.map((c) => {
                                                          const u =
                                                              Ai(s.node) ?? n,
                                                            l = oo(c, u);
                                                          return An(
                                                            (function Ek(e) {
                                                              return (
                                                                e &&
                                                                Ri(
                                                                  e.canActivateChild
                                                                )
                                                              );
                                                            })(l)
                                                              ? l.canActivateChild(
                                                                  r,
                                                                  e
                                                                )
                                                              : u.runInContext(
                                                                  () => l(r, e)
                                                                )
                                                          ).pipe(qt());
                                                        })
                                                      ).pipe(io())
                                                    )
                                                  );
                                              return x(i).pipe(io());
                                            })(e, o.path, n),
                                            (function Rk(e, t, n) {
                                              const r = t.routeConfig
                                                ? t.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return x(!0);
                                              const o = r.map((i) =>
                                                HD(() => {
                                                  const s = Ai(t) ?? n,
                                                    a = oo(i, s);
                                                  return An(
                                                    (function _k(e) {
                                                      return (
                                                        e && Ri(e.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(t, e)
                                                      : s.runInContext(() =>
                                                          a(t, e)
                                                        )
                                                  ).pipe(qt());
                                                })
                                              );
                                              return x(o).pipe(io());
                                            })(e, o.route, n)
                                          )
                                        ),
                                        qt((o) => !0 !== o, !0)
                                      );
                                    })(r, i, e, t)
                                  : x(a)
                              ),
                              ee((a) => ({ ...n, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (c) => this.events.next(c)),
                    Ae((c) => {
                      if (
                        ((i.guardsResult = c.guardsResult), Xn(c.guardsResult))
                      )
                        throw mw(0, c.guardsResult);
                      const u = new G1(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects),
                        c.targetSnapshot,
                        !!c.guardsResult
                      );
                      this.events.next(u);
                    }),
                    hn(
                      (c) =>
                        !!c.guardsResult ||
                        (this.cancelNavigationTransition(c, "", 3), !1)
                    ),
                    nf((c) => {
                      if (c.guards.canActivateChecks.length)
                        return x(c).pipe(
                          Ae((u) => {
                            const l = new W1(
                              u.id,
                              this.urlSerializer.serialize(u.extractedUrl),
                              this.urlSerializer.serialize(u.urlAfterRedirects),
                              u.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          Ot((u) => {
                            let l = !1;
                            return x(u).pipe(
                              (function Jk(e, t) {
                                return Ee((n) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: o },
                                  } = n;
                                  if (!o.length) return x(n);
                                  let i = 0;
                                  return be(o).pipe(
                                    yi((s) =>
                                      (function Kk(e, t, n, r) {
                                        const o = e.routeConfig,
                                          i = e._resolve;
                                        return (
                                          void 0 !== o?.title &&
                                            !Aw(o) &&
                                            (i[Ci] = o.title),
                                          (function eF(e, t, n, r) {
                                            const o = (function tF(e) {
                                              return [
                                                ...Object.keys(e),
                                                ...Object.getOwnPropertySymbols(
                                                  e
                                                ),
                                              ];
                                            })(e);
                                            if (0 === o.length) return x({});
                                            const i = {};
                                            return be(o).pipe(
                                              Ee((s) =>
                                                (function nF(e, t, n, r) {
                                                  const o = Ai(t) ?? r,
                                                    i = oo(e, o);
                                                  return An(
                                                    i.resolve
                                                      ? i.resolve(t, n)
                                                      : o.runInContext(() =>
                                                          i(t, n)
                                                        )
                                                  );
                                                })(e[s], t, n, r).pipe(
                                                  qt(),
                                                  Ae((a) => {
                                                    i[s] = a;
                                                  })
                                                )
                                              ),
                                              jd(1),
                                              (function g1(e) {
                                                return ee(() => e);
                                              })(i),
                                              Qn((s) => (ww(s) ? At : vi(s)))
                                            );
                                          })(i, e, t, r).pipe(
                                            ee(
                                              (s) => (
                                                (e._resolvedData = s),
                                                (e.data = dw(e, n).resolve),
                                                o &&
                                                  Aw(o) &&
                                                  (e.data[Ci] = o.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, e, t)
                                    ),
                                    Ae(() => i++),
                                    jd(1),
                                    Ee((s) => (i === o.length ? x(n) : At))
                                  );
                                });
                              })(
                                n.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              Ae({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    this.cancelNavigationTransition(u, "", 2);
                                },
                              })
                            );
                          }),
                          Ae((u) => {
                            const l = new Z1(
                              u.id,
                              this.urlSerializer.serialize(u.extractedUrl),
                              this.urlSerializer.serialize(u.urlAfterRedirects),
                              u.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    nf((c) => {
                      const u = (l) => {
                        const d = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          d.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              Ae((f) => {
                                l.component = f;
                              }),
                              ee(() => {})
                            )
                          );
                        for (const f of l.children) d.push(...u(f));
                        return d;
                      };
                      return kd(u(c.targetSnapshot.root)).pipe(Hi(), er(1));
                    }),
                    nf(() => this.afterPreactivation()),
                    ee((c) => {
                      const u = (function ik(e, t, n) {
                        const r = Ti(e, t._root, n ? n._root : void 0);
                        return new uw(r, t);
                      })(
                        n.routeReuseStrategy,
                        c.targetSnapshot,
                        c.currentRouterState
                      );
                      return (
                        (this.currentTransition = i =
                          { ...c, targetRouterState: u }),
                        i
                      );
                    }),
                    Ae(() => {
                      this.events.next(new qd());
                    }),
                    ((e, t, n, r) =>
                      ee(
                        (o) => (
                          new gk(
                            t,
                            o.targetRouterState,
                            o.currentRouterState,
                            n,
                            r
                          ).activate(e),
                          o
                        )
                      ))(
                      this.rootContexts,
                      n.routeReuseStrategy,
                      (c) => this.events.next(c),
                      this.inputBindingEnabled
                    ),
                    er(1),
                    Ae({
                      next: (c) => {
                        (s = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          this.events.next(
                            new On(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              this.urlSerializer.serialize(c.urlAfterRedirects)
                            )
                          ),
                          n.titleStrategy?.updateTitle(
                            c.targetRouterState.snapshot
                          ),
                          c.resolve(!0);
                      },
                      complete: () => {
                        s = !0;
                      },
                    }),
                    (function m1(e) {
                      return me((t, n) => {
                        at(e).subscribe(ve(n, () => n.complete(), Ya)),
                          !n.closed && t.subscribe(n);
                      });
                    })(
                      this.transitionAbortSubject.pipe(
                        Ae((c) => {
                          throw c;
                        })
                      )
                    ),
                    Hd(() => {
                      s || a || this.cancelNavigationTransition(i, "", 1),
                        this.currentNavigation?.id === i.id &&
                          (this.currentNavigation = null);
                    }),
                    Qn((c) => {
                      if (((a = !0), yw(c)))
                        this.events.next(
                          new Ii(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            c.message,
                            c.cancellationCode
                          )
                        ),
                          (function ck(e) {
                            return yw(e) && Xn(e.url);
                          })(c)
                            ? this.events.next(new Gd(c.url))
                            : i.resolve(!1);
                      else {
                        this.events.next(
                          new Va(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            c,
                            i.targetSnapshot ?? void 0
                          )
                        );
                        try {
                          i.resolve(n.errorHandler(c));
                        } catch (u) {
                          i.reject(u);
                        }
                      }
                      return At;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(n, r, o) {
            const i = new Ii(
              n.id,
              this.urlSerializer.serialize(n.extractedUrl),
              r,
              o
            );
            this.events.next(i), n.resolve(!1);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function xw(e) {
        return e !== Mi;
      }
      let Rw = (() => {
          class e {
            buildTitle(n) {
              let r,
                o = n.root;
              for (; void 0 !== o; )
                (r = this.getResolvedTitleForRoute(o) ?? r),
                  (o = o.children.find((i) => i.outlet === L));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Ci];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: function () {
                return _(iF);
              },
              providedIn: "root",
            }));
          }
          return e;
        })(),
        iF = (() => {
          class e extends Rw {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(PD));
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        sF = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: function () {
                return _(cF);
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      class aF {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      }
      let cF = (() => {
        class e extends aF {
          static #e = (this.ɵfac = (function () {
            let n;
            return function (o) {
              return (
                n ||
                (n = (function sp(e) {
                  return Wt(() => {
                    const t = e.prototype.constructor,
                      n = t[Zt] || Wc(t),
                      r = Object.prototype;
                    let o = Object.getPrototypeOf(e.prototype).constructor;
                    for (; o && o !== r; ) {
                      const i = o[Zt] || Wc(o);
                      if (i && i !== n) return i;
                      o = Object.getPrototypeOf(o);
                    }
                    return (i) => new i();
                  });
                })(e))
              )(o || e);
            };
          })());
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const Qa = new E("", { providedIn: "root", factory: () => ({}) });
      let uF = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: function () {
                return _(lF);
              },
              providedIn: "root",
            }));
          }
          return e;
        })(),
        lF = (() => {
          class e {
            shouldProcessUrl(n) {
              return !0;
            }
            extract(n) {
              return n;
            }
            merge(n, r) {
              return n;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = I({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })();
      var Ni = (function (e) {
        return (
          (e[(e.COMPLETE = 0)] = "COMPLETE"),
          (e[(e.FAILED = 1)] = "FAILED"),
          (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
          e
        );
      })(Ni || {});
      function Nw(e, t) {
        e.events
          .pipe(
            hn(
              (n) =>
                n instanceof On ||
                n instanceof Ii ||
                n instanceof Va ||
                n instanceof to
            ),
            ee((n) =>
              n instanceof On || n instanceof to
                ? Ni.COMPLETE
                : n instanceof Ii && (0 === n.code || 1 === n.code)
                ? Ni.REDIRECTING
                : Ni.FAILED
            ),
            hn((n) => n !== Ni.REDIRECTING),
            er(1)
          )
          .subscribe(() => {
            t();
          });
      }
      function dF(e) {
        throw e;
      }
      function fF(e, t, n) {
        return t.parse("/");
      }
      const hF = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        pF = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let yt = (() => {
        class e {
          get navigationId() {
            return this.navigationTransitions.navigationId;
          }
          get browserPageId() {
            return "computed" !== this.canceledNavigationResolution
              ? this.currentPageId
              : this.location.getState()?.ɵrouterPageId ?? this.currentPageId;
          }
          get events() {
            return this._events;
          }
          constructor() {
            (this.disposed = !1),
              (this.currentPageId = 0),
              (this.console = _(Bl)),
              (this.isNgZoneEnabled = !1),
              (this._events = new st()),
              (this.options = _(Qa, { optional: !0 }) || {}),
              (this.pendingTasks = _(Jy)),
              (this.errorHandler = this.options.errorHandler || dF),
              (this.malformedUriErrorHandler =
                this.options.malformedUriErrorHandler || fF),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.urlHandlingStrategy = _(uF)),
              (this.routeReuseStrategy = _(sF)),
              (this.titleStrategy = _(Rw)),
              (this.onSameUrlNavigation =
                this.options.onSameUrlNavigation || "ignore"),
              (this.paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly"),
              (this.urlUpdateStrategy =
                this.options.urlUpdateStrategy || "deferred"),
              (this.canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace"),
              (this.config = _(ao, { optional: !0 })?.flat() ?? []),
              (this.navigationTransitions = _(Za)),
              (this.urlSerializer = _(wi)),
              (this.location = _(sd)),
              (this.componentInputBindingEnabled = !!_(Ua, { optional: !0 })),
              (this.eventsSubscription = new Ye()),
              (this.isNgZoneEnabled = _(Y) instanceof Y && Y.isInAngularZone()),
              this.resetConfig(this.config),
              (this.currentUrlTree = new eo()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = lw(0, null)),
              this.navigationTransitions
                .setupNavigations(this, this.currentUrlTree, this.routerState)
                .subscribe(
                  (n) => {
                    (this.lastSuccessfulId = n.id),
                      (this.currentPageId = this.browserPageId);
                  },
                  (n) => {
                    this.console.warn(`Unhandled Navigation Error: ${n}`);
                  }
                ),
              this.subscribeToNavigationEvents();
          }
          subscribeToNavigationEvents() {
            const n = this.navigationTransitions.events.subscribe((r) => {
              try {
                const { currentTransition: o } = this.navigationTransitions;
                if (null === o) return void (Pw(r) && this._events.next(r));
                if (r instanceof $a)
                  xw(o.source) && (this.browserUrlTree = o.extractedUrl);
                else if (r instanceof to) this.rawUrlTree = o.rawUrl;
                else if (r instanceof sw) {
                  if ("eager" === this.urlUpdateStrategy) {
                    if (!o.extras.skipLocationChange) {
                      const i = this.urlHandlingStrategy.merge(
                        o.urlAfterRedirects,
                        o.rawUrl
                      );
                      this.setBrowserUrl(i, o);
                    }
                    this.browserUrlTree = o.urlAfterRedirects;
                  }
                } else if (r instanceof qd)
                  (this.currentUrlTree = o.urlAfterRedirects),
                    (this.rawUrlTree = this.urlHandlingStrategy.merge(
                      o.urlAfterRedirects,
                      o.rawUrl
                    )),
                    (this.routerState = o.targetRouterState),
                    "deferred" === this.urlUpdateStrategy &&
                      (o.extras.skipLocationChange ||
                        this.setBrowserUrl(this.rawUrlTree, o),
                      (this.browserUrlTree = o.urlAfterRedirects));
                else if (r instanceof Ii)
                  0 !== r.code && 1 !== r.code && (this.navigated = !0),
                    (3 === r.code || 2 === r.code) && this.restoreHistory(o);
                else if (r instanceof Gd) {
                  const i = this.urlHandlingStrategy.merge(
                      r.url,
                      o.currentRawUrl
                    ),
                    s = {
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        "eager" === this.urlUpdateStrategy || xw(o.source),
                    };
                  this.scheduleNavigation(i, Mi, null, s, {
                    resolve: o.resolve,
                    reject: o.reject,
                    promise: o.promise,
                  });
                }
                r instanceof Va && this.restoreHistory(o, !0),
                  r instanceof On && (this.navigated = !0),
                  Pw(r) && this._events.next(r);
              } catch (o) {
                this.navigationTransitions.transitionAbortSubject.next(o);
              }
            });
            this.eventsSubscription.add(n);
          }
          resetRootComponentType(n) {
            (this.routerState.root.component = n),
              (this.navigationTransitions.rootComponentType = n);
          }
          initialNavigation() {
            if (
              (this.setUpLocationChangeListener(),
              !this.navigationTransitions.hasRequestedNavigation)
            ) {
              const n = this.location.getState();
              this.navigateToSyncWithBrowser(this.location.path(!0), Mi, n);
            }
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    this.navigateToSyncWithBrowser(n.url, r, n.state);
                  }, 0);
              }));
          }
          navigateToSyncWithBrowser(n, r, o) {
            const i = { replaceUrl: !0 },
              s = o?.navigationId ? o : null;
            if (o) {
              const c = { ...o };
              delete c.navigationId,
                delete c.ɵrouterPageId,
                0 !== Object.keys(c).length && (i.state = c);
            }
            const a = this.parseUrl(n);
            this.scheduleNavigation(a, r, s, i);
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation;
          }
          get lastSuccessfulNavigation() {
            return this.navigationTransitions.lastSuccessfulNavigation;
          }
          resetConfig(n) {
            (this.config = n.map(Kd)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.navigationTransitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0),
              this.eventsSubscription.unsubscribe();
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: c,
              } = r,
              u = c ? this.currentUrlTree.fragment : s;
            let d,
              l = null;
            switch (a) {
              case "merge":
                l = { ...this.currentUrlTree.queryParams, ...i };
                break;
              case "preserve":
                l = this.currentUrlTree.queryParams;
                break;
              default:
                l = i || null;
            }
            null !== l && (l = this.removeEmptyProps(l));
            try {
              d = KD(o ? o.snapshot : this.routerState.snapshot.root);
            } catch {
              ("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []),
                (d = this.currentUrlTree.root);
            }
            return ew(d, n, l, u ?? null);
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const o = Xn(n) ? n : this.parseUrl(n),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, Mi, null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function gF(e) {
                for (let t = 0; t < e.length; t++)
                  if (null == e[t]) throw new D(4008, !1);
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let o;
            if (((o = !0 === r ? { ...hF } : !1 === r ? { ...pF } : r), Xn(n)))
              return zD(this.currentUrlTree, n, o);
            const i = this.parseUrl(n);
            return zD(this.currentUrlTree, i, o);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, o) => {
              const i = n[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          scheduleNavigation(n, r, o, i, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, c, u;
            s
              ? ((a = s.resolve), (c = s.reject), (u = s.promise))
              : (u = new Promise((d, f) => {
                  (a = d), (c = f);
                }));
            const l = this.pendingTasks.add();
            return (
              Nw(this, () => {
                queueMicrotask(() => this.pendingTasks.remove(l));
              }),
              this.navigationTransitions.handleNavigationRequest({
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                currentBrowserUrl: this.browserUrlTree,
                rawUrl: n,
                extras: i,
                resolve: a,
                reject: c,
                promise: u,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              u.catch((d) => Promise.reject(d))
            );
          }
          setBrowserUrl(n, r) {
            const o = this.urlSerializer.serialize(n);
            if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
              const s = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, this.browserPageId),
              };
              this.location.replaceState(o, "", s);
            } else {
              const i = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, this.browserPageId + 1),
              };
              this.location.go(o, "", i);
            }
          }
          restoreHistory(n, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const i = this.currentPageId - this.browserPageId;
              0 !== i
                ? this.location.historyGo(i)
                : this.currentUrlTree ===
                    this.getCurrentNavigation()?.finalUrl &&
                  0 === i &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree());
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function Pw(e) {
        return !(e instanceof qd || e instanceof Gd);
      }
      class kw {}
      let yF = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.router = n),
              (this.injector = o),
              (this.preloadingStrategy = i),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                hn((n) => n instanceof On),
                yi(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const o = [];
            for (const i of r) {
              i.providers &&
                !i._injector &&
                (i._injector = Il(i.providers, n, `Route: ${i.path}`));
              const s = i._injector ?? n,
                a = i._loadedInjector ?? s;
              ((i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
                (i.loadComponent && !i._loadedComponent)) &&
                o.push(this.preloadConfig(s, i)),
                (i.children || i._loadedRoutes) &&
                  o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
            }
            return be(o).pipe(Kn());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let o;
              o =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : x(null);
              const i = o.pipe(
                Ee((s) =>
                  null === s
                    ? x(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? be([i, this.loader.loadComponent(r)]).pipe(Kn())
                : i;
            });
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(yt), M(Ky), M(ft), M(kw), M(rf));
          });
          static #t = (this.ɵprov = I({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const af = new E("");
      let Fw = (() => {
        class e {
          constructor(n, r, o, i, s = {}) {
            (this.urlSerializer = n),
              (this.transitions = r),
              (this.viewportScroller = o),
              (this.zone = i),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof $a
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof On
                ? ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.urlAfterRedirects).fragment
                  ))
                : n instanceof to &&
                  0 === n.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.url).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof aw &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new aw(
                      n,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
          static #e = (this.ɵfac = function (r) {
            !(function qg() {
              throw new Error("invalid");
            })();
          });
          static #t = (this.ɵprov = I({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function ln(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function jw() {
        const e = _(ht);
        return (t) => {
          const n = e.get(zn);
          if (t !== n.components[0]) return;
          const r = e.get(yt),
            o = e.get(Hw);
          1 === e.get(cf) && r.initialNavigation(),
            e.get($w, null, $.Optional)?.setUpPreloading(),
            e.get(af, null, $.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            o.closed || (o.next(), o.complete(), o.unsubscribe());
        };
      }
      const Hw = new E("", { factory: () => new st() }),
        cf = new E("", { providedIn: "root", factory: () => 1 }),
        $w = new E("");
      function _F(e) {
        return ln(0, [
          { provide: $w, useExisting: yF },
          { provide: kw, useExisting: e },
        ]);
      }
      const Vw = new E("ROUTER_FORROOT_GUARD"),
        bF = [
          sd,
          { provide: wi, useClass: $d },
          yt,
          Si,
          {
            provide: ro,
            useFactory: function Lw(e) {
              return e.routerState.root;
            },
            deps: [yt],
          },
          rf,
          [],
        ];
      function MF() {
        return new sC("Router", yt);
      }
      let Bw = (() => {
        class e {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                bF,
                [],
                { provide: ao, multi: !0, useValue: n },
                {
                  provide: Vw,
                  useFactory: AF,
                  deps: [[yt, new ds(), new fs()]],
                },
                { provide: Qa, useValue: r || {} },
                r?.useHash
                  ? { provide: Gn, useClass: tR }
                  : { provide: Gn, useClass: FC },
                {
                  provide: af,
                  useFactory: () => {
                    const e = _(DN),
                      t = _(Y),
                      n = _(Qa),
                      r = _(Za),
                      o = _(wi);
                    return (
                      n.scrollOffset && e.setOffset(n.scrollOffset),
                      new Fw(o, r, e, t, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? _F(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: sC, multi: !0, useFactory: MF },
                r?.initialNavigation ? OF(r) : [],
                r?.bindToComponentInputs
                  ? ln(8, [gw, { provide: Ua, useExisting: gw }]).ɵproviders
                  : [],
                [
                  { provide: Uw, useFactory: jw },
                  { provide: da, multi: !0, useExisting: Uw },
                ],
              ],
            };
          }
          static forChild(n) {
            return {
              ngModule: e,
              providers: [{ provide: ao, multi: !0, useValue: n }],
            };
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(Vw, 8));
          });
          static #t = (this.ɵmod = mn({ type: e }));
          static #n = (this.ɵinj = Gt({}));
        }
        return e;
      })();
      function AF(e) {
        return "guarded";
      }
      function OF(e) {
        return [
          "disabled" === e.initialNavigation
            ? ln(3, [
                {
                  provide: $l,
                  multi: !0,
                  useFactory: () => {
                    const t = _(yt);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: cf, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? ln(2, [
                { provide: cf, useValue: 0 },
                {
                  provide: $l,
                  multi: !0,
                  deps: [ht],
                  useFactory: (t) => {
                    const n = t.get(Kx, Promise.resolve());
                    return () =>
                      n.then(
                        () =>
                          new Promise((r) => {
                            const o = t.get(yt),
                              i = t.get(Hw);
                            Nw(o, () => {
                              r(!0);
                            }),
                              (t.get(Za).afterPreactivation = () => (
                                r(!0), i.closed ? x(void 0) : i
                              )),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const Uw = new E(""),
        RF = [];
      let NF = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵmod = mn({ type: e }));
          static #n = (this.ɵinj = Gt({
            imports: [
              Bw.forRoot(RF, { initialNavigation: "enabledBlocking" }),
              Bw,
            ],
          }));
        }
        return e;
      })();
      const PF = new E(
        "WindowToken",
        typeof window < "u" && window.document
          ? { providedIn: "root", factory: () => window }
          : { providedIn: "root", factory: () => {} }
      );
      let kF = (() => {
          class e {
            constructor(n, r, o) {
              (this.ngZone = n),
                (this.document = r),
                (this.window = o),
                (this.copySubject = new st()),
                (this.copyResponse$ = this.copySubject.asObservable()),
                (this.config = {});
            }
            configure(n) {
              this.config = n;
            }
            copy(n) {
              if (!this.isSupported || !n)
                return this.pushCopyResponse({ isSuccess: !1, content: n });
              const r = this.copyFromContent(n);
              return this.pushCopyResponse(
                r ? { content: n, isSuccess: r } : { isSuccess: !1, content: n }
              );
            }
            get isSupported() {
              return (
                !!this.document.queryCommandSupported &&
                !!this.document.queryCommandSupported("copy") &&
                !!this.window
              );
            }
            isTargetValid(n) {
              if (
                n instanceof HTMLInputElement ||
                n instanceof HTMLTextAreaElement
              ) {
                if (n.hasAttribute("disabled"))
                  throw new Error(
                    'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute'
                  );
                return !0;
              }
              throw new Error("Target should be input or textarea");
            }
            copyFromInputElement(n, r = !0) {
              try {
                this.selectTarget(n);
                const o = this.copyText();
                return (
                  this.clearSelection(r ? n : void 0, this.window),
                  o && this.isCopySuccessInIE11()
                );
              } catch {
                return !1;
              }
            }
            isCopySuccessInIE11() {
              const n = this.window.clipboardData;
              return !(n && n.getData && !n.getData("Text"));
            }
            copyFromContent(n, r = this.document.body) {
              if (
                (this.tempTextArea &&
                  !r.contains(this.tempTextArea) &&
                  this.destroy(this.tempTextArea.parentElement || void 0),
                !this.tempTextArea)
              ) {
                this.tempTextArea = this.createTempTextArea(
                  this.document,
                  this.window
                );
                try {
                  r.appendChild(this.tempTextArea);
                } catch {
                  throw new Error("Container should be a Dom element");
                }
              }
              this.tempTextArea.value = n;
              const o = this.copyFromInputElement(this.tempTextArea, !1);
              return (
                this.config.cleanUpAfterCopy &&
                  this.destroy(this.tempTextArea.parentElement || void 0),
                o
              );
            }
            destroy(n = this.document.body) {
              this.tempTextArea &&
                (n.removeChild(this.tempTextArea),
                (this.tempTextArea = void 0));
            }
            selectTarget(n) {
              return (
                n.select(),
                n.setSelectionRange(0, n.value.length),
                n.value.length
              );
            }
            copyText() {
              return this.document.execCommand("copy");
            }
            clearSelection(n, r) {
              n && n.focus(), r.getSelection()?.removeAllRanges();
            }
            createTempTextArea(n, r) {
              const o = "rtl" === n.documentElement.getAttribute("dir");
              let i;
              return (
                (i = n.createElement("textarea")),
                (i.style.fontSize = "12pt"),
                (i.style.border = "0"),
                (i.style.padding = "0"),
                (i.style.margin = "0"),
                (i.style.position = "absolute"),
                (i.style[o ? "right" : "left"] = "-9999px"),
                (i.style.top =
                  (r.pageYOffset || n.documentElement.scrollTop) + "px"),
                i.setAttribute("readonly", ""),
                i
              );
            }
            pushCopyResponse(n) {
              this.copySubject.observers.length > 0 &&
                this.ngZone.run(() => {
                  this.copySubject.next(n);
                });
            }
            pushCopyReponse(n) {
              this.pushCopyResponse(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(M(Y), M(ot), M(PF, 8));
            }),
            (e.ɵprov = I({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        FF = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = mn({ type: e })),
            (e.ɵinj = Gt({ imports: [KC] })),
            e
          );
        })(),
        LF = (() => {
          class e {
            constructor(n) {
              (this.clipboardService = n),
                (this.Email = "ahmad.berkdar.sy@gmail.com"),
                (this.Phone = "+201080857997"),
                (this.activeOption = "");
            }
            copyToClipboard(n) {
              this.clipboardService.copy(n);
              const r = document.getElementById("copiedToClipboard");
              (r.style.opacity = "1"),
                setTimeout(() => {
                  r.style.opacity = "0";
                }, 500);
            }
            ngOnInit() {}
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(S(kF));
            });
            static #t = (this.ɵcmp = gn({
              type: e,
              selectors: [["app-contact"]],
              inputs: { activeOption: "activeOption" },
              decls: 33,
              vars: 8,
              consts: [
                [1, "contactComponent"],
                [1, "infoSection"],
                [1, "imageContainer"],
                [
                  "src",
                  "../../assets/images/ahmadbayrakdar.jpg",
                  "alt",
                  "author",
                ],
                [1, "titleInfo"],
                [1, "contactSection"],
                [1, "icons"],
                [1, "emailMe", 3, "href", "click"],
                [
                  "src",
                  "../../assets/icons/iconmonstr-email-3.svg",
                  "alt",
                  "Email",
                ],
                [
                  "href",
                  "https://www.youtube.com/@ahmadbayrakdar",
                  "target",
                  "_blank",
                ],
                [
                  "src",
                  "../../assets/icons/iconmonstr-youtube-6.svg",
                  "alt",
                  "YouTube",
                ],
                ["href", "https://wa.me/+201080857997", "target", "_blank"],
                [
                  "src",
                  "../../assets/icons/iconmonstr-whatsapp-1.svg",
                  "alt",
                  "WhatsApp",
                ],
                [1, "callMe", 3, "href", "click"],
                [
                  "src",
                  "../../assets/icons/iconmonstr-phone-1.svg",
                  "alt",
                  "Call Me",
                ],
                [1, "aboutMe"],
              ],
              template: function (r, o) {
                1 & r &&
                  (j(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  gt(3, "img", 3),
                  B(),
                  j(4, "div", 4)(5, "h1"),
                  ce(6, "Ahmad Bayrakdar"),
                  B(),
                  j(7, "h2"),
                  ce(8),
                  B()()(),
                  j(9, "div", 5)(10, "div", 6)(11, "a", 7),
                  De("click", function () {
                    return o.copyToClipboard(o.Email);
                  }),
                  gt(12, "img", 8),
                  B(),
                  j(13, "a", 9),
                  gt(14, "img", 10),
                  B(),
                  j(15, "a", 11),
                  gt(16, "img", 12),
                  B()(),
                  j(17, "a", 13),
                  De("click", function () {
                    return o.copyToClipboard(o.Phone);
                  }),
                  gt(18, "img", 14),
                  j(19, "h3"),
                  ce(20, "Call Me"),
                  B()(),
                  j(21, "p"),
                  ce(22, "ahmad.berkdar.sy@gmail.com"),
                  B(),
                  j(23, "p"),
                  ce(24, "+201080857997"),
                  B()(),
                  j(25, "div", 15)(26, "h2"),
                  ce(27, "Who I Am.."),
                  B(),
                  j(28, "p"),
                  ce(29, " Passionate Person."),
                  gt(30, "br")(31, "br"),
                  ce(
                    32,
                    " I spend most of my life learning and experimenting which makes me grateful to the amazing people who afforded us this new world of technology so we can apply our creativity to it. "
                  ),
                  B()()()),
                  2 & r &&
                    (re(8),
                    vl(
                      " ",
                      "Programming" == o.activeOption ? "Programmer" : "",
                      " ",
                      "Design" == o.activeOption ? "Designer" : "",
                      " ",
                      "Video" == o.activeOption ? "Video Editor" : "",
                      " ",
                      "Audio" == o.activeOption ? "Sound Engineer" : "",
                      " ",
                      "Others" == o.activeOption ? "Multi Skilled" : "",
                      " ",
                      o.activeOption ? "" : "Multi Skilled",
                      " "
                    ),
                    re(3),
                    nt("href", "mailto:" + o.Email, Ir),
                    re(6),
                    nt("href", "tel:" + o.Phone, Ir));
              },
              styles: [
                ".contactComponent[_ngcontent-%COMP%]{width:261px;height:100vh;background-color:#d9d9d9;padding:0 20px;display:flex;flex-direction:column;justify-content:space-evenly;text-align:center}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%]{width:161px;height:161px}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;border-radius:50%}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-family:Bonheur Royale;font-size:30px;font-weight:400;margin-top:30px}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:14px;font-weight:400;margin-top:7px}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .icons[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{padding:0 10px;display:inline-block}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .emailMe[_ngcontent-%COMP%]   *[_ngcontent-%COMP%], .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{pointer-events:none}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]{width:181px;padding:10px;background-color:#fff;margin:22px 0;display:flex;justify-content:center;align-items:center;cursor:pointer;text-decoration:none;transition:filter .2s ease-in-out}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0 9px}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:12px;font-weight:700;text-transform:uppercase;color:#000}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]:hover{filter:invert(1)}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:12px}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-of-type{margin-top:10px}.contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-weight:700;font-size:14px}.contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{overflow-x:hidden;font-size:14px}@media only screen and (max-height: 795px){.contactComponent[_ngcontent-%COMP%]{width:231px}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%]{width:143px;height:143px}.contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{height:90px;text-overflow:ellipsis;overflow:scroll}}@media only screen and (max-width: 630px){.contactComponent[_ngcontent-%COMP%]{width:100%;height:clamp(115px,36vw,140px);flex-direction:row;position:relative;height:-moz-fit-content;height:fit-content}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]{position:absolute;width:100%;flex-direction:row;justify-content:space-between}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]{margin:0}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .icons[_ngcontent-%COMP%], .contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]{flex-grow:1;width:auto}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{display:none}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]{margin-top:56px;margin-bottom:12px;flex-direction:row}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%]{width:77px;height:77px}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:start;margin-left:27px}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0}.contactComponent[_ngcontent-%COMP%]   .aboutMe[_ngcontent-%COMP%]{display:none}}@media only screen and (max-width: 420px){.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .imageContainer[_ngcontent-%COMP%]{width:64px;height:64px}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:20px}.contactComponent[_ngcontent-%COMP%]   .infoSection[_ngcontent-%COMP%]   .titleInfo[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:12px}.contactComponent[_ngcontent-%COMP%]   .contactSection[_ngcontent-%COMP%]   .callMe[_ngcontent-%COMP%]:hover{filter:none}}",
              ],
            }));
          }
          return e;
        })();
      const zw = {
        Programming: ["Web", "Ux Ui", "Desktop", "Mobile", "Game"],
        Design: ["Social Media", "Brands", "Prints", "3d", "Art"],
        Video: ["Motion Graphic", "Video Editing"],
        Audio: ["Audio Engineering", "Music", "Voice Acting"],
        Others: ["Photography", "Writings", "Behind The Scenes", "Me"],
      };
      let jF = (() => {
        class e {
          constructor() {
            (this.activeOption = "Programming"),
              (this.activeOptionChange = new _e());
          }
          setActiveOption(n) {
            (this.activeOption = n), this.activeOptionChange.emit(n);
          }
          getActiveOption() {
            return this.activeOption;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵcmp = gn({
            type: e,
            selectors: [["app-nav"]],
            outputs: { activeOptionChange: "activeOptionChange" },
            decls: 22,
            vars: 20,
            consts: [
              [1, "navComponent", "desktop"],
              [3, "click"],
              [1, "navComponent", "tablet"],
            ],
            template: function (r, o) {
              1 & r &&
                (j(0, "div", 0)(1, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Programming");
                }),
                ce(2, " Programming & Engineering "),
                B(),
                j(3, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Design");
                }),
                ce(4, " Design & Art "),
                B(),
                j(5, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Video");
                }),
                ce(6, " Video & Motion "),
                B(),
                j(7, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Audio");
                }),
                ce(8, " Audio & Songs "),
                B(),
                j(9, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Others");
                }),
                ce(10, " Others "),
                B()(),
                j(11, "div", 2)(12, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Programming");
                }),
                ce(13, " Programming "),
                B(),
                j(14, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Design");
                }),
                ce(15, " Design "),
                B(),
                j(16, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Video");
                }),
                ce(17, " Video "),
                B(),
                j(18, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Audio");
                }),
                ce(19, " Audio "),
                B(),
                j(20, "div", 1),
                De("click", function () {
                  return o.setActiveOption("Others");
                }),
                ce(21, " Others "),
                B()()),
                2 & r &&
                  (re(1),
                  rt("active", "Programming" === o.activeOption),
                  re(2),
                  rt("active", "Design" === o.activeOption),
                  re(2),
                  rt("active", "Video" === o.activeOption),
                  re(2),
                  rt("active", "Audio" === o.activeOption),
                  re(2),
                  rt("active", "Others" === o.activeOption),
                  re(3),
                  rt("active", "Programming" === o.activeOption),
                  re(2),
                  rt("active", "Design" === o.activeOption),
                  re(2),
                  rt("active", "Video" === o.activeOption),
                  re(2),
                  rt("active", "Audio" === o.activeOption),
                  re(2),
                  rt("active", "Others" === o.activeOption));
            },
            styles: [
              ".navComponent[_ngcontent-%COMP%]{width:100%;display:flex;justify-content:space-between;background-color:#5f5b58;height:122px}.navComponent[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{text-decoration:none;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;flex-grow:1;font-size:16px;transition:all .2s ease-in-out;padding:0 10px;cursor:pointer;-webkit-user-select:none;user-select:none}.navComponent[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:hover{background-color:#545251}.navComponent[_ngcontent-%COMP%]   div.active[_ngcontent-%COMP%]{background-color:#000}.navComponent.tablet[_ngcontent-%COMP%]{display:none}.navComponent.tablet[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:14px;flex-grow:1}@media only screen and (max-width: 990px){.navComponent[_ngcontent-%COMP%]{height:78px}.navComponent.desktop[_ngcontent-%COMP%]{display:none}.navComponent.tablet[_ngcontent-%COMP%]{display:flex}}@media only screen and (max-width: 420px){.navComponent[_ngcontent-%COMP%]{height:68px}.navComponent.tablet[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:12px;padding:0 5px}}",
            ],
          }));
        }
        return e;
      })();
      const qw = [
        {
          title: "BigMedia",
          description: "Agency website for a company in Dubai, UAE",
          link: "https://www.bayrakdar.online/BigMedia/",
          image: "../assets/images/BigMedia.jpg",
          tags: ["React Js", "SCSS", "Javascript", "JQuery", "GSAP"],
          speciality: "Web",
        },
        {
          title: "Ranem Yatakan",
          description: "E-Booking system for a life coach in UK",
          link: "https://app.ranemyatakan.com/",
          image: "../assets/images/Ranem Yatakan.jpg",
          tags: ["React Js", "Next Js", "MUI"],
          speciality: "Web",
        },
        {
          title: "My Portfolio",
          description: "Personal website (my portfolio since 2024)",
          link: "https://www.bayrakdar.online/",
          image: "../assets/images/My Portfolio.jpg",
          tags: ["Angular Universal", "SCSS", "Google Analytics"],
          speciality: "Web",
        },
        {
          title: "Proitx",
          description: "Agency website for a company in Dubai, UAE",
          link: "https://proitx.com/",
          image: "../assets/images/Proitx.jpg",
          tags: [
            "HTML",
            "CSS",
            "Javascript",
            "JQuery",
            "Bootstrap",
            "Google Analytics",
          ],
          speciality: "Web",
        },
        {
          title: "Sna Academy",
          description: "E-Learning system for an academy in Saudi Arabia",
          link: "https://sna-academy.com/ar/homepage",
          image: "../assets/images/Sna Academy.jpg",
          tags: ["Laravel Blade", "HTML", "CSS", "Javascript", "jQuery"],
          speciality: "Web",
        },
        {
          title: "Afaq lms",
          description: "E-Learning system for an academy in Saudi Arabia",
          link: "https://afaq-lms.com/ar/homepage",
          image: "../assets/images/Afaq lms.jpg",
          tags: ["Laravel Blade", "HTML", "CSS", "Javascript", "jQuery"],
          speciality: "Web",
        },
        {
          title: "Evntoo",
          description: "E-Reservation system for a company in Egypt",
          link: "https://evntoo.com/",
          image: "../assets/images/Evntoo.jpg",
          tags: ["Angular", "CSS", "Javascript", "jQuery"],
          speciality: "Web",
        },
        {
          title: "DmedLab",
          description: "Encyclopedia web page for a mobile application",
          link: "https://dmedlab.com/",
          image: "../assets/images/DmedLab.jpg",
          tags: ["HTML", "CSS", "Javascript", "Bootstrap"],
          speciality: "Web",
        },
        {
          title: "Ozone NDT",
          description: "E-Commerce Website for a company in Canada",
          link: "https://ozonendt.com/",
          image: "../assets/images/Ozone NDT.jpg",
          tags: [
            "WordPress",
            "Woocommerce",
            "Authentication",
            "Javascript",
            "CSS",
          ],
          speciality: "Web",
        },
        {
          title: "Elmalek Furniture",
          description: "E-Commerce Website for a company in Egpyt",
          link: "https://elmalekfurniture.com/",
          image: "../assets/images/Elmalek Furniture.jpg",
          tags: [
            "WordPress",
            "Woocommerce",
            "Authentication",
            "Javascript",
            "CSS",
          ],
          speciality: "Web",
        },
        {
          title: "NasNav",
          description: "Product web page with add to cart",
          link: "https://www.bayrakdar.online/old-portfolio-2023/websites/nasnav/index.html",
          image: "../assets/images/NasNav.jpg",
          tags: ["React Js", "CSS", "Javascript", "Cookies"],
          speciality: "Web",
        },
        {
          title: "Proitx old",
          description: "Agency website for a company in Dubai, UAE",
          link: "http://ahmadbayrakdar.epizy.com/proitx/",
          image: "../assets/images/Proitx old.jpg",
          tags: [
            "HTML",
            "CSS",
            "Javascript",
            "JQuery",
            "Bootstrap",
            "Animate.css",
          ],
          speciality: "Web",
        },
        {
          title: "Proitx old 2",
          description: "Agency website for a company in Dubai, UAE",
          link: "https://ahmadbayrakdar.epizy.com/proitx2/",
          image: "../assets/images/Proitx old 2.jpg",
          tags: ["HTML", "CSS", "Javascript", "Bootstrap", "FullPage.js"],
          speciality: "Web",
        },
        {
          title: "My Old Portfolio",
          description: "Personal website (my portfolio in 2023)",
          link: "https://www.bayrakdar.online/old-portfolio-2023/",
          image: "../assets/images/My Old Portfolio.jpg",
          tags: ["HTML", "CSS", "CSS Animation", "Javascript"],
          speciality: "Web",
        },
        {
          title: "My Older Portfolio",
          description: "Personal website (my first portfolio in 2023)",
          link: "https://www.bayrakdar.online/old_portfolio/",
          image: "../assets/images/My Older Portfolio.jpg",
          tags: ["HTML", "CSS", "Animate.css", "Tailwind", "JQuery"],
          speciality: "Web",
        },
        {
          title: "Mad",
          description: "Simple webpage I did when I was learning the basics",
          link: "http://ahmadbayrakdar.epizy.com/mad/",
          image: "../assets/images/Mad.jpg",
          tags: ["HTML", "CSS"],
          speciality: "Web",
        },
        {
          title: "Coloured",
          description: "Simple webpage I did when I was learning the basics",
          link: "https://bayrakdar.online/colouredwebsite",
          image: "../assets/images/Coloured.jpg",
          tags: ["HTML", "CSS"],
          speciality: "Web",
        },
      ];
      function HF(e, t) {
        if ((1 & e && (j(0, "div", 9), ce(1), B()), 2 & e)) {
          const n = t.$implicit;
          re(1), ti(" ", n, " ");
        }
      }
      function $F(e, t) {
        if (
          (1 & e &&
            (j(0, "a", 3)(1, "div", 4),
            gt(2, "img", 5),
            B(),
            j(3, "div", 6)(4, "h2"),
            ce(5),
            B(),
            j(6, "p"),
            ce(7),
            B(),
            j(8, "div", 7),
            Jo(9, HF, 2, 1, "div", 8),
            B()()()),
          2 & e)
        ) {
          const n = Ko().$implicit;
          nt("href", n.link, Ir),
            re(2),
            nt("src", n.image || "../../assets/images/default image.png", Ir),
            re(3),
            ta(n.title),
            re(2),
            ta(n.description),
            re(2),
            nt("ngForOf", n.tags);
        }
      }
      function VF(e, t) {
        if ((1 & e && (j(0, "div", 1), Jo(1, $F, 10, 5, "a", 2), B()), 2 & e)) {
          const n = t.$implicit,
            r = Ko();
          re(1), nt("ngIf", n.speciality == r.Route);
        }
      }
      let BF = (() => {
        class e {
          constructor() {
            (this.sub = "Web Development"),
              (this.projectItems = qw),
              (this.Route = "");
          }
          ngOnInit() {
            (this.Route = this.sub), this.filterProjects();
          }
          ngOnChanges(n) {
            (this.Route = this.sub), this.filterProjects();
          }
          filterProjects() {
            this.projectItems = qw.filter((n) => n.speciality === this.Route);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵcmp = gn({
            type: e,
            selectors: [["app-card"]],
            inputs: { sub: "sub" },
            features: [Yt],
            decls: 1,
            vars: 1,
            consts: [
              ["class", "cardContainer", 4, "ngFor", "ngForOf"],
              [1, "cardContainer"],
              [
                "class",
                "cardComponent",
                "target",
                "_blank",
                3,
                "href",
                4,
                "ngIf",
              ],
              ["target", "_blank", 1, "cardComponent", 3, "href"],
              [1, "cardImage"],
              ["alt", "Project Image", 3, "src"],
              [1, "descriptionAndTags"],
              [1, "tags"],
              ["class", "tagElement", 4, "ngFor", "ngForOf"],
              [1, "tagElement"],
            ],
            template: function (r, o) {
              1 & r && Jo(0, VF, 2, 1, "div", 0),
                2 & r && nt("ngForOf", o.projectItems);
            },
            dependencies: [vd, QC],
            styles: [
              '.cardComponent[_ngcontent-%COMP%]{display:flex;flex-direction:column;text-align:center;gap:11px;border:solid 2px #d9d9d9;width:clamp(100px,25vw,350px);padding-bottom:15px;color:#000;text-decoration:none;transition:box-shadow .2s ease-in-out;height:100%}.cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%]{overflow:hidden;position:relative;height:clamp(110px,20vw,175px)}.cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;object-fit:cover}.cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%]:after{content:"";position:absolute;top:0;left:0;width:100%;height:100%}.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:11px;flex-grow:1}.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:18px;font-weight:600;transition:font-weight .2s ease-in-out;padding-top:5px}.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px;color:#565656;padding:0 10px}.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%]{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:0 10px}.cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%]   .tagElement[_ngcontent-%COMP%]{font-size:10px;font-weight:700;background-color:#5f5b58;color:#fff;padding:5px 10px;width:-moz-fit-content;width:fit-content}.cardComponent[_ngcontent-%COMP%]:hover{box-shadow:0 0 7px #d9d9d9}.cardComponent[_ngcontent-%COMP%]:hover   .descriptionAndTags[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-weight:700}@media only screen and (max-width: 990px){.cardComponent[_ngcontent-%COMP%]{width:clamp(250px,25vw,219px)}}@media only screen and (max-width: 630px){.cardContainer[_ngcontent-%COMP%]{display:flex;justify-content:center}.cardContainer[_ngcontent-%COMP%]   .cardComponent[_ngcontent-%COMP%]{width:95%}.cardContainer[_ngcontent-%COMP%]   .cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%]{height:auto}.cardContainer[_ngcontent-%COMP%]   .cardComponent[_ngcontent-%COMP%]   .cardImage[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%;width:100%}.cardContainer[_ngcontent-%COMP%]   .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]{justify-content:center;flex-grow:1;padding:5px 0 15px}.cardContainer[_ngcontent-%COMP%]   .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{justify-content:center}.cardContainer[_ngcontent-%COMP%]   .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .cardContainer[_ngcontent-%COMP%]   .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%]{padding:0 10px}.cardContainer[_ngcontent-%COMP%]   .cardComponent[_ngcontent-%COMP%]   .descriptionAndTags[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%]   .tagElement[_ngcontent-%COMP%]{padding:5px}}',
            ],
          }));
        }
        return e;
      })();
      function UF(e, t) {
        if (1 & e) {
          const n = (function Lm() {
            return y();
          })();
          j(0, "div", 2)(1, "div", 3),
            De("click", function () {
              const i = (function kh(e) {
                return (O.lFrame.contextLView = e), e[de];
              })(n).$implicit;
              return (function Fh(e) {
                return (O.lFrame.contextLView = null), e;
              })(Ko().setActiveSub(i));
            }),
            j(2, "div", 4),
            ce(3),
            B()()();
        }
        if (2 & e) {
          const n = t.$implicit,
            r = Ko();
          re(1), rt("active", r.activeSub === n), re(2), ti(" ", n, " ");
        }
      }
      let zF = (() => {
          class e {
            constructor() {
              (this.subLinks = []),
                (this.mainRoute = ""),
                (this.activeSub = "Web Development"),
                (this.activeSubChange = new _e());
            }
            ngOnChanges(n) {
              (this.activeSub = this.subLinks[0]),
                this.activeSubChange.emit(this.activeSub);
            }
            setActiveSub(n) {
              (this.activeSub = n), this.activeSubChange.emit(n);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = gn({
              type: e,
              selectors: [["app-sub-nav"]],
              inputs: { subLinks: "subLinks", mainRoute: "mainRoute" },
              outputs: { activeSubChange: "activeSubChange" },
              features: [Yt],
              decls: 2,
              vars: 1,
              consts: [
                [1, "subNavComponent"],
                ["class", "subText", 4, "ngFor", "ngForOf"],
                [1, "subText"],
                [3, "click"],
                [1, "linkText"],
              ],
              template: function (r, o) {
                1 & r && (j(0, "div", 0), Jo(1, UF, 4, 3, "div", 1), B()),
                  2 & r && (re(1), nt("ngForOf", o.subLinks));
              },
              dependencies: [vd],
              styles: [
                '.subNavComponent[_ngcontent-%COMP%]{width:100%;display:flex;justify-content:center;padding:25px 0}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{text-decoration:none;color:#000;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px 15px 0;position:relative;cursor:pointer;-webkit-user-select:none;user-select:none}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%]{padding:0 0 10px}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%]{border-bottom:solid 2px rgba(255,255,255,0);font-size:14px;position:relative}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%]:after{content:"";position:absolute;width:100%;background-color:#fff;height:6px;right:0;bottom:-4px;transition:width .3s ease-in-out}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]   div.active[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%]{border-color:#000}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]   div.active[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%]:after{width:0%}@media only screen and (max-width: 420px){.subNavComponent[_ngcontent-%COMP%]{padding:0;height:43px}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]{display:flex;align-items:center}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{padding:5px 7px 0}.subNavComponent[_ngcontent-%COMP%]   .subText[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   .linkText[_ngcontent-%COMP%]{font-size:12px}}',
              ],
            }));
          }
          return e;
        })(),
        qF = (() => {
          class e {
            constructor() {
              (this.itemLinks = [""]),
                (this.activeOption = "Programming"),
                (this.activeSub = "Web Development"),
                (this.activeOptionChangeToAppComponent = new _e());
            }
            ngOnInit() {
              this.itemLinks = zw[this.activeOption];
            }
            onActiveOptionChange(n) {
              (this.activeOption = n),
                (this.itemLinks = zw[this.activeOption]),
                this.activeOptionChangeToAppComponent.emit(n);
            }
            onActiveSubChange(n) {
              this.activeSub = n;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = gn({
              type: e,
              selectors: [["app-portfolio"]],
              outputs: {
                activeOptionChangeToAppComponent:
                  "activeOptionChangeToAppComponent",
              },
              decls: 5,
              vars: 3,
              consts: [
                [3, "activeOptionChange"],
                [3, "subLinks", "mainRoute", "activeSubChange"],
                [1, "cardsContiner"],
                [3, "sub"],
              ],
              template: function (r, o) {
                1 & r &&
                  (j(0, "div")(1, "app-nav", 0),
                  De("activeOptionChange", function (s) {
                    return o.onActiveOptionChange(s);
                  }),
                  B(),
                  j(2, "app-sub-nav", 1),
                  De("activeSubChange", function (s) {
                    return o.onActiveSubChange(s);
                  }),
                  B(),
                  j(3, "span", 2),
                  gt(4, "app-card", 3),
                  B()()),
                  2 & r &&
                    (re(2),
                    nt("subLinks", o.itemLinks)("mainRoute", o.activeOption),
                    re(2),
                    nt("sub", o.activeSub));
              },
              dependencies: [jF, BF, zF],
              styles: [
                ".cardsContiner[_ngcontent-%COMP%]   app-card[_ngcontent-%COMP%]{padding:10px;display:flex;justify-content:center;flex-wrap:wrap;margin-bottom:50px;gap:35px}@media only screen and (max-width: 990px){.cardsContiner[_ngcontent-%COMP%]   app-card[_ngcontent-%COMP%]{padding:20px;gap:25px}}@media only screen and (max-width: 630px){.cardsContiner[_ngcontent-%COMP%]   app-card[_ngcontent-%COMP%]{width:100%;gap:35px}}",
              ],
            }));
          }
          return e;
        })(),
        GF = (() => {
          class e {
            constructor() {
              (this.title = "portfolio-2024-all-skills"),
                (this.specialty = "Programming");
            }
            onActiveOptionChangeToAppComponent(n) {
              this.specialty = n;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = gn({
              type: e,
              selectors: [["app-root"]],
              decls: 4,
              vars: 1,
              consts: [
                [1, "appComponent"],
                [3, "activeOption"],
                [1, "portfolioBody"],
                [3, "activeOptionChangeToAppComponent"],
              ],
              template: function (r, o) {
                1 & r &&
                  (j(0, "div", 0),
                  gt(1, "app-contact", 1),
                  j(2, "div", 2)(3, "app-portfolio", 3),
                  De("activeOptionChangeToAppComponent", function (s) {
                    return o.onActiveOptionChangeToAppComponent(s);
                  }),
                  B()()()),
                  2 & r && (re(1), nt("activeOption", o.specialty));
              },
              dependencies: [LF, qF],
              styles: [
                ".appComponent[_ngcontent-%COMP%]{display:flex}.appComponent[_ngcontent-%COMP%]   app-contact[_ngcontent-%COMP%]{position:sticky;background-color:#d9d9d9;height:100vh;top:0}.appComponent[_ngcontent-%COMP%]   .portfolioBody[_ngcontent-%COMP%]{flex-grow:1}@media only screen and (max-width: 630px){.appComponent[_ngcontent-%COMP%]{flex-direction:column}.appComponent[_ngcontent-%COMP%]   app-contact[_ngcontent-%COMP%]{position:inherit;height:auto}}",
              ],
            }));
          }
          return e;
        })(),
        WF = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = mn({ type: e, bootstrap: [GF] }));
            static #n = (this.ɵinj = Gt({
              providers: [YP()],
              imports: [UP, NF, FF],
            }));
          }
          return e;
        })();
      VP()
        .bootstrapModule(WF)
        .catch((e) => console.error(e));
    },
  },
  (J) => {
    J((J.s = 63));
  },
]);
