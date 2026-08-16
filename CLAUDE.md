# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bilingual (Thai/English) marketing + team-profile site for NavaLab, a maritime technology research
group. Astro 7 (static output) + Tailwind CSS 4. Content is edited either directly as files or
through Sveltia CMS at `/admin`, which commits straight to this repo.

## Commands

```
npm run dev              # dev server at localhost:4321
npm run build             # production build to dist/
npm run preview           # serve the production build locally
node scripts/generate-placeholders.mjs   # (re)writes ALL placeholder member/project/news
                                          # content — do NOT run once real content exists,
                                          # it overwrites src/content/** unconditionally
```

There is no lint or test script configured.

When starting the dev server, use background mode: `astro dev --background`. Manage it with
`astro dev stop`, `astro dev status`, and `astro dev logs`.

**Restart the dev server after:** editing `src/content/site/home.json` (the `file()` content
loader doesn't hot-reload like the `glob()` loader used for members/projects/news), or after any
`npm install`/`npm uninstall` (has caused the dev server's Sharp image-transform resolution to go
stale mid-session, producing "Could not find Sharp" 500s from `/_image` until restarted).

## Architecture

**i18n pattern**: every route exists twice — `src/pages/**` (Thai, default locale) and
`src/pages/en/**` (English) — but each pair of route files is a thin wrapper that just imports one
shared component from `src/views/*.astro` and passes `lang="th"` / `lang="en"`. All real markup
and logic lives in the view once; adding a page means adding both route files plus one view. UI
strings (nav labels, buttons, section headings — not content) live in `src/i18n/ui.ts` as a
`{th, en}` keyed dictionary via `useTranslations(lang)`.

**Content collections** (`src/content.config.ts`) are the single source of truth for data shape —
`members`, `projects`, `news` (glob-loaded Markdown under `src/content/<collection>/`) and `site`
(a `file()`-loaded singleton at `src/content/site/home.json`). Any schema field added here **must**
be mirrored in `public/admin/config.yml`, which defines the matching CMS form — they are two
independent definitions of the same shape and Zod will not catch a CMS config that's drifted out of
sync.

Almost every text field is `{ th: string, en: string }` (the `localized` Zod helper) — one entry
per person/project/article, not separate English/Thai files.

Non-obvious loader quirk: `file()` treats a flat top-level JSON object as one entry *per top-level
key*. `home.json` must stay wrapped as `{ "home": { ...fields } }`, not a bare object, or the
schema validates each field individually and fails.

**Fonts** (`src/styles/global.css`): import the full multi-script `@fontsource/*` weight files
(e.g. `600.css`), never the `thai-*.css` subset-only files — those exclude Latin glyphs entirely,
so any Latin text/brand name mixed into Thai copy (very common — "NavaLab" appears inside Thai
headings everywhere) silently falls back to the browser default font.

**`PortraitCutout.astro`** (`src/components/`) is the member-profile hero photo treatment: a hand-
placed cluster of SVG hexagons (navy→teal gradient, sweeping top-left to bottom-right) sits behind
a circular `object-contain` (not `cover`) crop of the photo — `contain` is deliberate so the crop
never cuts into the top of someone's head regardless of source photo proportions.

**Self-hosted deploy** (`deploy/`, `docker-compose.yml`, `Dockerfile`): no Netlify/Vercel. Five
services — `web` (nginx serving a shared volume), `builder` (clones/pulls the repo, builds, does an
atomic release-symlink swap — see `deploy/builder/rebuild.sh`), `webhook` (verifies GitHub's push
signature, triggers `builder`), `oauth` (self-hosted GitHub OAuth provider for the CMS login, since
Sveltia's hosted proxy assumes Cloudflare Workers), and `caddy` (reverse proxy + automatic TLS).
The atomic-swap symlink in `rebuild.sh` **must** stay a relative path — `builder` and `web` mount
the same named volume at different absolute paths, so an absolute symlink target resolves in one
container and silently breaks in the other. Full setup steps: `docs/DEPLOY.md`; CMS usage:
`docs/CMS-GUIDE.md`.
