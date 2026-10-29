import { render } from 'svelte/server';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });

export function renderPages() {
  return Object.entries(pages).map(([source, page]) => {
    const route = source.replace('/src/routes', '').replace('/+page.svx', '');
    const { body, head } = render(page.default);
    return { source, route, metadata: page.metadata, body, head };
  });
}
