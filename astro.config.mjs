// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ioanaorca.com',
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      // Required on purpose: the build should fail rather than ship a form
      // that posts nowhere.
      PUBLIC_SUBSCRIBE_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
        url: true,
      }),
    },
  },
  image: {
    // responsiveStyles defaults to false, and without it no scaling or
    // object-fit rules are emitted at all.
    layout: 'constrained',
    responsiveStyles: true,
  },
  fonts: [
    // The italic is a brand device, not emphasis — both styles are needed.
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--internal-font-display',
      weights: [400],
      styles: ['normal', 'italic'],
      fallbacks: ['serif'],
    },
    // Variable font: the brand caps usage at 300-600, so don't ship 100-900.
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
