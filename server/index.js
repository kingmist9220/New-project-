import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as store from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const MAX_TITLE = 200;
const MAX_CONTENT = 200_000;

store.load();

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/articles', (req, res) => {
  res.json(store.listArticles());
});

app.get('/api/recent', (req, res) => {
  res.json(store.recentChanges(Number(req.query.limit) || 20));
});

app.get('/api/search', (req, res) => {
  res.json(store.searchArticles(String(req.query.q || '')));
});

app.get('/api/random', (req, res) => {
  const slug = store.randomSlug();
  if (!slug) return res.status(404).json({ error: 'No articles yet' });
  res.json({ slug });
});

// Lets the client colour links to missing articles red, like Wikipedia.
app.post('/api/exists', (req, res) => {
  const slugs = Array.isArray(req.body?.slugs) ? req.body.slugs.slice(0, 500) : [];
  res.json(Object.fromEntries(slugs.map((s) => [s, store.exists(String(s))])));
});

app.get('/api/articles/:slug', (req, res) => {
  const rev = req.query.rev ? Number(req.query.rev) : undefined;
  const article = store.getArticle(req.params.slug, rev);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

app.get('/api/articles/:slug/history', (req, res) => {
  const history = store.getHistory(req.params.slug);
  if (!history) return res.status(404).json({ error: 'Article not found' });
  res.json(history);
});

app.put('/api/articles/:slug', (req, res) => {
  const { content, author, summary } = req.body || {};
  const title = store.titleFromSlug(req.params.slug);
  if (!store.slugify(title) || title.length > MAX_TITLE) {
    return res.status(400).json({ error: 'Invalid title' });
  }
  if (title.startsWith('Special:')) {
    return res.status(400).json({ error: 'Titles in the Special: namespace are reserved' });
  }
  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Content cannot be empty' });
  }
  if (content.length > MAX_CONTENT) {
    return res.status(400).json({ error: 'Content is too long' });
  }
  const result = store.saveArticle({ title, content, author: String(author || ''), summary: String(summary || '') });
  res.json(result);
});

app.delete('/api/articles/:slug', (req, res) => {
  if (!store.deleteArticle(req.params.slug)) return res.status(404).json({ error: 'Article not found' });
  res.status(204).end();
});

// In production, serve the built React app and let it handle client-side routes.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`WikiNode server listening on http://localhost:${PORT}`);
});
