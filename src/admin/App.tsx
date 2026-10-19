import { useCallback, useEffect, useState } from 'react';
import '../styles/admin.css';
import { api, clearToken, getToken, UNAUTHORIZED_EVENT } from './api';
import Login from './Login';
import Shell from './Shell';
import ProjectsPage from './ProjectsPage';
import ProjectEditor from './ProjectEditor';
import ProfilePage from './ProfilePage';
import MessagesPage from './MessagesPage';
import { Providers, isDirty, clearDirty, Spinner } from './ui';

type Route = { name: 'projects' } | { name: 'new' } | { name: 'edit'; id: number } | { name: 'profile' } | { name: 'messages' };

function parse(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  if (h === 'projects/new') return { name: 'new' };
  const m = /^projects\/(\d+)$/.exec(h);
  if (m) return { name: 'edit', id: Number(m[1]) };
  if (h === 'profile') return { name: 'profile' };
  if (h === 'messages') return { name: 'messages' };
  return { name: 'projects' };
}

export default function App() {
  return (
    <Providers>
      <Gate />
    </Providers>
  );
}

function Gate() {
  const [state, setState] = useState<'checking' | 'out' | 'in'>(getToken() ? 'checking' : 'out');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (state !== 'checking') return;
    api
      .me()
      .then(() => setState('in'))
      .catch(() => {
        clearToken();
        setState('out');
      });
  }, [state]);

  useEffect(() => {
    const h = () => {
      clearDirty();
      setNotice('Your session expired. Sign in again.');
      setState('out');
    };
    window.addEventListener(UNAUTHORIZED_EVENT, h);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, h);
  }, []);

  if (state === 'checking') {
    return (
      <div className="login-wrap" aria-busy="true">
        <Spinner />
      </div>
    );
  }
  if (state === 'out') {
    return (
      <Login
        notice={notice}
        onLoggedIn={() => {
          setNotice('');
          setState('in');
        }}
      />
    );
  }
  return (
    <Authed
      onLogout={() => {
        clearToken();
        clearDirty();
        setNotice('');
        setState('out');
      }}
    />
  );
}

function Authed({ onLogout }: { onLogout: () => void }) {
  const [hash, setHash] = useState(() => window.location.hash);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let prev = window.location.hash;
    const onHash = () => {
      const next = window.location.hash;
      if (next === prev) return;
      if (isDirty() && !window.confirm('You have unsaved changes. Leave this page and discard them?')) {
        history.replaceState(null, '', prev || '#/projects');
        return;
      }
      clearDirty();
      prev = next;
      setHash(next);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const refreshUnread = useCallback(() => {
    api
      .listMessages()
      .then((l) => setUnread(l.filter((m) => !m.read).length))
      .catch(() => {});
  }, []);
  useEffect(refreshUnread, [refreshUnread, hash]);

  const route = parse(hash);
  return (
    <Shell route={route.name === 'new' || route.name === 'edit' ? 'projects' : route.name} unread={unread} onLogout={onLogout}>
      {route.name === 'projects' && <ProjectsPage />}
      {route.name === 'new' && <ProjectEditor key="new" id={null} />}
      {route.name === 'edit' && <ProjectEditor key={route.id} id={route.id} />}
      {route.name === 'profile' && <ProfilePage />}
      {route.name === 'messages' && <MessagesPage onChange={refreshUnread} />}
    </Shell>
  );
}
