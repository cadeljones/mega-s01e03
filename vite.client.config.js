import { defineConfig, mergeConfig } from 'vite';
import base from './vite.config.js';

export default mergeConfig(base, defineConfig({
  base: './',
  build: {
    ssr: false,
    outDir: 'rendered',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: 'scripts/client-entry.js',
      output: { entryFileNames: 'assets/client.js' },
    },
  },
}));
