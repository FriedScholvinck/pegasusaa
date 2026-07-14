# Pegasus Aviation Advisors

Static website for Pegasus Aviation Advisors. The site is plain HTML and CSS: there is no framework, package manager, or build step.

## Structure

- `index.html` — Home page
- `team.html` — Team page
- `projects.html` — Projects page
- `news-articles.html` — News & Articles page (added in a later step)
- `contact.html` — Contact page (added in a later step)
- `css/styles.css` — Shared design tokens and site styles
- `assets/` — Images and other static assets

## Shared page chrome

GitHub Pages serves these files directly and does not provide server-side includes. The `<header class="site-header">` and `<footer class="site-footer">` blocks in `index.html` are therefore the canonical copies. Duplicate those blocks verbatim on every page. When navigation, contact details, or footer links change, update the same markup on every HTML page.

## Serve locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Links to pages scheduled for later implementation will return 404 until those pages land.
