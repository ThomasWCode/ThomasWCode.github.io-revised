# Test suite

## Install

- Install Node.js 24, which is recorded in `.nvmrc` and declared in `package.json`. npm only warns on a mismatch because `engine-strict` is not set; the version is not enforced.
- Run `npm ci` to install the pinned development-only test dependencies from `package-lock.json`.
- Install the browsers once:
  - Windows: `npx playwright install chromium firefox webkit`
  - Linux: `npx playwright install --with-deps chromium firefox webkit`
- The published site remains plain HTML, CSS and JavaScript. None of these packages are served to visitors. The only production build is thomaswhite.me's `.github/workflows/pages.yml`: GitHub's Jekyll build, then drafts left out (`scripts/drafts.mjs`) and the CV's PDF printed again without them.

## Commands

- `npm run lint` checks shared JavaScript, `scripts/`, test code and all CSS.
- `npm run test:static` checks every published HTML file (pages, the CV document and the redirects) for front matter, metadata, shared shell, status link, HTML validity, local references, image contracts and consistent JSON-LD. `tests/static/content-contracts.test.mjs` adds the content rules: date attributes and record slugs, review dates on every school-year mention, Now-section dates, the banned-word list, at most one “passionate”, and well-formed drafts. `tests/static/drafts.test.mjs` covers leaving drafts out, and that only an attribute named `data-draft` marks one: never text in an attribute's value that mentions it, nor the editor's `data-draft-of`. When `CNAME` is `thomaswhite.me`, every check reads the pages as they will be live, with drafts left out, so a draft never breaks the live site's checks. It also exercises the clean-URL test server and the content-review script.
- `npm run test:e2e` runs the deterministic Playwright suite in Chromium desktop and phone modes, Firefox, WebKit, reduced-motion mode and no-JavaScript mode. `tests/e2e/navigation.spec.mjs` covers the priority-plus navigation at 1025 to 1440 pixels with and without JavaScript; `pages.spec.mjs` also covers the CV document and the two redirects.
- `npm run test:visual` compares the eight committed Win32 visual baselines.
- `npm run test:visual:update` deliberately replaces those baselines after a reviewed visual change. Run this on Windows, inspect every changed PNG and commit only intended differences. Without a Windows machine, run the **Update visual baselines** workflow from the Actions tab on your branch (never `main`); it runs the same command on `windows-latest` and commits any changed baselines back to that branch.
- `npm run test:lighthouse` runs three local audits each for the homepage, Programming, Physics & Ideas, Blog, Gallery and Contact. The median gates are 85 performance, 95 accessibility, 90 best practices and 95 SEO.
- `npm run test:production` makes read-only checks against every published page, the two redirects, the `/gravatar/` short link and `https://status.thomaswhite.me/`. It checks the host named in `CNAME` (`thomaswhite.me` in the main repository, `new.thomaswhite.me` in the preview clone); set `PRODUCTION_BASE_URL` to check another host. When the host checked is thomaswhite.me it also fails if a page holds a draft, which would mean the site was built without leaving them out.
- `npm run test:external-links` makes read-only reachability checks against published external links and the `/gravatar/` target.
- `npm run review:content` lists copy due for a re-read (see `AGENTS.md`, date attributes). Add `-- --today=YYYY-MM-DD` to simulate a date. It prints nothing when nothing is due.
- `npm run list:drafts` lists every draft (`data-draft`: placeholders to write, sentences to check, and `new`, `replace` and `remove` drafts) with its file, line, kind and record slug. Everything it lists stays off thomaswhite.me.
- `npm run build:cv` prints `/cv/` to `Tom-White-CV.pdf` with Playwright Chromium, as this checkout's site serves the page. `-- --live` prints it as thomaswhite.me serves it, drafts left out, and `-- --out <file>` writes somewhere else; the live site's build uses both. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use a different Chromium.
- `npm test` runs lint, static checks and the deterministic browser suite.
- `npm run check` adds visual regression and Lighthouse checks to `npm test`.
- `node scripts/audit.mjs` checks the development toolchain for known high or critical advisories with `npm audit`. It excuses an advisory only while the script lists it with a reason and npm audit finds no fix for it. The only one now is `braces` (GHSA-vfj7-8cjw-p6xm), which has no fixed release yet. Once a fix can be installed, the exception lapses and CI fails until the dependency is updated (`npm audit fix`, or `npm audit fix --force` when the fix lies outside a declared range) and the exception removed. An exception for an advisory npm audit no longer reports fails too, so none is left behind. GitHub auto-dismissed the braces alert as a development-only denial of service, so no Dependabot pull request will flag the fix; the lapse does. `tests/static/audit.test.mjs` covers these rules.
- `.github/dependabot.yml` asks Dependabot for routine version updates once a month, for releases at least a week old: one pull request for `@playwright/test`, one for the rest of the npm toolchain and one for the workflow actions. Security updates are not part of it: GitHub opens those as soon as an advisory is published. A Playwright update changes the browsers, so regenerate the visual baselines on its branch (`docs/updating-tests-and-baselines.md`) before merging.

## Test boundaries

- Deterministic browser tests replace CookieYes, Formspree, reCAPTCHA, Google Analytics and YouTube network requests, and pin the `Last-Modified` header of every page response so the footer date is fixed. They do not send contact messages or analytics events.
- The contact form suite tests local validation, spam handling, success, failure, reset and retry views with a stubbed Formspree response. A real Formspree or reCAPTCHA submission remains a deployed-site manual check.
- The clean-URL server strips the three-line YAML front matter in memory and maps `/example/` to `example.html`. It models GitHub Pages routing and contains no Vercel behavior. When `CNAME` is `thomaswhite.me` it also leaves drafts out, so the browser, visual and Lighthouse tests see the live pages; `startServer({ servedAs })` serves another site's view.
- Production and external-link checks require internet access and can fail because of DNS, provider downtime, bot blocking or rate limits. They retry transient failures and never submit forms or mutate remote state.
- Browser failure videos, screenshots and traces are local artefacts under `test-results/`; CI retains failure artefacts for seven days.

## CI policy

- `.github/workflows/ci.yml` runs on pull requests, pushes to `main` and manual dispatch. It does not deploy or mutate the site.
- `.github/workflows/pages.yml` publishes thomaswhite.me on every push to `main` in the main repository. It runs GitHub's Jekyll build, leaves drafts out, prints the CV's PDF again from the page without them, and deploys, in about four Linux minutes. It needs Settings → Pages → Source set to "GitHub Actions" there. In the preview repository it runs only by hand, and then builds without deploying, as a check.
- `.github/workflows/production-checks.yml` runs daily at approximately 06:15 UTC. External links run on Monday and on manual dispatch.
- `.github/workflows/content-review.yml` runs at 07:00 UTC on the 1st of each month and on manual dispatch (optionally with a simulated date). It needs `issues: write`. When something is due it opens a new “Content review: <Month Year>” issue (a second run in the same month leaves that month's issue as it is), then closes any other open review issue with a comment linking it, its body and ticked boxes untouched; it does nothing when nothing is due.
- `.github/workflows/update-visual-baselines.yml` runs only on manual dispatch, refuses to run on `main`, and pushes a commit to the dispatched branch when baselines change. A commit pushed by the workflow does not start the test suite by itself; dispatch **Test suite** on the branch, or push the next change, so the new baselines are checked. Pull the commit and inspect every changed PNG before merging.
- The browser editor (`https://edit.thomaswhite.me`, § Editor in `AGENTS.md`) commits to the `edits` branch and runs nothing on a save until its pull request is open; after that, every save runs this workflow again. At Publish it dispatches **Update visual baselines** on `edits` first when the homepage, Programming or Gallery changed, then opens the pull request, which starts this workflow; it dispatches **Test suite** itself only when the baseline commit moved an already-open pull request. One publish costs about 19 Windows-weighted minutes for the pull request, 19 more for the push to `main` and about 3 for Pages, plus about 4 with baselines.
- A ruleset protects `main` (Settings → Rules → Rulesets; the main repository has the same one): changes reach it only through a pull request, merged with a merge commit once "Static contracts and lint", "Browser and visual tests" and "Lighthouse budgets" have passed, and it can't be deleted or force-pushed. Nobody can bypass it. It requires no approving review, and must not: every pull request here is Tom's own, the editor's included, and GitHub doesn't let an author approve their own. Before pushing a branch, `npm ci`, `npx playwright install chromium firefox webkit` and `npm run check` catch most failures before CI does.

## Related

- `docs/updating-tests-and-baselines.md` explains which of these checks and which visual baselines a given change has to update, and which it does not.
