import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { BrainCircuit, LayoutDashboard, LogOut } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('ii-admin-token', data.token);
      localStorage.setItem('ii-admin-user', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-login-wrap"><form className="admin-login-card" onSubmit={submit}><div className="admin-logo"><BrainCircuit size={30} /></div><div className="eyebrow">PRIVATE AREA</div><h1>Admin sign in</h1><p className="muted">Sign in to manage Industrial Intellect content.</p><label>Email address<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" /></label><label>Password<input type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-primary full-width" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button><small className="muted">Admin accounts are provisioned by the Super Admin. Public signup is disabled.</small></form></section>;
}

export function AdminDashboard() {
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ii-admin-user') || 'null'); } catch { return null; }
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('ii-admin-token');

  if (!token || !user) {
    navigate('/admin/login');
    return null;
  }

  function logout() {
    localStorage.removeItem('ii-admin-token');
    localStorage.removeItem('ii-admin-user');
    navigate('/admin/login');
  }

  return <section className="container page-section"><div className="admin-welcome"><div><div className="eyebrow"><LayoutDashboard size={14} /> ADMIN WORKSPACE</div><h1>Welcome back</h1><p className="muted">{user.email} · {user.role?.replace('_', ' ')}</p></div><button className="button button-secondary" onClick={logout}><LogOut size={16} /> Sign out</button></div><div className="notice-card"><strong>Starter dashboard</strong><p className="muted">Authentication is connected. Content management forms, user provisioning, cloud uploads and live analytics are the next implementation phase.</p></div><div className="admin-quick-grid"><div className="stat-card"><strong>Videos</strong><span>Content management next</span></div><div className="stat-card"><strong>Courses</strong><span>Playlist management next</span></div><div className="stat-card"><strong>Articles</strong><span>Editor workflow next</span></div></div></section>;
}
