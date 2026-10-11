import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import PageRenderer from './components/builder/PageRenderer.jsx';
import { withSiteFont } from './siteTypography.js';
import { fetchFonts } from './supabase.js';

/** Renders the CMS home page into #cms-home and hides the default layout. */
export async function mountHome(project) {
  const host = document.getElementById('cms-home');
  const fonts = await fetchFonts({ timeout: 2000 }); // library fonts the page uses; [] if unreachable
  flushSync(() => {
    createRoot(host).render(
      <div className="wrap">
        <PageRenderer blocks={project.blocks} typography={withSiteFont(project.typography)} title={project.title} fonts={fonts} />
      </div>
    );
  });
  document.body.classList.add('cms-home');
  document.title = `${project.title} | Samuel Prah`;
  if (project.summary) document.querySelector('meta[name="description"]')?.setAttribute('content', project.summary);
}
