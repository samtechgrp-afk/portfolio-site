// Public by design: the publishable key is safe in the browser. Row-level security means visitors can only read published projects.
const URL = 'https://mzgbiqerlizirlybrkvp.supabase.co';
const KEY = 'sb_publishable_U9cZQQepNRJN5hmORtSW0w_2Ium1eIk';

const COLUMNS = 'title,slug,summary,cover_url,live_url,categories,created_at,typography,blocks';

/**
 * Returns the published project with this slug, or null when there is none.
 * Throws on network errors, server errors and timeouts (`timeout` in milliseconds).
 */
export async function fetchProject(slug, { timeout = 0 } = {}) {
  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;
  try {
    const res = await fetch(`${URL}/rest/v1/projects?select=${COLUMNS}&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`, {
      headers: { apikey: KEY },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const rows = await res.json();
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
