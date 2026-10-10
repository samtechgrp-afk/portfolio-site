import { fetchProject } from './supabase.js';

/*
 * Home page from the CMS. The project with slug "home" replaces the default layout when it is published
 * and has at least one block. The React renderer is only downloaded when that happens.
 * While we wait (at most 2.5 s) the default layout stays hidden, so there is no flash of the wrong page.
 */
const reveal = () => document.documentElement.classList.remove('home-pending');

(async () => {
  try {
    const home = await fetchProject('home', { timeout: 2500 });
    if (home && home.blocks && home.blocks.length) {
      const { mountHome } = await import('./home-render.jsx');
      mountHome(home);
    }
  } catch {
    /* Supabase unreachable: the default layout is shown. */
  } finally {
    reveal();
  }
})();
