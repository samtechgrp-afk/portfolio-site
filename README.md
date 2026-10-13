# Samuel Prah portfolio

Static portfolio plus per-project pages that are loaded from Supabase.

- `index.html`: the portfolio. Its "Projects" section lists published projects from Supabase (except `home`); every card opens `/work/<slug>`.
- `src/home.js` + `src/home-render.jsx`: the CMS home page. If a published project with the slug `home` has blocks, it replaces the default layout at `/`. The React renderer is only downloaded in that case. See the Home page notes below.
- `project.html` + `src/project.jsx`: the project page. It reads the slug from the URL, fetches the published project and renders its blocks with `PageRenderer`.
- `vercel.json`: rewrites `/work/:slug` to `project.html`.
- `src/components/builder/`, `src/components/typography.js` and `src/cms/lib/markdown.js`: a copy of the CMS's page renderer, widgets and font helpers. Do not edit them here. After changing them in the CMS repo, run `npm run sync -- ../portfolio-cms`. The script also copies `cms/lib/highlight.js` and the whole `widgets/` folder (including `HeroCarouselBlock.jsx` and `.css`).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

`/work/<slug>` only works on Vercel. Locally, open `http://localhost:5173/project.html?slug=<slug>` instead.

## Deploy

Push to `main`. Vercel builds with Vite and publishes automatically.

## Home page and fonts

- `/` asks Supabase for the published project with slug `home`. While it waits (2.5 seconds at most) the default layout stays hidden, so there is no flash of the wrong page. If the project is missing, a draft, empty, or the request fails, the default layout is shown.
- In CMS-home mode the menu links are hidden (they point at default-layout sections) and the contact section at the bottom stays. Use Menu Anchor and Button blocks for your own navigation.
- Fonts come from the CMS font library (table `fonts`, files in the `fonts` storage bucket). `src/supabase.js` `fetchFonts()` reads the library, and `PageRenderer` loads only the fonts a page uses via `injectFontFace(name, url, format, { weight, style })`, with a preload link. If the library can't be reached, the page still renders with fallback fonts.
- Blocks marked hidden in the CMS are not rendered. Buttons and carousel items can link to `/work/:slug`, a project's live site, or an anchor.
- A page that keeps the default fonts uses the portfolio's own font (Schibsted Grotesk).

## Notes

- Only projects with status **published** are visible to visitors. Drafts are hidden by row-level security in the database.
- The Supabase URL and publishable key in `src/supabase.js` and `index.html` are public by design. Never put a `service_role` key in this repo.
- Project fonts: if a project keeps the default fonts, it uses the portfolio's own font (Schibsted Grotesk).


## Home page from the CMS

If the CMS has a published project with slug `home`, `/` renders its blocks in place of the built-in layout (the built-in layout is the fallback). Menu links are rebuilt from the page's labelled Menu Anchor blocks. The Project grid block pulls published projects from Supabase. Re-sync shared code with `npm run sync -- ../portfolio-cms`.
