import { useState } from 'react';
import { api, setToken, API_BASE } from './api';
import { Spinner } from './ui';

export default function Login({ notice, onLoggedIn }: { notice?: string; onLoggedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      const res = await api.login(email.trim(), password);
      setToken(res.token);
      onLoggedIn();
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 429) setError('Too many failed attempts. Wait 15 minutes and try again.');
      else if (status === 401 || status === 403) setError('Email or password is incorrect.');
      else setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit} noValidate>
        <div className="login-brand">
          <span className="wordmark-badge" aria-hidden="true">
            AB
          </span>
          <div>
            <h1>Portfolio admin</h1>
            <p className="a-muted">Sign in to manage projects, profile and messages.</p>
          </div>
        </div>
        {notice && (
          <p className="a-banner" role="status">
            {notice}
          </p>
        )}
        <div className="a-field">
          <div className="a-field-top">
            <label htmlFor="login-email">Email</label>
          </div>
          <input id="login-email" className="a-input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
        </div>
        <div className="a-field">
          <div className="a-field-top">
            <label htmlFor="login-password">Password</label>
          </div>
          <input id="login-password" className="a-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && (
          <p className="a-error" role="alert">
            {error}
          </p>
        )}
        <button className="a-btn a-btn-primary a-btn-lg" type="submit" disabled={busy}>
          {busy && <Spinner />} Sign in
        </button>
        <p className="a-hint a-mono">API: {API_BASE.replace(/^https?:\/\//, '')}</p>
        <a className="a-link" href="/">
          Back to site
        </a>
      </form>
    </div>
  );
}
