## Approach

Prefer the smallest thing that works. Add abstraction once something has
repeated, not in anticipation of it. If a smaller version of a change would do,
make that one and say what you left out.

- Check what the framework already gives you before overriding a default.
- Use the framework's own extension point rather than inventing one. Brand
  values belong in Tailwind's `@theme`, not in bespoke `@utility` blocks.
- Keep design guidelines in the brand doc. Don't enforce them by deleting
  utilities or otherwise constraining the tooling.
- Add tooling layers when there is code that needs them, not before.
- Comments explain why something non-obvious is the way it is. Default to none.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Linting and formatting

`npm run lint` (ESLint), `npm run format` (Prettier), `npm run check` (`astro check`).

**Do not upgrade `typescript` past 6.x.** TypeScript 7 is the current `latest` on
npm, but `typescript-eslint@8` refuses it and throws at import time
(`typescript-eslint does not support TS 7.0`), which takes out linting entirely.
The `^6` pin in `package.json` is deliberate — reject dependency bumps that
raise it until `typescript-eslint` supports TS 7.

ESLint runs without type-aware rules, so it will not catch bugs that type-check
cleanly (floating promises, misused promises). Type checking is `astro check`'s
job. To add those rules, swap `tseslint.configs.recommended` for
`recommendedTypeChecked` and give it a `parserOptions.project`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
