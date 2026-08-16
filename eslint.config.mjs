import path from 'node:path';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  includeIgnoreFile(
    path.resolve(import.meta.dirname, '.gitignore'),
    'gitignore',
  ),

  js.configs.recommended,
  // Order matters: typescript-eslint sets a global parser, so astro must come
  // after it to claim .astro files. Reversed, every .astro fails to parse.
  tseslint.configs.recommended,
  astro.configs.recommended,
  prettier,
]);
