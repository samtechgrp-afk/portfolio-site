import { applySiteIcon, cachedSiteIcon } from './components/siteIcon.js';
import { fetchSiteSettings } from './supabase.js';

/*
 * Site settings for the public pages. The icon chosen in the CMS (Site settings) is applied as soon as the page loads:
 * first the one remembered from the last visit (no flash), then the fresh value. With no custom icon the built-in one stays.
 * `siteSettings` resolves once, so every page script can share it.
 */
applySiteIcon(cachedSiteIcon(), { remember: false });

export const siteSettings = fetchSiteSettings().then((s) => {
  applySiteIcon(s.siteIconUrl || '');
  return s;
});
