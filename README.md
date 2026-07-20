# Pegasus Aviation Advisors

Static Astro website for Pegasus Aviation Advisors. It uses the content, images and colours from the former Squarespace sites with a new responsive design.

## Requirements

- Node.js 22.12 or newer
- pnpm 11

## Local development

```sh
pnpm install
pnpm dev
```

The local site is available at <http://localhost:4321>.

Create a production build with:

```sh
pnpm build
```

The generated static site is written to `dist/`.

## Structure

- `src/pages/` contains all routes
- `src/components/` contains shared page sections
- `src/layouts/` contains the shared page layout
- `src/data/content.json` contains migrated Squarespace content
- `src/data/site.ts` contains the visible team and project structure
- `src/styles/global.css` contains the design system and responsive styles
- `public/assets/migrated/` contains local copies of all migrated images
- `scripts/` contains the migration and image optimisation tools
- `migration/` contains the migration report and asset manifest

## Squarespace migration

The first migration used the WordPress XML export and public Squarespace sitemap. It imported 79 content items and downloaded 188 assets without a Squarespace API key.

Run the migration with an export path:

```sh
SQUARESPACE_EXPORT=/absolute/path/to/export.xml pnpm migrate
pnpm optimize
```

The migration script downloads referenced Squarespace CDN files and rewrites content to local asset paths. The optimisation step converts suitable images to WebP and limits large images to 2400 pixels.

The migration is deterministic and skips assets that already exist. Review `migration/report.json` after each run.

## Formspree contact form

The contact page submits to the existing Formspree `contact` form. Server-side validation and the notification recipient are declared in `formspree.json`. The visitor email field is named `email`, so Formspree uses it as the notification Reply-To address.

To deploy Formspree configuration changes locally, provide `FORMSPREE_DEPLOY_KEY` in the environment and run:

```sh
npx --yes @formspree/cli@0.9.6 deploy --skip-version-check
```

The GitHub Pages workflow deploys `formspree.json` automatically using the `FORMSPREE_DEPLOY_KEY` repository secret. The deploy key is a secret and must never be committed. The project ID embedded in the public form action is intentionally public. A newly added notification email must be verified from the message Formspree sends that address before delivery becomes active.

## GitHub Pages

`.github/workflows/deploy.yml` builds and deploys the static site when changes are pushed to `main`. Enable GitHub Pages with GitHub Actions as the source in the repository settings.

Set `SITE_URL` in the build environment only when deploying under a different public URL. The default is `https://www.pegasusaa.com`.

## Image credits

The homepage hero photo is by ClickerHappy via [Pexels](https://www.pexels.com/photo/silhouette-of-person-in-airport-227690/).
