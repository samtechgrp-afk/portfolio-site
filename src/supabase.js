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

/**
 * The font library: [{ family, fileUrl, format, weight, style }]. PageRenderer loads only the fonts a page uses.
 * Returns [] if the library can't be reached, so pages still render with their fallback fonts.
 */
export async function fetchFonts({ timeout = 0 } = {}) {
  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;
  try {
    const res = await fetch(`${URL}/rest/v1/fonts?select=family,file_url,format,weight,style&order=family`, { headers: { apikey: KEY }, signal: controller.signal });
    if (!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map((r) => ({ family: r.family, fileUrl: r.file_url, format: r.format, weight: r.weight, style: r.style })) : [];
  } catch {
    return [];
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Published projects for Project Grid blocks: [{ title, slug, summary, coverUrl, categories }].
 * The home page itself is never listed. Returns [] if they can't be loaded.
 */
export async function fetchProjects({ timeout = 0 } = {}) {
  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;
  try {
    const res = await fetch(`${URL}/rest/v1/projects?select=title,slug,summary,cover_url,categories&status=eq.published&slug=neq.home&order=created_at.desc&limit=24`, { headers: { apikey: KEY }, signal: controller.signal });
    if (!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map((r) => ({ title: r.title, slug: r.slug, summary: r.summary, coverUrl: r.cover_url, categories: r.categories || [] })) : [];
  } catch {
    return [];
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Global site settings ({ siteIconUrl, ... }). Returns {} if they can't be reached, so the default icon stays. */
export async function fetchSiteSettings({ timeout = 2500 } = {}) {
  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;
  try {
    const res = await fetch(`${URL}/rest/v1/site_settings?select=value&key=eq.site&limit=1`, { headers: { apikey: KEY }, signal: controller.signal });
    if (!res.ok) return {};
    const rows = await res.json();
    return Array.isArray(rows) && rows[0]?.value && typeof rows[0].value === 'object' ? rows[0].value : {};
  } catch {
    return {};
  } finally {
    if (timer) clearTimeout(timer);
  }
}
