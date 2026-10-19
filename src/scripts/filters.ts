// Progressive-enhancement filtering for pre-rendered project cards.
// Without JS every card is visible; this only hides/reorders.

export function initExplorers(): void {
  document.querySelectorAll<HTMLElement>('[data-explorer]').forEach(setup);
}

function setup(root: HTMLElement): void {
  const grid = root.querySelector<HTMLElement>('[data-grid]')!;
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-card]'));
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-cat]'));
  const search = root.querySelector<HTMLInputElement>('[data-search]');
  const kind = root.querySelector<HTMLSelectElement>('[data-kind]');
  const sort = root.querySelector<HTMLSelectElement>('[data-sort]');
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const more = root.querySelector<HTMLButtonElement>('[data-more]')!;
  const limit = Number(root.dataset.limit) || 9;
  const full = root.dataset.full === '1';

  let cat = '';
  let expanded = full; // the full list is not paginated
  const allPressed = () => (cat === '' && !(search?.value.trim()) && !(kind?.value));

  function apply(): void {
    const q = (search?.value ?? '').trim().toLowerCase();
    const k = kind?.value ?? '';
    const order = sort?.value ?? 'featured';

    const sorted = [...cards].sort((a, b) => {
      if (order === 'newest') {
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0) || Number(a.dataset.order) - Number(b.dataset.order);
      }
      return Number(a.dataset.order) - Number(b.dataset.order);
    });
    sorted.forEach((c) => grid.appendChild(c));

    let shown = 0;
    let matched = 0;
    for (const c of sorted) {
      const ok =
        (!cat || c.dataset.category === cat) &&
        (!k || c.dataset.kind === k) &&
        (!q || (c.dataset.search ?? '').includes(q));
      if (ok) matched++;
      const visible = ok && (expanded || !allPressed() || shown < limit);
      c.hidden = !visible;
      if (visible) shown++;
    }

    chips.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.cat ?? '') === cat)));
    empty.hidden = matched > 0;
    const hiddenByLimit = matched - shown;
    more.hidden = hiddenByLimit <= 0 || full;
    more.textContent = `Show all ${matched}`;
    status.textContent = allPressed() ? '' : `${matched} ${matched === 1 ? 'project' : 'projects'}`;
    if (full) status.textContent = `${matched} ${matched === 1 ? 'project' : 'projects'}`;
  }

  chips.forEach((b) =>
    b.addEventListener('click', () => {
      cat = b.dataset.cat ?? '';
      apply();
    }),
  );
  let t: number | undefined;
  search?.addEventListener('input', () => {
    window.clearTimeout(t);
    t = window.setTimeout(apply, 80);
  });
  kind?.addEventListener('change', apply);
  sort?.addEventListener('change', apply);
  more.addEventListener('click', () => {
    expanded = true;
    apply();
  });
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    cat = '';
    if (search) search.value = '';
    if (kind) kind.value = '';
    apply();
  });
  apply();
}
