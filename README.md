# FarmOS Mobile

React Native (Expo) client for the FarmOS ASP.NET Core API. Offline-first, built
for low-end Android and one-handed data entry in the field.

- **Stack:** Expo SDK 57 · React Native 0.86 (New Architecture) · React 19 ·
  TypeScript (strict) · Expo Router · pnpm · Hermes
- Full stack rationale: [`docs/techstack.md`](docs/techstack.md)

## Prerequisites

- Node 20+ (developed on Node 24)
- pnpm 11 (`npm i -g pnpm` or Corepack)
- For device builds: Android Studio / Xcode toolchains, or use **EAS Build**

## Getting started

```bash
pnpm install
cp .env.example .env.development   # then fill in values
pnpm start                         # Expo dev server (Dev Client)
```

This project uses a **Dev Client** (not Expo Go) because of native modules. The
`android/` and `ios/` folders are not committed — they are generated on demand
via Continuous Native Generation:

```bash
pnpm prebuild        # expo prebuild
pnpm android         # build + run on a connected Android device/emulator
```

## Scripts

| Script                              | Purpose                           |
| ----------------------------------- | --------------------------------- |
| `pnpm start`                        | Expo dev server (Dev Client)      |
| `pnpm android` / `pnpm ios`         | Native build + run (`expo run:*`) |
| `pnpm typecheck`                    | `tsc --noEmit`                    |
| `pnpm lint` / `pnpm lint:fix`       | ESLint                            |
| `pnpm format` / `pnpm format:check` | Prettier                          |

Husky runs `lint-staged` (ESLint + Prettier) on commit.

## Configuration

Runtime config is environment-specific. `app.config.ts` loads `.env.<APP_ENV>`
(`development` / `preview` / `production`) and injects values into `expo.extra`;
the app reads them through `src/lib/config/env.ts` — never `process.env` at
runtime. Copy `.env.example` per profile. `.env*` files are gitignored.

## Project structure

```
src/
  app/         Expo Router routes (file-based, typed)
  components/  UI components
  hooks/       shared hooks
  constants/   theme + constants
  lib/         cross-cutting utilities (config, decimal, http)
  db/          SQLite + Drizzle schema/migrations   (Phase 2)
  sync/        offline outbox + /sync/batch engine  (Phase 2)
  api/         generated OpenAPI types + client      (Phase 3)
  features/    vertical feature slices               (Phase 5)
  i18n/        localization (en/ur, RTL)             (Phase 4)
  theme/       design tokens                         (Phase 4)
```

## Precision guardrail

Money and quantities use branded `Money` / `Quantity` types (decimal.js-light).
The custom ESLint rule `local/no-money-arithmetic` fails the build if you apply a
JavaScript arithmetic operator to either — use the decimal helpers instead.
Decimals are strings in transport and `TEXT` in SQLite.

## Build status

Phase 0 (scaffold, tooling, config, precision lint guard) is complete. Later
phases — offline data layer, API contract, UI kit, features, release pipeline —
are tracked in the project plan.
