// import { defineConfig } from 'astro/config';
// import solidJs from '@astrojs/solid-js';
// import tailwind from '@astrojs/tailwind';

// export default defineConfig({
//   integrations: [
//     solidJs(),
//     tailwind()
//   ],
// });

// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [solid(), tailwind({ applyBaseStyles: true })],
});


