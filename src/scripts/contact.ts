export function initContact(): void {
  // Copy-to-clipboard buttons
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('span');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy ?? '');
        if (label) label.textContent = 'Copied';
      } catch {
        if (label) label.textContent = 'Press Ctrl+C';
      }
      window.setTimeout(() => label && (label.textContent = 'Copy'), 1800);
    });
  });

  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;
  const api = form.dataset.api ?? '';
  const status = document.getElementById('cf-status')!;
  const submit = document.getElementById('cf-submit') as HTMLButtonElement;
  const submitLabel = submit.querySelector('span')!;

  const setError = (id: string, msg: string) => {
    const input = form.querySelector<HTMLElement>(`[name="${id}"]`);
    const err = document.getElementById(`cf-${id}-err`);
    if (err) err.textContent = msg;
    input?.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const validate = (): boolean => {
    const f = new FormData(form);
    const name = String(f.get('name') ?? '').trim();
    const email = String(f.get('email') ?? '').trim();
    const message = String(f.get('message') ?? '').trim();
    setError('name', name ? '' : 'Please tell me your name.');
    setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.');
    setError('message', message.length >= 10 ? '' : 'A few words more, please (10 characters minimum).');
    const bad = form.querySelector<HTMLElement>('[aria-invalid="true"]');
    bad?.focus();
    return !bad;
  };

  form.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.getAttribute('aria-invalid') === 'true') setError(t.name, '');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';
    if (!validate()) return;
    const f = new FormData(form);
    const body = {
      name: String(f.get('name') ?? '').trim(),
      email: String(f.get('email') ?? '').trim(),
      company: String(f.get('company') ?? '').trim() || null,
      message: String(f.get('message') ?? '').trim(),
      website: String(f.get('website') ?? ''),
    };
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submitLabel.textContent = 'Sending…';
    try {
      const res = await fetch(`${api}/api/contact`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.status === 429) throw new Error('Too many messages from this connection. Please try again in an hour, or email me directly.');
      if (!res.ok) {
        let detail = '';
        try {
          const j = await res.json();
          detail = typeof j?.detail === 'string' ? j.detail : '';
        } catch {
          /* ignore */
        }
        throw new Error(detail || 'The message could not be sent. Please email me directly.');
      }
      form.reset();
      status.className = 'form-status ok';
      status.textContent = 'Thanks, your message is in. I will get back to you by email.';
    } catch (err) {
      status.className = 'form-status err';
      status.textContent =
        err instanceof TypeError ? 'Network error. Check your connection or email me directly.' : (err as Error).message;
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      submitLabel.textContent = 'Send message';
    }
  });
}
