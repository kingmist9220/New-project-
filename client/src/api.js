async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const enc = encodeURIComponent;

export const api = {
  list: () => request('/articles'),
  recent: (limit = 50) => request(`/recent?limit=${limit}`),
  search: (q) => request(`/search?q=${enc(q)}`),
  random: () => request('/random'),
  exists: (slugs) => request('/exists', { method: 'POST', body: JSON.stringify({ slugs }) }),
  get: (slug, rev) => request(`/articles/${enc(slug)}${rev ? `?rev=${enc(rev)}` : ''}`),
  history: (slug) => request(`/articles/${enc(slug)}/history`),
  save: (slug, body) => request(`/articles/${enc(slug)}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (slug) => request(`/articles/${enc(slug)}`, { method: 'DELETE' }),
};

// Mirrors server/store.js so links resolve to the same slug the server uses.
export function slugify(title) {
  return title
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_\-().,']/gu, '');
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
