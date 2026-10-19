import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function RandomPage() {
  const navigate = useNavigate();

  useEffect(() => {
    api.random().then(
      ({ slug }) => navigate(`/wiki/${encodeURIComponent(slug)}`, { replace: true }),
      () => navigate('/special/all', { replace: true }),
    );
  }, [navigate]);

  return <div className="loading">Finding a random article…</div>;
}
