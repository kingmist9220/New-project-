import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import Tabs from '../components/Tabs.jsx';
import { WikiContent, parseBlocks } from '../wikitext.jsx';

const AUTHOR_KEY = 'wikinode-author';

function savedAuthor() {
  try {
    return localStorage.getItem(AUTHOR_KEY) || '';
  } catch {
    return '';
  }
}

export default function EditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const title = slug.replace(/_/g, ' ');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState(savedAuthor);
  const [exists, setExists] = useState(null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    document.title = `Editing ${title} - WikiNode`;
    api
      .get(slug)
      .then((a) => {
        if (cancelled) return;
        setContent(a.content);
        setExists(true);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e.status === 404) {
          setContent(`'''${title}''' is `);
          setExists(false);
        } else setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, title]);

  const blocks = useMemo(() => (preview ? parseBlocks(content) : []), [preview, content]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      try {
        localStorage.setItem(AUTHOR_KEY, author);
      } catch {
        /* storage unavailable; not important */
      }
      const res = await api.save(slug, { content, summary, author });
      navigate(`/wiki/${encodeURIComponent(res.slug)}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm(`Delete "${title}" and its entire history? This cannot be undone.`)) return;
    try {
      await api.remove(slug);
      navigate('/special/all');
    } catch (err) {
      setError(err.message);
    }
  };

  if (exists === null && !error) return <div className="loading">Loading…</div>;

  return (
    <>
      <Tabs slug={slug} exists={Boolean(exists)} />
      <h1 className="article-title">{exists ? 'Editing' : 'Creating'} {title}</h1>
      {preview && (
        <div className="preview">
          <div className="preview-label">Preview — remember that this is only a preview; changes are not saved yet.</div>
          <WikiContent blocks={blocks} existing={null} />
        </div>
      )}
      <form className="editor" onSubmit={onSave}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={22}
          aria-label="Article source"
          spellCheck
        />
        <div className="editor-help">
          Markup: <code>== Heading ==</code> · <code>'''bold'''</code> · <code>''italic''</code> ·{' '}
          <code>[[Link]]</code> · <code>[[Link|text]]</code> · <code>[https://url text]</code> ·{' '}
          <code>* bullet</code> · <code># numbered</code>
        </div>
        <div className="editor-fields">
          <label>
            Summary
            <input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Briefly describe your changes" maxLength={200} />
          </label>
          <label>
            Your name
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Anonymous" maxLength={60} />
          </label>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="editor-actions">
          <button type="submit" className="primary" disabled={saving}>{saving ? 'Saving…' : 'Publish changes'}</button>
          <button type="button" onClick={() => setPreview((p) => !p)}>{preview ? 'Hide preview' : 'Show preview'}</button>
          <button type="button" onClick={() => navigate(exists ? `/wiki/${encodeURIComponent(slug)}` : '/')}>Cancel</button>
          {exists && slug !== 'Main_Page' && (
            <button type="button" className="danger" onClick={onDelete}>Delete page</button>
          )}
        </div>
      </form>
    </>
  );
}
