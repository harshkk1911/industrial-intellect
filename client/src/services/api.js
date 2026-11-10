const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api')).replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const token = options.token || localStorage.getItem('ii-admin-token');
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, {
      cache: 'no-store',
      ...options,
      headers
    });
  } catch {
    throw new Error(`Cannot reach the API at ${API_URL}. Check that the backend is running and VITE_API_URL is configured.`);
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : {};

  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}
