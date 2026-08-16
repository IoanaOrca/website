/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  singleAttributePerLine: true,
  // tailwindcss must be last — it reorders classes and expects to run after
  // other plugins have finished formatting.
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/global.css',
};
