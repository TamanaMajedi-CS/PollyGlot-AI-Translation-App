

const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.DEV ? 'http://127.0.0.1:8787' : '');

export async function translateText({ text, language }) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Text is required.');
  }
  if (!language) {
    throw new Error('Language is required.');
  }

  let res;
  try {
    res = await fetch(`${API_BASE}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });
  } catch (netErr) {
    // Network-level error (e.g., worker not running)
    throw new Error(
      `Network error calling API. Is Wrangler running on ${API_BASE}? (${netErr.message})`
    );
  }

  if (!res.ok) {
    const msg = await safeMessage(res);
    throw new Error(msg || `Request failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data || typeof data.translation !== 'string') {
    throw new Error('No translation returned.');
  }
  return data;
}

async function safeMessage(res) {
  try {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const err = await res.json();
      return err?.error || err?.message || null;
    }
    const txt = await res.text();
    return txt?.slice(0, 400) || null;
  } catch {
    return null;
  }
}
