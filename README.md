# WikiNode

A simple Wikipedia-like encyclopedia built with **React** (Vite) on the front end and **Node.js** (Express) on the back end.

## Features

- Read articles with a Wikipedia-style layout, an automatic table of contents and internal links
- Edit any article or create new ones, with a live preview
- Red links for articles that don't exist yet (click one to create it)
- Full revision history for every article, with the ability to view old revisions
- Full-text search, an "All pages" index, "Recent changes" and "Random article"
- Light and dark themes, plus a mobile-friendly layout

## Getting started

Requires Node.js 18 or newer.

```bash
npm run install:all   # install server and client dependencies
```

### Development

Run the API and the React dev server in two terminals:

```bash
npm run dev:server    # API on http://localhost:3001
npm run dev:client    # app on http://localhost:5173 (proxies /api to the server)
```

### Production

```bash
npm run build         # build the React app into client/dist
npm start             # Express serves the API and the built app on http://localhost:3001
```

Articles are stored in `server/data/articles.json`, which is created and seeded with a few starter articles on first run. Set `WIKI_DATA_FILE` to store it elsewhere, and `PORT` to change the port.

## Article markup

| Markup | Result |
| --- | --- |
| `== Heading ==`, `=== Subheading ===` | Section headings |
| `'''bold'''`, `''italic''` | **bold**, *italic* |
| `[[Article]]`, `[[Article\|text]]` | Internal links |
| `[https://example.com text]` | External link |
| `* item`, `# item` | Bulleted and numbered lists |

## Project layout

```
server/   Express API (index.js), JSON file store (store.js), seed articles (seed.js)
client/   React app: pages/, components/, wikitext.jsx (markup renderer), api.js
```

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/articles` | List all articles |
| GET | `/api/articles/:slug?rev=N` | Get an article (optionally an old revision) |
| PUT | `/api/articles/:slug` | Create or update an article (`{ content, author, summary }`) |
| DELETE | `/api/articles/:slug` | Delete an article |
| GET | `/api/articles/:slug/history` | Revision history |
| GET | `/api/search?q=...` | Search titles and content |
| GET | `/api/recent` | Recent changes |
| GET | `/api/random` | A random article's slug |
