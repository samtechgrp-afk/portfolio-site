import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './project.css';
import PageRenderer from './components/builder/PageRenderer.jsx';
import { fetchProject } from './supabase.js';
import { withSiteFont } from './siteTypography.js';

const EMAIL = 'muelprah@gmail.com';

/** /work/my-slug (production) or /project.html?slug=my-slug (local dev). */
function readSlug() {
  const fromQuery = new URLSearchParams(window.location.search).get('slug');
  const fromPath = window.location.pathname.match(/^\/work\/([^/]+)/)?.[1];
  let slug = fromQuery || fromPath || '';
  try { slug = decodeURIComponent(slug); } catch { slug = ''; }
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ? slug : '';
}

const http = (u) => /^https?:\/\//i.test(u || '');
const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

function TopBar() {
  return (
    <header className="bar">
      <div className="wrap">
        <a className="brand" href="/">Samuel Prah</a>
        <nav aria-label="Primary">
          <a href="/#projects">All work</a>
          <a href="/#about">About</a>
        </nav>
        <a className="btn fill" href={`mailto:${EMAIL}?subject=Project%20enquiry`}>Hire me</a>
      </div>
    </header>
  );
}

function Message({ title, children }) {
  return (
    <div className="work__msg" role="status">
      <h1>{title}</h1>
      {children}
    </div>
  );
}

// The home page lives at "/", not under /work.
const slugAtStart = readSlug();
if (slugAtStart === 'home') window.location.replace('/');

function App() {
  const slug = slugAtStart;
  const [state, setState] = useState({ status: slug ? 'loading' : 'missing', project: null });

  const load = useCallback(() => {
    if (!slug) return;
    setState({ status: 'loading', project: null });
    fetchProject(slug)
      .then((project) => setState(project ? { status: 'ok', project } : { status: 'missing', project: null }))
      .catch(() => setState({ status: 'error', project: null }));
  }, [slug]);

  useEffect(load, [load]);

  const { status, project } = state;
  useEffect(() => {
    if (status !== 'ok') { document.title = 'Project | Samuel Prah'; return; }
    document.title = `${project.title} | Samuel Prah`;
    if (project.summary) document.querySelector('meta[name="description"]')?.setAttribute('content', project.summary);
  }, [status, project]);

  const typography = project && withSiteFont(project.typography);

  return (
    <>
      <TopBar />
      <main className="work">
        <div className="wrap">
          <a className="work__back" href="/#projects">&larr; All work</a>

          {status === 'loading' && <p className="work__loading" role="status">Loading project</p>}
          {status === 'missing' && (
            <Message title="Project not found">
              <p>This project doesn't exist, or it hasn't been published yet.</p>
              <a className="btn fill" href="/#projects">See all work</a>
            </Message>
          )}
          {status === 'error' && (
            <Message title="Couldn't load this project">
              <p>Check your connection and try again.</p>
              <button type="button" className="btn fill" onClick={load}>Try again</button>
            </Message>
          )}

          {status === 'ok' && (
            <article>
              <header className="work__head">
                <h1>{project.title}</h1>
                {project.summary && <p className="work__summary">{project.summary}</p>}
                <div className="work__meta">
                  {project.categories?.map((c) => <span className="work__tag" key={c}>{c}</span>)}
                  <span className="work__date">{formatDate(project.created_at)}</span>
                </div>
                {http(project.live_url) && (
                  <a className="btn fill work__live" href={project.live_url} target="_blank" rel="noopener noreferrer">Visit live project</a>
                )}
              </header>

              {project.blocks?.length ? (
                <PageRenderer blocks={project.blocks} typography={typography} title={project.title} />
              ) : http(project.cover_url) ? (
                <img className="work__cover" src={project.cover_url} alt="" referrerPolicy="no-referrer" />
              ) : null}
            </article>
          )}
        </div>
      </main>

      <section className="contact">
        <div className="wrap">
          <h2>Let's make something good.</h2>
          <p>Send a brief, a deadline and a budget range. I reply within a day.</p>
          <div className="row">
            <a className="btn fill" href={`mailto:${EMAIL}?subject=Project%20enquiry`}>{EMAIL}</a>
            <a className="btn" href="/#projects">More work</a>
          </div>
        </div>
      </section>
      <footer><div className="wrap"><span>© 2026 Samuel Prah. All rights reserved.</span><span>No use of this work without permission from the owner.</span></div></footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
