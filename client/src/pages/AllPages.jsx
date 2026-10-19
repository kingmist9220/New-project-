import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function AllPages() {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    document.title = 'All pages - WikiNode';
    api.list().then(setArticles, () => setArticles([]));
  }, []);

  if (!articles) return <div className="loading">Loading…</div>;

  // Group alphabetically by first letter, as Special:AllPages does.
  const groups = {};
  for (const a of articles) (groups[a.title[0].toUpperCase()] ||= []).push(a);

  return (
    <>
      <h1 className="article-title">All pages</h1>
      <p>{articles.length} articles on WikiNode.</p>
      {Object.entries(groups).map(([letter, items]) => (
        <section key={letter} className="letter-group">
          <h2>{letter}</h2>
          <ul className="columns">
            {items.map((a) => (
              <li key={a.slug}><Link to={`/wiki/${encodeURIComponent(a.slug)}`}>{a.title}</Link></li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
