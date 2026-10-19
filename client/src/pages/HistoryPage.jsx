import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatDate } from '../api.js';
import Tabs from '../components/Tabs.jsx';

export default function HistoryPage() {
  const { slug } = useParams();
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHistory(null);
    setError(null);
    api.history(slug).then((h) => {
      setHistory(h);
      document.title = `${h.title}: Revision history - WikiNode`;
    }, setError);
  }, [slug]);

  if (error) return <div className="error">{error.message}</div>;
  if (!history) return <div className="loading">Loading…</div>;

  const base = `/wiki/${encodeURIComponent(slug)}`;
  return (
    <>
      <Tabs slug={slug} />
      <h1 className="article-title">{history.title}: Revision history</h1>
      <ul className="history">
        {history.revisions.map((r, i) => {
          const prev = history.revisions[i + 1];
          const delta = prev ? r.size - prev.size : r.size;
          return (
            <li key={r.id}>
              <Link to={i === 0 ? base : `${base}?rev=${r.id}`}>{formatDate(r.timestamp)}</Link>
              {' · '}
              <span className="history-author">{r.author}</span>
              {' · '}
              <span className="history-size">{r.size.toLocaleString()} bytes</span>{' '}
              <span className={delta >= 0 ? 'delta-pos' : 'delta-neg'}>({delta >= 0 ? '+' : ''}{delta.toLocaleString()})</span>
              {r.summary && <span className="history-summary"> ({r.summary})</span>}
              {i === 0 && <span className="history-current"> current</span>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
