import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, relative } from 'node:path';
import { renderPages } from '../.build/render-entry.js';

const manifest = JSON.parse(readFileSync('rendered/.vite/manifest.json', 'utf8'));
const client = manifest['scripts/client-entry.js'];
const css = [...new Set(Object.values(manifest).flatMap((entry) => entry.css ?? []))];
const pages = renderPages();
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

for (const { route, body, head } of pages) {
  const file = `rendered${route}/index.html`;
  mkdirSync(dirname(file), { recursive: true });
  const asset = (path) => relative(dirname(file), `rendered/${path}`);
  // Use relative links so the committed artifact also works as a static file tree.
  const links = body.replace(/href="(\/kb(?:\/[^"#?]*)?)(#[^"]*)?"/g, (_, href, hash = '') =>
    `href="${relative(dirname(file), `rendered${href}/index.html`) || 'index.html'}${hash}"`);
  writeFileSync(file, `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${head}${css.map((path) => `<link rel="stylesheet" href="${asset(path)}">`).join('')}</head><body data-route="${escape(route)}"><div id="app">${links}</div><script type="module" src="${asset(client.file)}"></script></body></html>\n`);
}

writeFileSync('rendered/index.html', '<!doctype html><html lang="en"><meta charset="utf-8"><title>Support KB</title><a href="kb/incidents/4471-split/index.html">Read the #4471 split</a></html>\n');
writeFileSync('rendered/render-info.json', JSON.stringify({
  renderedAt: new Date().toISOString(),
  method: 'Svelte 5 server render of mdsvex pages, supplied layout and data components; client hydration included',
  pages: pages.map(({ route, source }) => ({ route, source, artifact: `${route.slice(1)}/index.html` })),
}, null, 2) + '\n');
console.log(`Rendered ${pages.length} actual KB pages, with interactive client assets (${readdirSync('rendered/assets').length} assets).`);
