# Curated Setups

This directory contains hand-authored Setup objects that ship with Armory. Each file exports a single `Setup`-typed constant named after the role it represents.

## Conventions

- One file per setup, named `<slug>.ts` (e.g. `marketing-manager.ts`).
- The exported constant is the camelCase role name suffixed with `Setup` (e.g. `marketingManagerSetup`).
- All fields must satisfy the `Setup` interface in `lib/setup/types.ts`.
- `source` is always `'curated'` and `reviewStatus` is `'approved'` for files in this directory.
- `instructionTemplate` uses Handlebars-style syntax: `{{variable}}`, `{{#if flag}}…{{/if}}`.

## Adding a new curated setup

1. Author the file following the pattern of `marketing-manager.ts`.
2. Add it to any relevant index or catalog once those modules exist.
3. Add a corresponding fixture export in `tests/fixtures/setups.ts` if downstream tests need it.
