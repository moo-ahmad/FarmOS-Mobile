# FarmOS Mobile — session handoff

Paste this whole file as your first message in the new session (or just say
"read SESSION_HANDOFF.md and continue"). Delete it once the new session has
absorbed the context — it's a one-off handoff note, not permanent project docs
(those live in `AGENTS.md` / `CLAUDE.md`, which the new session will already
have).

## What this project is

React Native / Expo (SDK 57, RN 0.86, React 19, New Architecture) offline-first
farm-management app, built screen-by-screen against a design handoff at
`design_handoff_farmos_mobile/FarmOS Mobile (standalone).html` — a single
self-contained HTML file with pixel-accurate mockups of every screen, each
wrapped in an HTML comment like `<!-- ═══════ SCREEN NAME ═══════ -->`.
`design_handoff_farmos_mobile/modernist-tokens.css` and `README.md` are also
there but the standalone HTML is self-sufficient (own embedded `<style>`,
no external references) — that's the only file that gets replaced when the
design updates.

Repo root: `C:\dev\farmos` (moved from `Documents\React Native\FarmOS-Mobile`
specifically to shorten the path — Windows CMake has a build-path length
limit that broke native builds at the old location).

Full codebase conventions are in `AGENTS.md` (decimal precision rules, pnpm
setup, layout, UI kit) — read that too, it doesn't need restating here.

## Working pattern (established over many screens — follow this exactly)

1. **One screen per branch**, created fresh off an up-to-date `master`:
   `git checkout master && git pull && git checkout -b <screen-name>`.
2. **Extract exact markup before building.** Grep the standalone HTML for the
   screen's `<!-- ═══════ NAME ═══════ -->` comment and read the raw HTML/CSS
   between it and the next frame marker (Node one-liners with
   `html.indexOf(...)` / `html.slice(...)` work well — see any commit's diff
   for the pattern). Never guess pixel values, colors, or spacing when the
   source markup can be found. Map non-standard px values to the _nearest_
   existing Tailwind token in `tailwind.config.js` (documented precedent:
   12–13px → `caption`/`body`, 20–21px → `heading`, etc.) rather than adding
   new one-off tokens, unless a size is reused enough to earn one (e.g.
   `title-sm` was added for Crop P&L's 22px drill-in header).
3. **Reuse the existing `src/components/ui/` kit** (`Text` variants, `Tag`,
   `Banner`, `LevelBar`, `ProgressBar`, `AppHeader`, `Screen`, `Divider` /
   `Rule` / `TotalRule`, etc.) before building anything bespoke. Check it
   first — several screens (Inventory) turned out to need _zero_ new
   primitives because the right ones already existed.
4. **Money/Quantity are branded decimal types** (`src/lib/decimal/`) — never
   plain JS arithmetic on them (ESLint enforces this). For **display**,
   always use `formatMoneyDisplay()` (thousands separators, drops trailing
   `.00`) — not raw `moneyToString()`, which just returns the unformatted
   decimal string. This was a real bug found and fixed twice already
   (`cost-breakdown.tsx`, `net-cash-summary.tsx`) — check every new money
   display for it.
5. **Sample/fixture data** for anything without a real backend yet, in each
   feature's `fixtures.ts`, with a caveat comment pointing at
   `src/features/home/fixtures.ts` as the precedent. Where the mock's own
   numbers are shown, match them exactly; where more sample rows are needed
   than the mock shows, invent plausible ones consistent with the shown data.
   If a value in the mock isn't cleanly derivable from a formula (e.g.
   Inventory's stock-level bar widths didn't reduce to one consistent
   capacity formula), just store it as a raw fixture number — don't invent a
   fake formula to justify it.
6. **UI-first, persistence later** — confirmed explicitly by the user for
   Harvest/Expense/Attendance. Forms validate and call `onSaved()`/navigate
   back; no real SQLite writes yet unless a screen says otherwise.
7. **Verify once, at the end, batched** — not after every edit (explicit user
   correction earlier: re-running checks per-edit burns tokens). One pass:
   `pnpm format && pnpm typecheck && pnpm lint && pnpm test`, then
   `npx expo export --platform android --output-dir <temp-dir>` as a bundle
   sanity check (delete the temp dir after).
8. **Before committing**, run `git diff --stat` and only `git add` the files
   with _real_ diffs. This repo has `core.autocrlf=true` and no
   `.gitattributes`, so any file `pnpm format` touches shows as "modified" in
   `git status --short` even when `git diff` shows nothing (pure CRLF/LF
   churn) — don't stage or worry about those, just add the files that
   actually changed content.
9. **Commit, push the branch** — then **stop and ask** before merging.
   Only merge into `master` (`git checkout master && git pull && git merge
--no-ff <branch> -m "Merge branch '<branch>' into master" && git push
origin master`) when the user explicitly says so (e.g. "merge into
   master"). Same for moving to the next screen — several times the user has
   said "don't start the next screen before asking me"; treat that as
   standing instruction until told otherwise.
10. If the user reports a build error, **reproduce it directly first**
    (e.g. re-run the exact `gradlew.bat` command) before speculating — it's
    often transient (locked file, stale daemon) rather than a real regression.
    Full log > the truncated wrapper-exception paste a terminal shows by
    default.

## Screens built so far (all merged into `master`)

Login, Home, bottom nav, Fields, Reminders (Alerts tab), Log Activity (+
quick-capture chooser), Log Harvest, Log Expense, Log Attendance, Crop P&L
(reached via Home cycle rows and the Cycles tab — `src/app/(tabs)/crop-pnl/
[cycleId].tsx`), Inventory (Stock tab), Splash (shown via `FontGate`, held for
a minimum 5s so it doesn't flash by — see `src/components/font-gate.tsx`).

A placeholder (flagged "coming soon", not real design) still exists for
**Field Detail** (`src/app/(tabs)/field/[code].tsx`) — the design handoff
originally had no markup for it. **That has now changed** (see below).

## Not yet built — the design handoff was just updated with new screens

The user replaced `FarmOS Mobile (standalone).html` mid-session with a new
export containing many more frames. Full frame list as of the update (grep
`<!--\s*═+\s*(.+?)\s*═+\s*-->` over the file to re-enumerate if it's changed
again):

Already built and still present: Splash (+ a "Splash — Light" variant, which
is the one that got built — user chose light over dark), Home, Crop P&L (+ a
"Crop P&L — Timeline" variant not yet looked at), Reminders, Fields, Inventory,
Log Activity, Log Harvest, Log Expense, Log Attendance.

**New, not built yet** (this is the punch list — work through it one at a
time, asking before starting each and before merging each, per the pattern
above):

1. Log Sale
2. Receivables (List)
3. Record Receipt
4. Crop Cycles (List)
5. New Crop Cycle
6. Activities (History)
7. Activity Detail (+ a Void-dialog variant)
8. Expenses (List)
9. Expense Detail (+ a Void-dialog variant)
10. Allocation Split (Unbalanced + Balanced variants — likely the "Split" flow
    that Expense's form currently stubs with an `Alert.alert` placeholder)
11. Workers (List)
12. Add Worker
13. Pay Wages
14. Field Detail (+ a Deactivate-dialog variant) — replaces the existing
    placeholder at `src/app/(tabs)/field/[code].tsx`

The last confirmed instruction from the user was to summarize and start a
fresh session — no screen from this list has been started yet.

## Known gotchas

- **Windows CMake long-path build failures**: fixed by moving the repo to
  `C:\dev\farmos` and setting `nodeLinker: hoisted` in `pnpm-workspace.yaml`
  (pnpm 11 ignores `node-linker` in `.npmrc`/`package.json`).
- **`userInterfaceStyle` must stay `"light"`** in `app.json` — the Modernist
  design has no dark-mode variant; letting it follow the system theme made
  status-bar icons invisible before.
- **`android/` and `ios/` are gitignored** (Continuous Native Generation) —
  safe to `rm -rf android` and rebuild if the native shell ever gets into a
  bad state (this has happened twice, both times fixed this way).
- **Jest must stay on v29** (not v30 — incompatible with `jest-expo`).
  RNTL 14's `render` is async.
- **`eas-cli` can't read `app.config.ts` under TypeScript 6** — see the
  `eas-cli-typescript6-incompat` memory file if EAS commands are needed.

## Current git state

On `master`, clean (only CRLF-noise `git status` entries, no real diff),
fully up to date with `origin/master` at commit `ca324ea` as of this handoff.
No open feature branches waiting to be merged.
