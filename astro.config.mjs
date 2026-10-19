// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ahmadbayrakdar.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [
    react(),
    sitemap({ filter: (page) => !page.includes('/admin/') }),
  ],
  devToolbar: { enabled: false },
});
