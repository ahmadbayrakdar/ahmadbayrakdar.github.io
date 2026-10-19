// Theme toggle, sticky-header border, mobile menu sheet (focus trap, Esc to close).
const root = document.documentElement;

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable */
    }
  });
});

const header = document.querySelector<HTMLElement>('.site-header');
if (header) {
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => header.classList.toggle('is-scrolled', !e!.isIntersecting)).observe(sentinel);
}

const sheet = document.getElementById('mobile-sheet');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
if (sheet && openBtn) {
  const closeBtn = sheet.querySelector<HTMLButtonElement>('[data-menu-close]')!;
  const focusables = () =>
    Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((el) => el.offsetParent !== null);
  const setOpen = (open: boolean) => {
    sheet.classList.toggle('is-open', open);
    document.body.classList.toggle('sheet-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    if (open) closeBtn.focus();
    else openBtn.focus();
  };
  openBtn.addEventListener('click', () => setOpen(true));
  closeBtn.addEventListener('click', () => setOpen(false));
  sheet.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      sheet.classList.remove('is-open');
      document.body.classList.remove('sheet-open');
      openBtn.setAttribute('aria-expanded', 'false');
    }),
  );
  sheet.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab') {
      const f = focusables();
      if (!f.length) return;
      const first = f[0]!;
      const last = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (m) => {
    if (m.matches && sheet.classList.contains('is-open')) setOpen(false);
  });
}
