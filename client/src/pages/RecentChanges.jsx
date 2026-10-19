import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../api.js';

export default function RecentChanges() {
  const [changes, setChanges] = useState(null);

  useEffect(() => {
    document.title = 'Recent changes - WikiNode';
    api.recent(50).then(setChanges, () => setChanges([]));
  }, []);

  if (!changes) return <div className="loading">Loading…</div>;

  return (
    <>
      <h1 className="article-title">Recent changes</h1>
      <p>Track the most recent changes to the wiki on this page.</p>
      <ul className="history">
        {changes.map((c) => {
          const base = `/wiki/${encodeURIComponent(c.slug)}`;
          return (
            <li key={`${c.slug}-${c.id}`}>
              <span className="history-date">{formatDate(c.timestamp)}</span>
              {' · '}
              <Link to={base}>{c.title}</Link>{' '}
              (<Link to={`${base}?rev=${c.id}`}>rev {c.id}</Link> · <Link to={`${base}/history`}>hist</Link>)
              {' · '}
              <span className="history-author">{c.author}</span>
              {c.summary && <span className="history-summary"> ({c.summary})</span>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
