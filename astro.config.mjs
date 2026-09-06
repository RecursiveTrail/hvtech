// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isGitHubPages = Boolean(process.env.GITHUB_ACTIONS);

export default defineConfig({
  site: isGitHubPages ? 'https://recursivetrail.com' : 'https://hvtech.co',
  // Org Pages serve this repo at /hvtech/. Custom domain hvtech.co uses `/` — drop the base when DNS cuts over.
  base: isGitHubPages ? '/hvtech/' : '/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
