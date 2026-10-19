import { useCallback, useEffect, useState } from 'react';
import type { Message } from '../lib/types';
import { api } from './api';
import { ErrorState, Icon, Skeleton, fmtDateTime, useConfirm, useToast } from './ui';

export default function MessagesPage({ onChange }: { onChange: () => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState<Message[] | null>(null);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = useCallback(() => {
    setError('');
    api
      .listMessages()
      .then((l) => setItems([...l].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const setRead = async (m: Message, read: boolean) => {
    setItems((l) => l?.map((x) => (x.id === m.id ? { ...x, read } : x)) ?? l);
    try {
      await api.markMessage(m.id, read);
      onChange();
    } catch (e) {
      setItems((l) => l?.map((x) => (x.id === m.id ? { ...x, read: m.read } : x)) ?? l);
      toast.err((e as Error).message);
    }
  };

  const open = (m: Message) => {
    setOpenId(m.id === openId ? null : m.id);
    if (!m.read) void setRead(m, true);
  };

  const remove = async (m: Message) => {
    const ok = await confirm({ title: 'Delete this message?', body: `From ${m.name} <${m.email}>. This cannot be undone.`, confirmLabel: 'Delete message', danger: true });
    if (!ok) return;
    try {
      await api.deleteMessage(m.id);
      setItems((l) => l?.filter((x) => x.id !== m.id) ?? l);
      toast.ok('Message deleted.');
      onChange();
    } catch (e) {
      toast.err((e as Error).message);
    }
  };

  const unread = items?.filter((m) => !m.read).length ?? 0;
  const shown = items?.filter((m) => filter === 'all' || !m.read) ?? [];

  return (
    <div className="a-page">
      <div className="a-page-head">
        <div>
          <h1>Messages</h1>
          {items && (
            <p className="a-muted">
              {items.length} total · {unread} unread
            </p>
          )}
        </div>
        <div className="a-seg" role="group" aria-label="Filter messages">
          {(['all', 'unread'] as const).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f[0]!.toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!items && !error && <Skeleton rows={5} height={64} />}
      {items && shown.length === 0 && (
        <p className="a-empty a-empty-box">
          <Icon name="inbox" size={22} />
          <span>{items.length === 0 ? 'No messages yet. Contact-form submissions will appear here.' : 'No unread messages.'}</span>
        </p>
      )}

      {shown.length > 0 && (
        <ul className="a-inbox">
          {shown.map((m) => {
            const isOpen = openId === m.id;
            return (
              <li key={m.id} className={`a-msg ${m.read ? '' : 'is-unread'} ${isOpen ? 'is-open' : ''}`}>
                <button type="button" className="a-msg-head" aria-expanded={isOpen} aria-controls={`msg-${m.id}`} onClick={() => open(m)}>
                  <span className="a-dot" aria-label={m.read ? 'Read' : 'Unread'} />
                  <span className="a-msg-from">
                    <strong>{m.name}</strong>
                    <span className="a-muted">{m.company ? ` · ${m.company}` : ''}</span>
                  </span>
                  <span className="a-msg-snippet">{m.body}</span>
                  <time className="a-msg-date a-mono" dateTime={m.created_at}>
                    {fmtDateTime(m.created_at)}
                  </time>
                </button>
                {isOpen && (
                  <div className="a-msg-body" id={`msg-${m.id}`}>
                    <p className="a-msg-meta">
                      <a className="a-link" href={`mailto:${m.email}`}>
                        {m.email}
                      </a>
                    </p>
                    <p className="a-msg-text">{m.body}</p>
                    <div className="a-msg-actions">
                      <a className="a-btn a-btn-primary a-btn-sm" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}>
                        <Icon name="mail" size={14} /> Reply by email
                      </a>
                      <button type="button" className="a-btn a-btn-sm" onClick={() => setRead(m, !m.read)}>
                        Mark as {m.read ? 'unread' : 'read'}
                      </button>
                      <button type="button" className="a-btn a-btn-sm a-btn-danger-ghost" onClick={() => remove(m)}>
                        <Icon name="trash" size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
