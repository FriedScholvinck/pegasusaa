# Pegasus Aviation Advisors

Static website for Pegasus Aviation Advisors. The site is plain HTML and CSS: there is no framework, package manager, or build step.

## Structure

- `index.html` — Home page
- `team.html` — Team page
- `projects.html` — Projects page
- `news-articles/index.html` — News index and eight static article pages
- `contact.html` — Contact page and Formspree enquiry form
- `css/styles.css` — Shared design tokens and site styles
- `assets/` — Images and other static assets

## Shared page chrome

GitHub Pages serves these files directly and does not provide server-side includes. The `<header class="site-header">` and `<footer class="site-footer">` blocks in `index.html` are therefore the canonical copies. Duplicate those blocks verbatim on every page. When navigation, contact details, or footer links change, update the same markup on every HTML page.

## Serve locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. The site has no build step or server-side runtime.

## Formspree contact form

`contact.html` submits to the `contact` form in the existing Formspree CLI project. Its server-side field validation and notification recipient (`jim@pegasusaa.com`) are declared in `formspree.json`; the visitor email field is named `email`, so Formspree uses it as the notification's Reply-To address.

To deploy Formspree configuration changes, provide `FORMSPREE_DEPLOY_KEY` in the environment and run:

```sh
npx @formspree/cli deploy
```

The deploy key is a secret and must never be committed. The project ID embedded in the public form action is intentionally public. A newly added notification email must be verified from the message Formspree sends that address before delivery becomes active.
