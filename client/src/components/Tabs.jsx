import { NavLink } from 'react-router-dom';

// The Read / Edit / View history tabs shown above every article.
export default function Tabs({ slug, exists = true }) {
  const base = `/wiki/${encodeURIComponent(slug)}`;
  return (
    <div className="tabs">
      <div className="tabs-left">
        <NavLink end to={base} className={exists ? undefined : 'new'}>Article</NavLink>
      </div>
      <div className="tabs-right">
        {exists && <NavLink end to={base}>Read</NavLink>}
        <NavLink to={`${base}/edit`}>{exists ? 'Edit' : 'Create'}</NavLink>
        {exists && <NavLink to={`${base}/history`}>View history</NavLink>}
      </div>
    </div>
  );
}
