# Plan: Nib Extraction via GitHub Action Auto-Sync

## Overview

Nib (`src/lib/engine/`) is a generic, reusable Ink+Svelte 5 runtime — 3 files, 254 lines of TypeScript, zero game imports. All development continues inside The Work. A GitHub Action automatically syncs engine changes to a separate `nib` repository on every push to `main`.

## How It Works

A workflow (`.github/workflows/sync-nib.yml`) triggers on pushes to `main` that touch `src/lib/engine/**`. It copies the engine files to the `nib` repo's `src/lib/` directory using `cpina/github-action-push-to-another-repository`.

The Nib repo has its own packaging scaffolding (`package.json`, `index.ts`, configs) that the sync never overwrites — only `story.svelte.ts` and `tags.ts` are synced.

## Setup Steps (one-time, manual)

1. Create the `nib` repo on GitHub
2. Set up the repo skeleton (package.json, svelte.config.js, vite.config.ts, tsconfig.json, src/lib/index.ts)
3. Create a GitHub PAT with `repo` scope
4. Add it as `NIB_SYNC_TOKEN` in The Work's repository secrets (Settings → Secrets → Actions)
5. Merge the sync workflow to `main`

## Nib Repo Structure

```
nib/
├── src/lib/
│   ├── index.ts              # Re-exports public API (lives only in nib)
│   ├── story.svelte.ts       # ← synced from The Work
│   └── tags.ts               # ← synced from The Work
├── package.json              # @sveltejs/package build config
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── README.md
├── LICENSE
└── .gitignore
```

## Verification

- Change a file in `src/lib/engine/`, push to `main` → sync workflow triggers → change appears in `nib` repo
- Push a change outside `src/lib/engine/` → workflow does not trigger
