import { useState, type ReactNode } from 'react';
import { api } from './api';
import { Icon, Spinner, useConfirm, useToast } from './ui';

type Props = { route: 'projects' | 'profile' | 'messages'; unread: number; onLogout: () => void; children: ReactNode };

export default function Shell({ route, unread, onLogout, children }: Props) {
  const toast = useToast();
  const confirm = useConfirm();
  const [publishing, setPublishing] = useState(false);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore */
    }
  };

  const publish = async () => {
    const ok = await confirm({
      title: 'Publish site?',
      body: 'This triggers a rebuild of the public site with the current published content. It goes live in a couple of minutes.',
      confirmLabel: 'Publish site',
    });
    if (!ok) return;
    setPublishing(true);
    try {
      const r = await api.rebuild();
      toast.ok(r?.message ?? 'Rebuild requested. The site updates in a couple of minutes.');
    } catch (e) {
      toast.err(`Rebuild failed: ${(e as Error).message}`);
    } finally {
      setPublishing(false);
    }
  };

  const nav = [
    { id: 'projects', label: 'Projects', href: '#/projects' },
    { id: 'profile', label: 'Profile', href: '#/profile' },
    { id: 'messages', label: 'Messages', href: '#/messages', badge: unread },
  ] as const;

  return (
    <div className="adm">
      <a className="skip-link" href="#adm-main">
        Skip to content
      </a>
      <header className="adm-top">
        <a className="adm-brand" href="#/projects" aria-label="Portfolio admin home">
          <span className="wordmark-badge" aria-hidden="true">
            AB
          </span>
          <span>Admin</span>
        </a>
        <nav className="adm-nav" aria-label="Admin">
          {nav.map((n) => (
            <a key={n.id} href={n.href} aria-current={route === n.id ? 'page' : undefined}>
              {n.label}
              {'badge' in n && n.badge > 0 && (
                <span className="a-badge" aria-label={`${n.badge} unread`}>
                  {n.badge}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div className="adm-top-actions">
          <a className="a-btn a-btn-ghost a-btn-sm" href="/" target="_blank" rel="noopener">
            View site <Icon name="arrowUpRight" size={14} />
          </a>
          <button type="button" className="a-icon-btn" onClick={toggleTheme} aria-label="Toggle colour theme">
            <Icon name="sun" />
          </button>
          <button type="button" className="a-btn a-btn-primary a-btn-sm" onClick={publish} disabled={publishing}>
            {publishing ? <Spinner /> : <Icon name="send" size={14} />} Publish site
          </button>
          <button type="button" className="a-btn a-btn-sm" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>
      <main id="adm-main" className="adm-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
