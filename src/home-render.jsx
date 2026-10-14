import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import PageRenderer from './components/builder/PageRenderer.jsx';
import { collectMenuLinks, usesBlockType } from './components/builder/blockTree.js';
import { withSiteFont } from './siteTypography.js';
import { fetchFonts, fetchProjects } from './supabase.js';
import { siteSettings } from './siteSettings.js';

/** Replaces the top menu with links to the page's Menu Anchor blocks that have a menu label. */
function buildMenu(blocks) {
  const nav = document.querySelector('.bar nav');
  if (!nav) return;
  const links = collectMenuLinks(blocks);
  nav.replaceChildren(...links.map(({ id, label }) => Object.assign(document.createElement('a'), { href: `#${id}`, textContent: label })));
  nav.style.display = links.length ? '' : 'none';
}

/** Renders the CMS home page into #cms-home, builds the menu from it, and hides the default layout. */
export async function mountHome(project) {
  const host = document.getElementById('cms-home');
  // Fonts and the project list load in parallel. Either is [] if unreachable, and the page still renders.
  const [settings, fonts, projects] = await Promise.all([
    siteSettings,
    fetchFonts({ timeout: 2000 }),
    usesBlockType(project.blocks, 'projectgrid') ? fetchProjects({ timeout: 2000 }) : Promise.resolve([]),
  ]);
  flushSync(() => {
    createRoot(host).render(
      <div className="wrap">
        <PageRenderer blocks={project.blocks} typography={withSiteFont(project.typography)} title={project.title} fonts={fonts} projects={projects} siteIconUrl={settings.siteIconUrl || ''} />
      </div>
    );
  });
  // The hidden default layout has sections with the same IDs (about, motion, ...). Drop them so menu links reach the new page.
  document.querySelectorAll('#default-home [id]').forEach((el) => el.removeAttribute('id'));
  buildMenu(project.blocks);
  document.body.classList.add('cms-home');
  // Keep the site's own descriptive title unless the home page was given a custom one.
  if (project.title && project.title !== 'Home') document.title = `${project.title} | Samuel Prah`;
  if (project.summary) document.querySelector('meta[name="description"]')?.setAttribute('content', project.summary);
}
