import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="page">
      <aside className="sidebar">
        <Link to="/wiki/Main_Page" className="logo" aria-label="Main page">
          <span className="logo-globe" aria-hidden="true">W</span>
          <span className="logo-name">WikiNode</span>
          <span className="logo-tagline">The Free Encyclopedia</span>
        </Link>
        <nav>
          <h3>Navigation</h3>
          <ul>
            <li><Link to="/wiki/Main_Page">Main page</Link></li>
            <li><Link to="/special/all">All articles</Link></li>
            <li><Link to="/special/recent">Recent changes</Link></li>
            <li><Link to="/special/random">Random article</Link></li>
          </ul>
          <h3>Contribute</h3>
          <ul>
            <li><Link to="/special/create">Create a page</Link></li>
            <li><Link to="/wiki/Main_Page#Formatting_help">Formatting help</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <form className="search" onSubmit={onSearch} role="search">
            <input
              type="search"
              placeholder="Search WikiNode"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search WikiNode"
            />
            <button type="submit">Search</button>
          </form>
        </header>
        <main className="content">{children}</main>
        <footer className="footer">
          Text is available for anyone to edit. WikiNode is a demo built with React and Node.js.
        </footer>
      </div>
    </div>
  );
}
