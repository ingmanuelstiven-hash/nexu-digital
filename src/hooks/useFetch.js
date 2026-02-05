
// Custom hook para hacer fetch y manejar estado de carga y error
// Uso: const { data, loading, error } = useFetch(url)
import { useState, useEffect } from 'react';

export default function useFetch(url, options = null, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url, options)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(json => { if (!cancelled) setData(json); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, deps.length ? deps : [url]);

  return { data, loading, error };
}
