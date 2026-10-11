// Copies the shared page renderer from the CMS repo so both sites render pages identically.
// Usage: npm run sync -- ../portfolio-cms
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const cms = process.argv[2] || '../portfolio-cms';
const SHARED = [
  'src/components/typography.js',
  'src/components/builder/PageRenderer.jsx',
  'src/components/builder/WidgetRegistry.jsx',
  'src/components/builder/blockTree.js',
  'src/components/builder/icons.jsx',
  'src/components/builder/page.css',
  'src/components/builder/widgets',
  'src/cms/lib/markdown.js',
  'src/cms/lib/highlight.js',
];

if (!existsSync(join(cms, 'src'))) { console.error(`Can't find the CMS repo at ${cms}. Pass its path: npm run sync -- ../portfolio-cms`); process.exit(1); }
for (const file of SHARED) {
  mkdirSync(dirname(file), { recursive: true });
  cpSync(join(cms, file), file, { recursive: true });
  console.log('synced', file);
}
