

// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/ser';

export default defineConfig({
  output: 'server',
  adapter: vercel,
  integrations: [solid(), tailwind({ applyBaseStyles: true })],
});


