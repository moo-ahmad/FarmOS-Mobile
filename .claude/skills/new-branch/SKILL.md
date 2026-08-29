---
name: new-branch
description: Switch to master, pull the latest changes, and create/checkout a new branch off it. Use when the user asks to start a new feature or bug fix and wants a fresh branch off master (e.g. "/new-branch fix/login-crash", "start a new branch called feature/x").
---

# New Branch

Starts new work cleanly off the latest `master`.

## Steps

1. Determine the branch name from the argument passed to this skill. If none was given, ask the user for one.
2. Run `git status` to check for uncommitted changes.
   - If there are uncommitted changes, do NOT discard them. Ask the user whether to stash them (`git stash push -u`), commit them, or abort — unless the user has already told you what to do with them.
3. Run:
   ```bash
   git checkout master
   git pull origin master
   ```
   - If `master` isn't the right base branch name for this repo (e.g. it's `main`), use that instead.
   - If `git pull` fails (diverged history, conflicts), stop and report the exact error to the user instead of forcing anything.
4. Create and switch to the new branch off the now-updated master:
   ```bash
   git checkout -b <branch-name>
   ```
   - If a branch with that name already exists locally, ask the user whether to check it out, delete-and-recreate it, or pick a different name — never silently overwrite an existing branch.
5. Confirm to the user: the branch created and that it's based on the latest master (mention the commit or note if the pull was already up to date).

Do not push the new branch or open a PR — this skill only sets up the local branch to start work on.
