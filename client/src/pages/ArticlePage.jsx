import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api, formatDate } from '../api.js';
import Tabs from '../components/Tabs.jsx';
import { WikiContent, linkedSlugs, parseBlocks, tableOfContents } from '../wikitext.jsx';

export default function ArticlePage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const rev = searchParams.get('rev');
  const [article, setArticle] = useState(null);
  const [existing, setExisting] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setArticle(null);
    setError(null);
    setExisting(null);
    api
      .get(slug, rev)
      .then(async (a) => {
        if (cancelled) return;
        setArticle(a);
        document.title = `${a.title} - WikiNode`;
        const slugs = linkedSlugs(a.content);
        if (slugs.length) {
          const found = await api.exists(slugs);
          if (!cancelled) setExisting(found);
        }
      })
      .catch((e) => !cancelled && setError(e));
    return () => {
      cancelled = true;
    };
  }, [slug, rev]);

  const blocks = useMemo(() => (article ? parseBlocks(article.content) : []), [article]);
  const toc = useMemo(() => tableOfContents(blocks), [blocks]);

  const title = slug.replace(/_/g, ' ');

  if (error?.status === 404) {
    return (
      <>
        <Tabs slug={slug} exists={false} />
        <h1 className="article-title">{title}</h1>
        <div className="notice">
          WikiNode does not have an article with this exact name.{' '}
          <Link to={`/wiki/${encodeURIComponent(slug)}/edit`}>Start the {title} article</Link> or{' '}
          <Link to={`/search?q=${encodeURIComponent(title)}`}>search for “{title}”</Link> in existing articles.
        </div>
      </>
    );
  }
  if (error) return <div className="error">{error.message}</div>;
  if (!article) return <div className="loading">Loading…</div>;

  return (
    <article>
      <Tabs slug={slug} />
      <h1 className="article-title">{article.title}</h1>
      <div className="tagline">From WikiNode, the free encyclopedia</div>
      {!article.isLatest && (
        <div className="notice">
          This is an old revision of this page, as edited by {article.author} at {formatDate(article.updatedAt)}.{' '}
          <Link to={`/wiki/${encodeURIComponent(slug)}`}>View the current version.</Link>
        </div>
      )}
      {toc.length >= 3 && (
        <nav className="toc" aria-label="Contents">
          <h2>Contents</h2>
          <ol>
            {toc.map((h, i) => (
              <li key={i} className={`toc-level-${h.level}`}>
                <a href={`#${h.id}`}>{h.text.replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]|'{2,3}/g, '$1')}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="article-body">
        <WikiContent blocks={blocks} existing={existing} />
      </div>
      <div className="last-modified">
        This page was last edited on {formatDate(article.updatedAt)} by {article.author}.
      </div>
    </article>
  );
}
