# End-to-End Tests

Playwright suite exercising the deployed Duty Station Relocation SPA. Runs on
the dev server by default (`npm run dev` → `http://localhost:5173`). CI re-uses
the same configuration and also checks the mobile viewport (Pixel 5).

## Running locally

```sh
npm run test:e2e           # headless run, html report
npm run test:e2e:ui        # Playwright UI mode
npm run test:e2e:headed    # full browser with devtools
npm run test:e2e:report    # open the html report from the last run
```

A `baseURL` override is available:

```sh
PLAYWRIGHT_TEST_BASE_URL=https://deploy-preview-123--dutystation.netlify.app npm run test:e2e
```

## What these tests guard

- **Homepage smoke** — hero renders, search input works, suggestion list appears for a known station.
- **Directory smoke** — `/directory` loads, map canvas mounts, filters render.
- **Station detail smoke** — clicking a station in search navigates to the detail route and renders its header.
- **External link quality** — each station detail page surfaces the remediated/resolved URL, not the original broken one.
- **Accessibility** — `@axe-core/playwright` scans every tested route for critical/serious WCAG 2.1 AA violations.

## Known-failing a11y tests

Four WCAG 2.1 AA tests are currently marked `test.fixme()` because the routes
(`/directory`, `/station/:id`, `/compare`, `/data-sources`) have critical
`button-name` violations — unlabeled interactive controls. Homepage a11y
already passes. Fix the underlying issues and remove the `.fixme()` markers.

The homepage a11y test is strict and blocks on critical/serious violations.

## Adding a test

Use the shared helpers in `helpers.ts` when possible. Keep selectors accessible
(`getByRole`, `getByLabel`) — if a test needs a brittle CSS selector, the
underlying markup probably needs an `aria-label` or a semantic role instead.
