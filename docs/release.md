# Release & CI

## Continuous integration

`.github/workflows/ci.yml` runs on every PR and push to `master`: install,
`typecheck`, `lint`, `format:check`, `test` (both Jest projects), and an
**API-types drift check** (`pnpm api:generate` from the committed
`docs/openapi.json`, then `git diff --exit-code src/api/schema.d.ts`).

Refreshing the API contract from the live server is a deliberate step:

```bash
OPENAPI_SPEC=https://localhost:7229/openapi/v1.json NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm api:generate
# commit both docs/openapi.json and src/api/schema.d.ts
```

## Configuration in EAS

`.env.*` files are **not** committed, so cloud builds get their values from EAS:

- `APP_ENV` — set per profile in `eas.json`.
- `API_BASE_URL`, `SENTRY_DSN` — set as **EAS environment variables** per
  environment (`eas env:create`), or as secrets. `app.config.ts` reads them into
  `expo.extra`.

Required GitHub secret: **`EXPO_TOKEN`** (an Expo access token) for the release
and OTA workflows.

## Builds (EAS)

Profiles are defined in `eas.json` (`development` / `preview` / `production`).

```bash
eas build --profile preview --platform android      # internal APK
eas build --profile production --platform android    # store build (auto-increments)
```

CI triggers a production Android build automatically when a `v*` tag is pushed
(`.github/workflows/release.yml`).

> Note: `eas init` fails to read `app.config.ts` under TypeScript 6 (see the
> project memory); `eas build` / `eas config` are unaffected. The project is
> already linked, so `eas init` is not needed.

## OTA updates (EAS Update)

JS-only fixes ship without a store review. Channels match the build profiles;
`runtimeVersion` uses the `appVersion` policy (a native change requires a new
build).

Publish via the manually-dispatched `.github/workflows/ota-update.yml`, or:

```bash
APP_ENV=production eas update --channel production --message "Fix sync retry"
```

## Crash reporting

Sentry initialises only when `SENTRY_DSN` is set (no-op in local dev). For source
maps on native builds, add the `@sentry/react-native/expo` config plugin with
`SENTRY_ORG` / `SENTRY_PROJECT` and a `SENTRY_AUTH_TOKEN` secret.

## E2E

Maestro flows live in `.maestro/`. With a build installed on a 2–3 GB Android
device (the real target — not just an emulator):

```bash
maestro test .maestro
```

## Distribution

Google Play internal testing → production. TestFlight if/when iOS ships.
