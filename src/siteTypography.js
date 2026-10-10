const SITE_FONT = '"Schibsted Grotesk", sans-serif';

/** Pages that keep the default fonts inherit the portfolio's own font instead of the browser default. */
export const withSiteFont = (t) =>
  t && {
    ...t,
    headingFont: !t.headingFont || t.headingFont === 'sans-serif' ? SITE_FONT : t.headingFont,
    bodyFont: !t.bodyFont || t.bodyFont === 'sans-serif' ? SITE_FONT : t.bodyFont,
  };
