import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, slugify } from '../api.js';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState(null);

  useEffect(() => {
    document.title = `Search results for “${q}” - WikiNode`;
    setResults(null);
    api.search(q).then(setResults, () => setResults([]));
  }, [q]);

  const exact = results?.some((r) => r.title.toLowerCase() === q.trim().toLowerCase());
  const slug = slugify(q);

  return (
    <>
      <h1 className="article-title">Search results</h1>
      {!exact && slug && (
        <p className="notice">
          Create the page <Link className="new" to={`/wiki/${encodeURIComponent(slug)}/edit`}>“{q}”</Link> on this wiki.
        </p>
      )}
      {results === null ? (
        <div className="loading">Searching…</div>
      ) : results.length === 0 ? (
        <p>There were no results matching the query.</p>
      ) : (
        <ul className="search-results">
          {results.map((r) => (
            <li key={r.slug}>
              <Link to={`/wiki/${encodeURIComponent(r.slug)}`}>{r.title}</Link>
              <div className="snippet">{r.snippet}…</div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
