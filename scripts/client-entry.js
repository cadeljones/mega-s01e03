import { hydrate } from 'svelte';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
const route = document.body.dataset.route;
const page = pages[`/src/routes${route}/+page.svx`];
if (page) hydrate(page.default, { target: document.getElementById('app') });
