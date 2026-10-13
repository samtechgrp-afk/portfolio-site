const HEADING = '"Bricolage Grotesque", "Schibsted Grotesk", sans-serif';
const BODY = '"Inter", system-ui, sans-serif';

/** Pages that keep the default fonts inherit the portfolio's own fonts instead of the browser default. */
export const withSiteFont = (t) =>
  t && {
    ...t,
    headingFont: !t.headingFont || t.headingFont === 'sans-serif' ? HEADING : t.headingFont,
    bodyFont: !t.bodyFont || t.bodyFont === 'sans-serif' ? BODY : t.bodyFont,
  };
