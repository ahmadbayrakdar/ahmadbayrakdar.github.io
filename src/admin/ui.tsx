import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent as RKeyboardEvent,
} from 'react';
import { ICONS, type IconName } from '../lib/icons';

/* ---------- Icon ---------- */
export function Icon({ name, size = 18, className }: { name: IconName | 'grip' | 'star' | 'starFill' | 'trash' | 'plus' | 'up' | 'down' | 'eye' | 'inbox' | 'user'; size?: number; className?: string }) {
  const extra: Record<string, string> = {
    grip: '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    starFill: '<path fill="currentColor" d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    up: '<path d="M6 14l6-6 6 6"/>',
    down: '<path d="M6 10l6 6 6-6"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  };
  const markup = (extra[name] ?? (ICONS as Record<string, string>)[name]) ?? '';
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

/* ---------- Toasts ---------- */
type Toast = { id: number; kind: 'ok' | 'err' | 'info'; text: string };
const ToastCtx = createContext<{ push: (kind: Toast['kind'], text: string) => void }>({ push: () => {} });
export const useToast = () => {
  const { push } = useContext(ToastCtx);
  return useMemo(
    () => ({
      ok: (t: string) => push('ok', t),
      err: (t: string) => push('err', t),
      info: (t: string) => push('info', t),
    }),
    [push],
  );
};

/* ---------- Confirm dialog ---------- */
type ConfirmOpts = { title: string; body?: ReactNode; confirmLabel?: string; danger?: boolean };
const ConfirmCtx = createContext<(o: ConfirmOpts) => Promise<boolean>>(() => Promise.resolve(false));
export const useConfirm = () => useContext(ConfirmCtx);

export function Providers({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'err' ? 7000 : 4000);
  }, []);

  const [dlg, setDlg] = useState<(ConfirmOpts & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((resolve) => setDlg({ ...o, resolve })), []);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (dlg && !d.open) d.showModal();
    if (!dlg && d.open) d.close();
  }, [dlg]);
  const finish = (v: boolean) => {
    dlg?.resolve(v);
    setDlg(null);
  };

  return (
    <ToastCtx.Provider value={{ push }}>
      <ConfirmCtx.Provider value={confirm}>
        {children}
        <div className="toasts" aria-live="polite" aria-atomic="false">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.kind}`} role={t.kind === 'err' ? 'alert' : 'status'}>
              <span>{t.text}</span>
              <button className="toast-x" type="button" aria-label="Dismiss" onClick={() => setToasts((l) => l.filter((x) => x.id !== t.id))}>
                <Icon name="x" size={14} />
              </button>
            </div>
          ))}
        </div>
        <dialog
          ref={dialogRef}
          className="adm-dialog"
          aria-labelledby="confirm-title"
          onCancel={(e) => {
            e.preventDefault();
            finish(false);
          }}
        >
          {dlg && (
            <div className="adm-dialog-body">
              <h2 id="confirm-title">{dlg.title}</h2>
              {dlg.body && <div className="adm-dialog-text">{dlg.body}</div>}
              <div className="adm-dialog-actions">
                <button type="button" className="a-btn" onClick={() => finish(false)} autoFocus>
                  Cancel
                </button>
                <button type="button" className={`a-btn ${dlg.danger ? 'a-btn-danger' : 'a-btn-primary'}`} onClick={() => finish(true)}>
                  {dlg.confirmLabel ?? 'Confirm'}
                </button>
              </div>
            </div>
          )}
        </dialog>
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  );
}

/* ---------- Modal (full-size content) ---------- */
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={`adm-modal ${wide ? 'adm-modal-wide' : ''}`} aria-label={title} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      {open && (
        <div className="adm-modal-inner">
          <div className="adm-modal-bar">
            <strong>{title}</strong>
            <button type="button" className="a-icon-btn" onClick={onClose} aria-label="Close">
              <Icon name="x" />
            </button>
          </div>
          <div className="adm-modal-scroll">{children}</div>
        </div>
      )}
    </dialog>
  );
}

/* ---------- Form pieces ---------- */
export function Field({
  label,
  hint,
  error,
  children,
  counter,
  htmlFor,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  counter?: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className={`a-field ${error ? 'has-error' : ''}`}>
      <div className="a-field-top">
        <label htmlFor={htmlFor}>{label}</label>
        {counter && <span className="a-counter">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p className="a-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="a-hint">{hint}</p>
      )}
    </div>
  );
}

export function TextInput({ id, value, onChange, ...rest }: { id: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'id'>) {
  return <input id={id} className="a-input" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function TextArea({ id, value, onChange, rows = 4, className, ...rest }: { id: string; value: string; onChange: (v: string) => void; rows?: number } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value' | 'id'>) {
  return <textarea id={id} className={`a-input a-textarea ${className ?? ''}`} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function Select({ id, value, onChange, options }: { id: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select id={id} className="a-input a-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id?: string }) {
  return (
    <label className="a-switch">
      <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="a-switch-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

/** Tag/chip input: Enter or comma adds, Backspace on empty removes last. */
export function ChipInput({ id, value, onChange, placeholder, suggestions }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; suggestions?: string[] }) {
  const [draft, setDraft] = useState('');
  const listId = useId();
  const add = (raw: string) => {
    const items = raw
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .filter((x) => !value.includes(x));
    if (items.length) onChange([...value, ...items]);
    setDraft('');
  };
  const onKey = (e: RKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <div className="a-chipbox" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
      {value.map((v) => (
        <span className="a-chip" key={v}>
          {v}
          <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(value.filter((x) => x !== v))}>
            <Icon name="x" size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        list={suggestions ? listId : undefined}
        onChange={(e) => (e.target.value.endsWith(',') ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={onKey}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={value.length ? '' : placeholder}
        aria-label={placeholder ?? 'Add item'}
      />
      {suggestions && (
        <datalist id={listId}>
          {suggestions.filter((s) => !value.includes(s)).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}

/** Repeater for plain strings. */
export function ListEditor({ idPrefix, value, onChange, placeholder, multiline, addLabel = 'Add item' }: { idPrefix: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; multiline?: boolean; addLabel?: string }) {
  const set = (i: number, v: string) => onChange(value.map((x, k) => (k === i ? v : x)));
  return (
    <div className="a-list">
      {value.map((v, i) => (
        <div className="a-list-row" key={i}>
          {multiline ? (
            <textarea className="a-input a-textarea" rows={2} id={`${idPrefix}-${i}`} aria-label={`${placeholder ?? 'Item'} ${i + 1}`} value={v} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} />
          ) : (
            <input className="a-input" id={`${idPrefix}-${i}`} aria-label={`${placeholder ?? 'Item'} ${i + 1}`} value={v} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} />
          )}
          <RowTools i={i} len={value.length} onMove={(d) => onChange(move(value, i, d))} onRemove={() => onChange(value.filter((_, k) => k !== i))} />
        </div>
      ))}
      <button type="button" className="a-btn a-btn-ghost a-btn-sm" onClick={() => onChange([...value, ''])}>
        <Icon name="plus" size={14} /> {addLabel}
      </button>
    </div>
  );
}

export function RowTools({ i, len, onMove, onRemove }: { i: number; len: number; onMove: (d: number) => void; onRemove: () => void }) {
  return (
    <div className="a-rowtools">
      <button type="button" className="a-icon-btn" aria-label="Move up" disabled={i === 0} onClick={() => onMove(-1)}>
        <Icon name="up" size={16} />
      </button>
      <button type="button" className="a-icon-btn" aria-label="Move down" disabled={i === len - 1} onClick={() => onMove(1)}>
        <Icon name="down" size={16} />
      </button>
      <button type="button" className="a-icon-btn a-danger" aria-label="Remove" onClick={onRemove}>
        <Icon name="trash" size={16} />
      </button>
    </div>
  );
}

/** Generic repeater of object rows with a custom row renderer. */
export function Repeater<T>({ value, onChange, render, blank, addLabel, label }: { value: T[]; onChange: (v: T[]) => void; render: (item: T, set: (patch: Partial<T>) => void, i: number) => ReactNode; blank: () => T; addLabel: string; label: string }) {
  return (
    <div className="a-repeater">
      {value.map((item, i) => (
        <fieldset className="a-card-row" key={i}>
          <legend className="sr-only">
            {label} {i + 1}
          </legend>
          <div className="a-card-row-head">
            <span className="a-mono">
              {label} {i + 1}
            </span>
            <RowTools i={i} len={value.length} onMove={(d) => onChange(move(value, i, d))} onRemove={() => onChange(value.filter((_, k) => k !== i))} />
          </div>
          {render(item, (patch) => onChange(value.map((x, k) => (k === i ? { ...x, ...patch } : x))), i)}
        </fieldset>
      ))}
      <button type="button" className="a-btn a-btn-ghost a-btn-sm" onClick={() => onChange([...value, blank()])}>
        <Icon name="plus" size={14} /> {addLabel}
      </button>
    </div>
  );
}

/* ---------- Tabs ---------- */
export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: T; label: string; badge?: string }[]; value: T; onChange: (t: T) => void; label: string }) {
  const onKey = (e: RKeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[n]!.id);
    document.getElementById(`tab-${tabs[n]!.id}`)?.focus();
  };
  return (
    <div className="a-tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button
          key={t.id}
          id={`tab-${t.id}`}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={value === t.id ? 0 : -1}
          className="a-tab"
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
          {t.badge && <span className="a-tab-badge">{t.badge}</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------- Loading / error ---------- */
export function Skeleton({ rows = 4, height = 44 }: { rows?: number; height?: number }) {
  return (
    <div className="a-skel" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="a-skel-row" style={{ height, opacity: 1 - i * 0.12 }} />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="a-errorstate" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="a-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function Spinner() {
  return <span className="a-spinner" aria-hidden="true" />;
}

/* ---------- Unsaved-changes guard ---------- */
const dirtyRef = { current: false };
export const isDirty = () => dirtyRef.current;
export const clearDirty = () => {
  dirtyRef.current = false;
};
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    dirtyRef.current = dirty;
    const h = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', h);
    return () => {
      window.removeEventListener('beforeunload', h);
      dirtyRef.current = false;
    };
  }, [dirty]);
}

export const fmtDate = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};
export const fmtDateTime = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
