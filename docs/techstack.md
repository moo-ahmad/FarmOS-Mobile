# FarmOS Mobile — Tech Stack

React Native client for the FarmOS ASP.NET Core API.

**Stack drivers:** offline-first is mandatory (no connectivity in the field), decimal precision cannot be compromised, low-end Android is the primary target device, and data entry happens one-handed outdoors.

---

## Core

| Layer           | Choice                                                                             | Notes                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Framework       | React Native 0.7x, New Architecture (Fabric + TurboModules) enabled                | Legacy arch is deprecated; start on New Arch or you'll migrate later                                             |
| Toolchain       | Expo SDK with a Dev Client (`expo prebuild`, bare workflow escape hatch available) | Managed workflow alone won't cover the native modules below; Dev Client gives Expo's tooling without the ceiling |
| Language        | TypeScript, `strict: true`, `noUncheckedIndexedAccess`                             | No `any`. Matches the API project's discipline                                                                   |
| Package manager | pnpm                                                                               |                                                                                                                  |
| Runtime         | Hermes                                                                             | Default; keep it — startup time matters on low-end Android                                                       |

## Navigation & state

| Concern      | Choice                                                 | Alternative considered                                                   |
| ------------ | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| Navigation   | Expo Router (file-based, built on React Navigation)    | React Navigation directly — fine, but Router's typed routes are worth it |
| Client state | Zustand                                                | Redux Toolkit — heavier than this app needs                              |
| Server state | TanStack Query v5 + `persistQueryClient` (MMKV-backed) | Query cache is _not_ the offline store — see below                       |
| Forms        | React Hook Form + Zod resolver                         | Zod schemas mirror the API's FluentValidation rules                      |

## Offline data layer — the critical decision

The app must be fully functional offline, not just cache-and-read. This is a local database with an outbox, not a request cache.

| Concern                  | Choice                                                  | Notes                                                                                                                  |
| ------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Local database           | SQLite via **op-sqlite**                                | Fastest RN SQLite binding, New Arch native. `expo-sqlite` is the lower-friction alternative if you stay closer to Expo |
| Query layer / migrations | **Drizzle ORM** (SQLite dialect)                        | Typed queries, real migration files. Schema mirrors the server's aggregates, not its full normalization                |
| Sync                     | Hand-rolled outbox against the API's `POST /sync/batch` | Every mutation writes locally, then enqueues an operation row with a client-generated UUID                             |
| UUIDs                    | `react-native-uuid` (v7 preferred for index locality)   | Maps to the server's `PublicId`; generated on-device before the row is ever sent                                       |
| Connectivity             | `@react-native-community/netinfo`                       | Drives flush triggers and sync-status UI                                                                               |
| Background flush         | `expo-background-task` + `expo-task-manager`            | Best-effort on both platforms; foreground flush on app resume is the reliable path                                     |
| Fast KV                  | `react-native-mmkv`                                     | Session state, last-used defaults, query cache persistence                                                             |

**Rejected:** WatermelonDB (its sync protocol assumes a server built around it, and New Arch support has lagged), PowerSync/RxDB (excellent, but they want to own the backend contract — the API already defines `/sync/batch`).

## Numeric precision — non-negotiable

| Concern            | Choice                                            | Notes                                                                                                                      |
| ------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Money & quantities | **decimal.js-light**                              | JavaScript `number` is IEEE-754. `0.1 + 0.2` is not `0.3`. The API enforces `decimal(18,2)`; the client must not undo that |
| Transport          | Decimals serialized as **strings** end to end     | Never let a monetary or quantity value pass through `JSON.parse` as a float                                                |
| SQLite storage     | Money and quantities stored as `TEXT`, not `REAL` | SQLite `REAL` is a double — same problem                                                                                   |

Enforce with a lint rule banning arithmetic operators on any value typed as `Money` or `Quantity`.

## UI

| Concern       | Choice                                                        | Notes                                                                                                                                 |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Styling       | NativeWind v4 (Tailwind for RN)                               | Fast to build a constrained token set; `react-native-unistyles` is the perf-first alternative                                         |
| Components    | In-house kit on top of primitives                             | 48px minimum tap targets and numeric-keypad-by-default are project requirements, not library defaults — a generic kit fights you here |
| Lists         | `@shopify/flash-list`                                         | Attendance grids and activity logs get long                                                                                           |
| Animation     | `react-native-reanimated` v3 + `react-native-gesture-handler` | Peer dependency of most of the above anyway                                                                                           |
| Bottom sheets | `@gorhom/bottom-sheet`                                        |                                                                                                                                       |
| Icons         | `lucide-react-native`                                         |                                                                                                                                       |
| Charts        | `react-native-gifted-charts`                                  | Lightweight; Victory Native XL if you need more                                                                                       |
| Haptics       | `expo-haptics`                                                | Confirmation feedback matters when the screen isn't being watched                                                                     |

## Device capabilities

| Concern           | Choice                                                                                |
| ----------------- | ------------------------------------------------------------------------------------- |
| Camera            | `react-native-vision-camera` (or `expo-camera` if VisionCamera is more than you need) |
| Image compression | `expo-image-manipulator` — resize before queuing; field uploads are on 3G             |
| Image caching     | `expo-image`                                                                          |
| GPS / geotagging  | `expo-location` — attached to scouting photos and field boundary capture              |
| File system       | `expo-file-system` — pending photo queue lives on disk, not in SQLite                 |
| Barcode / QR      | `expo-barcode-scanner` — tree tags, produce lot labels                                |

## Platform services

| Concern             | Choice                                                        | Notes                                                                                                    |
| ------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Auth storage        | `expo-secure-store` (Keychain / Keystore)                     | JWT + refresh token. Never MMKV or AsyncStorage for tokens                                               |
| HTTP                | `ky` (or plain `fetch` with a wrapper)                        | Interceptors for JWT refresh, `X-Farm-Id`, retry with backoff                                            |
| API types           | `openapi-typescript` generated from the .NET OpenAPI document | Regenerate in CI; drift between client and API becomes a build error                                     |
| Push notifications  | `expo-notifications` + FCM                                    | Backed by the server's reminder engine                                                                   |
| Localization        | `i18next` + `react-i18next` + `expo-localization`             | English and Urdu, with RTL layout support                                                                |
| Dates               | `date-fns` + `@date-fns/tz`                                   | Store UTC, display in the farm's timezone. Mirror the API's `ClientCreatedAtUtc` vs `CreatedAtUtc` split |
| Crash & performance | Sentry (`@sentry/react-native`)                               | Offline sync bugs are invisible without breadcrumbs                                                      |
| OTA updates         | EAS Update                                                    | Ship a sync fix without a store review — worth a lot for a field app                                     |

## Build & release

| Concern      | Choice                                                                |
| ------------ | --------------------------------------------------------------------- |
| Builds       | EAS Build (`development` / `preview` / `production` profiles)         |
| Distribution | Google Play internal testing → production; TestFlight if iOS is added |
| Config       | `expo-constants` + `.env` per profile via `app.config.ts`             |
| Signing      | EAS-managed credentials                                               |

## Quality

| Concern                    | Choice                                                             |
| -------------------------- | ------------------------------------------------------------------ |
| Unit tests                 | Jest + React Native Testing Library                                |
| Sync & decimal logic tests | Plain Jest, no RN runtime — this is where the real bugs live       |
| E2E                        | Maestro (lower setup cost than Detox)                              |
| Lint / format              | ESLint (typescript-eslint, `eslint-plugin-react-hooks`) + Prettier |
| Pre-commit                 | Husky + lint-staged                                                |
| CI                         | GitHub Actions → typecheck, lint, test, EAS build on tag           |

## Repository

Standalone repo (`farmos-mobile`), consuming generated API types as a versioned artifact. A monorepo with the .NET solution buys little here — there's no shared runtime code across C# and TypeScript, only the OpenAPI contract.

## Minimum targets

- Android 8.0 (API 26) — covers the low-end device base
- iOS 15.1 — only if iOS ships
- Android-first: test on a 2–3 GB RAM device, not an emulator on a workstation
