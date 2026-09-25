# Test suite

## Install

- Install Node.js 24, which is recorded in `.nvmrc` and declared in `package.json`. npm only warns on a mismatch because `engine-strict` is not set; the version is not enforced.
- Run `npm ci` to install the pinned development-only test dependencies from `package-lock.json`.
- Install the browsers once:
  - Windows: `npx playwright install chromium firefox webkit`
  - Linux: `npx playwright install --with-deps chromium firefox webkit`
- The published site remains plain HTML, CSS and JavaScript. None of these packages are served to visitors and there is no production build step.

## Commands

- `npm run lint` checks shared JavaScript, `scripts/`, test code and all CSS.
- `npm run test:static` checks every published HTML file (pages, the CV document and the redirects) for front matter, metadata, shared shell, status link, HTML validity, local references, image contracts and consistent JSON-LD. `tests/static/content-contracts.test.mjs` adds the content rules: date attributes and record slugs, review dates on every school-year mention, Now-section dates, the banned-word list, at most one “passionate”, and no draft placeholders once `CNAME` is `thomaswhite.me`. It also exercises the clean-URL test server and the content-review script.
- `npm run test:e2e` runs the deterministic Playwright suite in Chromium desktop and phone modes, Firefox, WebKit, reduced-motion mode and no-JavaScript mode. `tests/e2e/navigation.spec.mjs` covers the priority-plus navigation at 1025 to 1440 pixels with and without JavaScript; `pages.spec.mjs` also covers the CV document and the two redirects.
- `npm run test:visual` compares the eight committed Win32 visual baselines.
- `npm run test:visual:update` deliberately replaces those baselines after a reviewed visual change. Run this on Windows, inspect every changed PNG and commit only intended differences. Without a Windows machine, run the **Update visual baselines** workflow from the Actions tab on your branch (never `main`); it runs the same command on `windows-latest` and commits any changed baselines back to that branch.
- `npm run test:lighthouse` runs three local audits each for the homepage, Programming, Physics & Ideas, Blog, Gallery and Contact. The median gates are 85 performance, 95 accessibility, 90 best practices and 95 SEO.
- `npm run test:production` makes read-only checks against every published page, the two redirects, the `/gravatar/` short link and `https://status.thomaswhite.me/`. It checks the host named in `CNAME` (`thomaswhite.me` in the main repository, `new.thomaswhite.me` in the preview clone); set `PRODUCTION_BASE_URL` to check another host.
- `npm run test:external-links` makes read-only reachability checks against published external links and the `/gravatar/` target.
- `npm run review:content` lists copy due for a re-read (see `AGENTS.md`, date attributes). Add `-- --today=YYYY-MM-DD` to simulate a date. It prints nothing when nothing is due.
- `npm run list:drafts` lists every `data-draft` placeholder with its file, line and record slug. It must print nothing before a merge into the main repository.
- `npm run build:cv` prints `/cv/` to `Tom-White-CV.pdf` with Playwright Chromium. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use a different Chromium.
- `npm test` runs lint, static checks and the deterministic browser suite.
- `npm run check` adds visual regression and Lighthouse checks to `npm test`.
- `npm audit --audit-level=high` checks the development toolchain for known high or critical advisories.

## Test boundaries

- Deterministic browser tests replace CookieYes, Formspree, reCAPTCHA, Google Analytics and YouTube network requests, and pin the `Last-Modified` header of every page response so the footer date is fixed. They do not send contact messages or analytics events.
- The contact form suite tests local validation, spam handling, success, failure, reset and retry views with a stubbed Formspree response. A real Formspree or reCAPTCHA submission remains a deployed-site manual check.
- The clean-URL server strips the three-line YAML front matter in memory and maps `/example/` to `example.html`. It models GitHub Pages routing and contains no Vercel behavior.
- Production and external-link checks require internet access and can fail because of DNS, provider downtime, bot blocking or rate limits. They retry transient failures and never submit forms or mutate remote state.
- Browser failure videos, screenshots and traces are local artefacts under `test-results/`; CI retains failure artefacts for seven days.

## CI policy

- `.github/workflows/ci.yml` runs on pull requests, pushes to `main` and manual dispatch. It does not deploy or mutate the site.
- `.github/workflows/production-checks.yml` runs daily at approximately 06:15 UTC. External links run on Monday and on manual dispatch.
- `.github/workflows/content-review.yml` runs at 07:00 UTC on the 1st of each month and on manual dispatch (optionally with a simulated date). It needs `issues: write` and opens one “Content review: <Month Year>” issue, or updates the open one; it does nothing when nothing is due.
- `.github/workflows/update-visual-baselines.yml` runs only on manual dispatch, refuses to run on `main`, and pushes a commit to the dispatched branch when baselines change. A commit pushed by the workflow does not start the test suite by itself; dispatch **Test suite** on the branch, or push the next change, so the new baselines are checked. Pull the commit and inspect every changed PNG before merging.
- There is deliberately no branch-protection requirement. A direct push to `main` can therefore be published before CI finishes. The safe local sequence is `npm ci`, `npx playwright install chromium firefox webkit`, `npm run check`, then `git push`.

## Related

- `docs/updating-tests-and-baselines.md` explains which of these checks and which visual baselines a given change has to update, and which it does not.
