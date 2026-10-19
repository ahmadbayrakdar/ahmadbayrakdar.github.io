// Accessible <dialog> lightbox. Items come from [data-lightbox-item] buttons in DOM order.
export function initLightbox(): void {
  const dialog = document.getElementById('lightbox') as HTMLDialogElement | null;
  if (!dialog) return;
  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lightbox-item]'));
  if (!triggers.length) return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lb-caption]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-lb-counter]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lb-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-lb-close]')!;
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number) => {
    index = (i + triggers.length) % triggers.length;
    const t = triggers[index]!;
    img.src = t.dataset.full ?? '';
    img.alt = t.dataset.alt ?? '';
    caption.textContent = t.dataset.alt ?? '';
    counter.textContent = `${index + 1} / ${triggers.length}`;
    const single = triggers.length < 2;
    prev.hidden = next.hidden = single;
  };

  triggers.forEach((t, i) =>
    t.addEventListener('click', () => {
      opener = t;
      show(i);
      dialog.showModal();
      close.focus();
    }),
  );
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(index + 1);
    }
  });
  dialog.addEventListener('close', () => {
    img.removeAttribute('src');
    opener?.focus();
  });
}
