// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ioanaorca.com',
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    // Display/headings. Instrument Serif ships a single weight; the italic is
    // load-bearing here (brand uses it for emphasis), so both styles are needed.
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--internal-font-display',
      weights: [400],
      styles: ['normal', 'italic'],
      fallbacks: ['serif'],
    },
    // Body/UI. Variable font — the brand caps usage at 300-600, so only that
    // range is downloaded rather than the full 100-900.
    {
      provider: fontProviders.google(),
      name: 'Work Sans',
      cssVariable: '--internal-font-body',
      weights: ['300 600'],
      styles: ['normal'],
      fallbacks: ['sans-serif'],
    },
  ],
});
