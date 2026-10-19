// A tiny JSON-file backed article store. Each article keeps its full revision
// history so edits can be inspected and compared, much like a real wiki.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedArticles } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = process.env.WIKI_DATA_FILE || path.join(__dirname, 'data', 'articles.json');

// Null-prototype object so slugs like "__proto__" are treated as ordinary keys.
let articles = Object.create(null);

export function slugify(title) {
  return title
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_\-().,']/gu, '');
}

export function titleFromSlug(slug) {
  return slug.replace(/_/g, ' ');
}

function save() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(articles, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

export function load() {
  if (fs.existsSync(DATA_FILE)) {
    articles = Object.assign(Object.create(null), JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
    return;
  }
  const now = new Date().toISOString();
  for (const { title, content } of seedArticles) {
    articles[slugify(title)] = {
      title,
      revisions: [{ id: 1, content, author: 'WikiBot', summary: 'Initial article', timestamp: now }],
    };
  }
  save();
}

function latest(article) {
  return article.revisions[article.revisions.length - 1];
}

function summarize(slug, article) {
  const rev = latest(article);
  return { slug, title: article.title, updatedAt: rev.timestamp, revisionCount: article.revisions.length };
}

export function listArticles() {
  return Object.entries(articles)
    .map(([slug, a]) => summarize(slug, a))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function recentChanges(limit = 20) {
  const changes = [];
  for (const [slug, a] of Object.entries(articles)) {
    for (const rev of a.revisions) {
      changes.push({ slug, title: a.title, id: rev.id, author: rev.author, summary: rev.summary, timestamp: rev.timestamp });
    }
  }
  return changes.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
}

export function getArticle(slug, revisionId) {
  const article = articles[slug];
  if (!article) return null;
  const rev = revisionId ? article.revisions.find((r) => r.id === revisionId) : latest(article);
  if (!rev) return null;
  return {
    slug,
    title: article.title,
    content: rev.content,
    revision: rev.id,
    isLatest: rev.id === latest(article).id,
    updatedAt: rev.timestamp,
    author: rev.author,
  };
}

export function getHistory(slug) {
  const article = articles[slug];
  if (!article) return null;
  return {
    slug,
    title: article.title,
    revisions: article.revisions
      .map(({ id, author, summary, timestamp, content }) => ({ id, author, summary, timestamp, size: content.length }))
      .reverse(),
  };
}

export function saveArticle({ title, content, author, summary }) {
  const slug = slugify(title);
  const entry = {
    content,
    author: author?.trim() || 'Anonymous',
    summary: summary?.trim() || '',
    timestamp: new Date().toISOString(),
  };
  const existing = articles[slug];
  if (existing) {
    if (latest(existing).content === content) return { slug, changed: false };
    existing.revisions.push({ id: latest(existing).id + 1, ...entry });
  } else {
    articles[slug] = { title: titleFromSlug(slug), revisions: [{ id: 1, ...entry }] };
  }
  save();
  return { slug, changed: true };
}

export function deleteArticle(slug) {
  if (!articles[slug]) return false;
  delete articles[slug];
  save();
  return true;
}

export function searchArticles(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];
  for (const [slug, a] of Object.entries(articles)) {
    const content = latest(a).content;
    const titleHit = a.title.toLowerCase().includes(q);
    const idx = content.toLowerCase().indexOf(q);
    if (!titleHit && idx === -1) continue;
    const start = Math.max(0, idx - 60);
    const snippet = idx === -1 ? content.slice(0, 160) : content.slice(start, idx + q.length + 100);
    results.push({
      slug,
      title: a.title,
      snippet: snippet.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, '$2').replace(/[=']{2,}/g, '').replace(/\s+/g, ' ').trim(),
      score: (titleHit ? 10 : 0) + (a.title.toLowerCase() === q ? 100 : 0),
    });
  }
  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function randomSlug() {
  const slugs = Object.keys(articles);
  return slugs.length ? slugs[Math.floor(Math.random() * slugs.length)] : null;
}

export function exists(slug) {
  return Boolean(articles[slug]);
}
