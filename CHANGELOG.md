# Changelog

All notable changes to `@vaos/sdk` will be documented in this file.

## Unreleased

- Added Supabase-backed CI dogfood workflow to validate SDK behavior on DB-backed runtime.
- Added `scripts/ci/supabase-dogfood.ts` for repeatable integration validation.
- Added `scripts/ci/supabase-autonomy-schema.sql` bootstrap schema for CI/local runs.
- Added `npm run dogfood:supabase` and `@supabase/supabase-js` as a dev dependency.

## 0.2.1 - 2026-02-24

- Include built `dist/*` artifacts for Git-based package consumers.

## 0.2.0 - 2026-02-24

- Added `createInMemoryDakRuntime` helper for standalone usage.
- Added `runTickWithReceipt` and `verifyStreamReceipt` helpers.
- Added standalone docs, tests, examples, CI, and governance templates.

## 0.1.0 - 2026-02-24

- Initial runtime SDK package for VAOS autonomy services.
- Added `createDakRuntime` with typed runtime handles.
