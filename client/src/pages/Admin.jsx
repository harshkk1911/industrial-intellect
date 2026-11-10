
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  LayoutDashboard,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Youtube,
  RefreshCw
} from 'lucide-react';

import { apiRequest } from '../services/api';

const emptyForm = {
  title: '',
  youtubeUrl: '',
  description: '',
  category: '',
  courseTitle: '',
  tags: '',
  status: 'draft',
  featured: false
};

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    let id = '';

    if (parsed.hostname.includes('youtu.be')) {
      id = parsed.pathname.slice(1);
    } else if (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname.includes('youtube-nocookie.com')
    ) {
      id = parsed.searchParams.get('v') || '';

      if (!id && parsed.pathname.startsWith('/embed/')) {
        id = parsed.pathname.split('/')[2];
      }

      if (!id && parsed.pathname.startsWith('/shorts/')) {
        id = parsed.pathname.split('/')[2];
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
  } catch {
    return '';
  }
}

function getThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

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
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('ii-admin-token', data.token);
      localStorage.setItem('ii-admin-user', JSON.stringify(data.user));

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-logo">
          <BrainCircuit size={30} />
        </div>

        <div className="eyebrow">PRIVATE AREA</div>
        <h1>Admin sign in</h1>
        <p className="muted">
          Sign in to manage Industrial Intellect content.
        </p>

        <label>
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button
          className="button button-primary full-width"
          disabled={busy}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <small className="muted">
          Admin accounts are provisioned by the Super Admin.
          Public signup is disabled.
        </small>
      </form>
    </section>
  );
}

export function AdminDashboard() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ii-admin-user') || 'null');
    } catch {
      return null;
    }
  });

  const [videos, setVideos] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', category: 'Others', status: 'draft', file: null });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('ii-admin-token');

  useEffect(() => {
    if (token) {
      loadVideos();
      loadResources();
    }
  }, [token]);

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  async function loadVideos() {
    setError('');

    try {
      const params = new URLSearchParams({ type: 'video' });

      if (search.trim()) params.set('search', search.trim());
      if (statusFilter) params.set('status', statusFilter);

      const data = await apiRequest(
        `/admin/content?${params.toString()}`
      );

      setVideos(data.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadResources() {
    try { const data = await apiRequest('/admin/content?type=resource'); setResources(data.items || []); }
    catch (err) { setError(err.message); }
  }

  async function uploadResource(event) {
    event.preventDefault(); setError(''); setMessage('');
    if (!resourceForm.file) { setError('Choose a file to upload.'); return; }
    const body = new FormData(); body.append('title', resourceForm.title); body.append('description', resourceForm.description); body.append('category', resourceForm.category); body.append('status', resourceForm.status); body.append('file', resourceForm.file);
    setBusy(true);
    try { await apiRequest('/admin/resources', { method: 'POST', body }); setMessage('Resource uploaded successfully.'); setResourceForm({ title: '', description: '', category: 'Others', status: 'draft', file: null }); await loadResources(); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  async function toggleResourcePublish(resource) {
    const status = resource.status === 'published' ? 'draft' : 'published';
    try { await apiRequest(`/admin/content/${resource._id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setMessage(status === 'published' ? 'Resource published.' : 'Resource moved to drafts.'); await loadResources(); }
    catch (err) { setError(err.message); }
  }

  async function deleteResource(id) {
    if (!window.confirm('Delete this resource permanently?')) return;
    try { await apiRequest(`/admin/content/${id}`, { method: 'DELETE' }); setMessage('Resource deleted.'); await loadResources(); }
    catch (err) { setError(err.message); }
  }

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage('');
    setError('');
  }

  function openEditForm(video) {
    setForm({
      title: video.title || '',
      youtubeUrl: video.youtubeUrl || '',
      description: video.description || '',
      category: video.category || '',
      courseTitle: '',
      tags: (video.tags || []).join(', '),
      status: video.status || 'draft',
      featured: Boolean(video.featured)
    });

    setEditingId(video._id);
    setShowForm(true);
    setMessage('');
    setError('');
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveVideo(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    const videoId = getYouTubeId(form.youtubeUrl);

    if (!videoId) {
      setError('Please enter a valid YouTube video URL.');
      return;
    }

    setBusy(true);

    try {
      const payload = {
        type: 'video',
        title: form.title.trim(),
        youtubeUrl: form.youtubeUrl.trim(),
        thumbnailUrl: getThumbnail(form.youtubeUrl),
        description: form.description.trim(),
        category: form.category.trim(),
        tags: form.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
        status: form.status,
        featured: form.featured
      };

      if (editingId) {
        await apiRequest(`/admin/content/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });

        setMessage('Video updated successfully.');
      } else {
        await apiRequest('/admin/content', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        setMessage('Video added successfully.');
      }

      closeForm();
      await loadVideos();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteVideo(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this video?'
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      await apiRequest(`/admin/content/${id}`, {
        method: 'DELETE'
      });

      setMessage('Video deleted successfully.');
      await loadVideos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function togglePublish(video) {
    setError('');
    setMessage('');

    const newStatus =
      video.status === 'published' ? 'draft' : 'published';

    try {
      await apiRequest(`/admin/content/${video._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      setMessage(
        newStatus === 'published'
          ? 'Video published successfully.'
          : 'Video moved to drafts.'
      );

      await loadVideos();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem('ii-admin-token');
    localStorage.removeItem('ii-admin-user');
    navigate('/admin/login');
  }

  return (
    <section className="container page-section admin-page">
      <div className="admin-welcome">
        <div>
          <div className="eyebrow">
            <LayoutDashboard size={14} />
            ADMIN WORKSPACE
          </div>
          <h1>Welcome back</h1>
          <p className="muted">
            {user.email} · {user.role?.replace('_', ' ')}
          </p>
        </div>

        <button
          className="button button-secondary"
          onClick={logout}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <div className="admin-welcome">
        <div>
          <h2>Video Management</h2>
          <p className="muted">
            Add videos and assign each one to a fixed category.
          </p>
        </div>

        <button
          className="button button-primary"
          onClick={openAddForm}
        >
          <Plus size={17} /> Add video
        </button>
      </div>

      {message && <div className="notice-card">{message}</div>}
      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <form className="admin-login-card admin-video-form" onSubmit={saveVideo}>
          <div className="admin-welcome">
            <h2>{editingId ? 'Edit video' : 'Add YouTube video'}</h2>

            <button
              type="button"
              className="button button-secondary"
              onClick={closeForm}
            >
              <X size={16} /> Close
            </button>
          </div>

          <label>
            Video title
            <input
              required
              maxLength={180}
              value={form.title}
              onChange={event =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Enter video title"
            />
          </label>

          <label>
            YouTube URL
            <input
              required
              type="url"
              value={form.youtubeUrl}
              onChange={event =>
                setForm({ ...form, youtubeUrl: event.target.value })
              }
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </label>

          {getThumbnail(form.youtubeUrl) && (
            <img
              src={getThumbnail(form.youtubeUrl)}
              alt="YouTube thumbnail preview"
              style={{
                width: '220px',
                borderRadius: '10px'
              }}
            />
          )}

          <label>
            Description
            <textarea
              maxLength={5000}
              rows={5}
              value={form.description}
              onChange={event =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="Describe this video..."
            />
          </label>

          <label>
            Category
            <select required value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>
              <option value="">Select a category</option>
              <option>Market Intelligence</option>
              <option>Industrial Skills</option>
              <option>Soft Skills</option>
              <option>Others</option>
            </select>
          </label>

          <label>
            Tags (comma separated)
            <input
              value={form.tags}
              onChange={event =>
                setForm({ ...form, tags: event.target.value })
              }
              placeholder="python, beginner, tutorial"
            />
          </label>

          <label>
            Publishing status
            <select
              value={form.status}
              onChange={event =>
                setForm({ ...form, status: event.target.value })
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={event =>
                setForm({ ...form, featured: event.target.checked })
              }
            />
            Featured video
          </label>

          <button
            className="button button-primary full-width"
            disabled={busy}
          >
            {busy
              ? 'Saving…'
              : editingId
                ? 'Update video'
                : 'Save video'}
          </button>
        </form>
      )}

      <div className="section-heading admin-resource-heading">
        <div><h2>Upload view-only resource</h2><p className="muted">PDF, Excel (XLS/XLSX) and Word (DOCX), maximum 20 MB.</p></div>
      </div>
      <form className="admin-resource-form" onSubmit={uploadResource}>
        <div className="resource-field resource-field-full">
          <label htmlFor="resource-title">Resource title</label>
          <input
            id="resource-title"
            required
            maxLength={180}
            value={resourceForm.title}
            onChange={e =>
              setResourceForm({ ...resourceForm, title: e.target.value })
            }
            placeholder="Enter resource title"
          />
        </div>

        <div className="resource-field resource-field-full">
          <label htmlFor="resource-description">Description</label>
          <textarea
            id="resource-description"
            rows={4}
            value={resourceForm.description}
            onChange={e =>
              setResourceForm({ ...resourceForm, description: e.target.value })
            }
            placeholder="Describe this resource..."
          />
        </div>

        <div className="resource-field">
          <label htmlFor="resource-category">Category</label>
          <select
            id="resource-category"
            required
            value={resourceForm.category}
            onChange={e =>
              setResourceForm({ ...resourceForm, category: e.target.value })
            }
          >
            <option>Market Intelligence</option>
            <option>Industrial Skills</option>
            <option>Soft Skills</option>
            <option>Others</option>
          </select>
        </div>

        <div className="resource-field">
          <label htmlFor="resource-status">Publishing status</label>
          <select
            id="resource-status"
            value={resourceForm.status}
            onChange={e =>
              setResourceForm({ ...resourceForm, status: e.target.value })
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="resource-field resource-field-full">
          <label htmlFor="resource-file">Upload file</label>
          <input
            id="resource-file"
            required
            type="file"
            accept=".pdf,.xls,.xlsx,.docx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={e =>
              setResourceForm({
                ...resourceForm,
                file: e.target.files?.[0] || null
              })
            }
          />
          <small>PDF, Excel or Word document. Maximum 20 MB.</small>
        </div>

        <div className="resource-field-full resource-submit">
          <button className="button button-primary" disabled={busy}>
            {busy ? 'Uploading…' : 'Upload resource'}
          </button>
        </div>
      </form>
      <h3 className="section-title-spaced">Uploaded resources</h3>
      <div className="admin-resource-list">{resources.map(resource=><article className="resource-card" key={resource._id}><strong>{resource.title}</strong><span>{resource.category} · {resource.status}</span><small>{resource.fileName}</small><div className="resource-admin-actions"><button type="button" className="button button-secondary" onClick={()=>toggleResourcePublish(resource)}>{resource.status === 'published' ? 'Unpublish' : 'Publish'}</button><button type="button" className="button button-secondary" onClick={()=>deleteResource(resource._id)}><Trash2 size={14}/> Delete</button></div></article>)}</div>

      <div className="admin-toolbar">
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search videos..."
        />

        <select
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <button
          className="button button-secondary"
          onClick={loadVideos}
        >
          <RefreshCw size={16} /> Search / Refresh
        </button>
      </div>

      <div className="admin-quick-grid">
        <div className="stat-card">
          <strong>{videos.length}</strong>
          <span>Videos in current results</span>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="notice-card">
          No videos found. Click "Add video" to publish your first lesson.
        </div>
      ) : (
        <div className="admin-video-list">
          {videos.map(video => (
            <article
              key={video._id}
              className="notice-card"
              style={{
                display: 'flex',
                gap: '18px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <img
                src={video.thumbnailUrl || getThumbnail(video.youtubeUrl)}
                alt={video.title}
                style={{
                  width: '150px',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />

              <div style={{ flex: 1, minWidth: '180px' }}>
                <h3>{video.title}</h3>
                <p className="muted">
                  {video.category || 'Uncategorized'} · {video.status}
                </p>
                <p className="muted">{video.description}</p>
                <a
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Youtube size={15} /> Open on YouTube
                </a>
              </div>

              <div>
                <button
                  className="button button-secondary"
                  onClick={() => openEditForm(video)}
                >
                  <Pencil size={15} /> Edit
                </button>

                <button
                  className="button button-secondary"
                  onClick={() => togglePublish(video)}
                >
                  {video.status === 'published'
                    ? 'Unpublish'
                    : 'Publish'}
                </button>

                {user.role !== 'editor' && (
                  <button
                    className="button button-secondary"
                    onClick={() => deleteVideo(video._id)}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
