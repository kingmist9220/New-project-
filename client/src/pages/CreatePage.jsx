import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../api.js';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const slug = slugify(title);

  const onSubmit = (e) => {
    e.preventDefault();
    if (slug && !slug.startsWith('Special:')) navigate(`/wiki/${encodeURIComponent(slug)}`);
  };

  return (
    <>
      <h1 className="article-title">Create a page</h1>
      <p>Enter the title of the article you'd like to write. If it already exists, you'll be taken to it.</p>
      <form className="create-form" onSubmit={onSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" maxLength={200} autoFocus />
        <button type="submit" className="primary" disabled={!slug}>Continue</button>
      </form>
    </>
  );
}
