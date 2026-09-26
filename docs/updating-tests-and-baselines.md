# Updating test checks and baselines

## Principle

- A check encodes a contract the site is expected to keep. Update it when the contract deliberately changes, never to make a red result go away.
- Every failure is one of two things: a real regression, which you fix in the site, or an intended change, which you fix in the check and explain in the commit message.
- Read what an assertion actually covers before assuming your change reaches it. Most content edits touch no assertion at all.

## Static contracts

`npm run test:static`

- `tests/support/page-manifest.mjs` pins every page's source file, clean path, `<title>`, `<h1>` and Better Stack keyword, plus `stylesheet` (default `/CSS/<source>.css`), `inNavigation` (default true; false for deep pages, posts and `/youtube/`) and the derived `monitored` flag. It also lists `documents` (the CV), `redirects` (old URL, target, heading) and `externalRedirects` (short URL, external target, heading). Update it when a page is added, removed, renamed, moved or re-titled, or when its `<h1>` changes. `site-contracts.test.mjs` fails immediately if any published HTML file, in any folder, is missing from the manifest.
- A `monitorKeyword` change is also a monitoring change. Update the Better Stack monitor and the table in `docs/status-page-operations.md` in the same change.
- The front matter, metadata, shared shell, status link, HTML validity, local-reference and JSON-LD checks are generic. They need no edit when a page follows `AGENTS.md`; a failure there means the page is wrong, not the test.
- `content-contracts.test.mjs` encodes the content strategy: fix the page (add the review date, the record slug or the Updated line), never the rule. Add a `### slug` to `docs/record.md` when a new record entry is needed. The draft check deliberately fails in the main repository while any `data-draft` remains.
- `media-assets.test.mjs` pins image contracts: `srcset` descriptors equal to intrinsic widths, dimension and deferred-loading consistency, gallery expansion sources below one megabyte, an eagerly loaded above-the-fold gallery image, and an `<img>` fallback in every `<picture>`. Satisfy these by adding the right derivatives, not by relaxing the test.

## Browser tests

`npm run test:e2e`

- Update these when behaviour changes: an initializer added or removed, a control renamed, a status message reworded, an interactive feature added to a page.
- Visible strings asserted by name are the usual breakage. The contact form's status text and accessible button names in `tests/e2e/interactions.spec.mjs` are matched by exact or substring text, so rewording them in `JS/script.js` or the markup means updating the assertion in the same change.
- `tests/e2e/pages.spec.mjs` iterates the manifest, so a new page gains shell, metadata and accessibility coverage as soon as the manifest lists it.
- `tests/e2e/navigation.spec.mjs` asserts the bar fits at 1025, 1060, 1100, 1140, 1280 and 1440 pixels. Changing a nav label or adding an item can require new no-JavaScript promotion widths in `general.css`; update the widths list when you move them.
- Tests tagged `@smoke`, `@desktop-only`, `@phone-only`, `@reduced-motion` and `@no-js` are selected by the project greps in `playwright.config.mjs`. Keep a tag attached when moving or renaming a test; the tag decides which projects run it.
- `tests/support/browser-fixtures.mjs` stubs CookieYes, Formspree, reCAPTCHA, Google Analytics and YouTube, and pins every page response's `Last-Modified` to `Mon, 31 Aug 2026 12:00:00 GMT`. Changing that fixture date changes the last-updated expectations and every visual baseline that shows the footer.

## Visual baselines

`npm run test:visual`

Eight baselines live in `tests/visual/site.visual.spec.mjs-snapshots/`, each suffixed `-visual-chromium-win32`.

| Baseline | What it captures |
| --- | --- |
| `home-desktop.png` | `/`, full page, 1440x900 |
| `home-phone-navigation.png` | `/`, viewport at 390x844 with the mobile menu open |
| `programming-desktop.png` | `/programming/`, full page, 1440x900 |
| `phone-compact-header.png` | `/programming/`, viewport at 390x844 after scrolling to `#projects`, with the compact corner menu button |
| `gallery-dialog.png` | `/gallery/`, viewport with the expanded-image dialog open |
| `contact-phone-validation.png` | the `.contact-form` element alone, at 390x844, after a rejected submit |
| `footer-status-desktop.png` | the `.footer-bottom` element, 1440x900 |
| `footer-status-phone.png` | the `.footer-bottom` element at 390x844 |

- A baseline needs regenerating only when the change alters pixels inside one of these regions.
- Three of the eight are clipped to a single element and ignore everything outside it. Contact page copy outside `.contact-form`, for example, is not captured by any baseline.
- `/` and `/programming/` are full-page captures, so any visible content change on those two pages requires a new baseline.
- A change to `CSS/general.css`, the header, navigation, footer, fonts or design tokens affects all eight.
- Which phases changed which baselines: every navigation or footer change touches all eight; homepage and Programming copy changes touch the two full-page captures; Contact copy outside the form touches none.
- Regenerate with `npm run test:visual:update` on Windows. The committed files carry the `win32` platform suffix, so a Linux or macOS run neither validates nor reproduces them; it looks for baselines that do not exist. CI runs this job on `windows-latest`.
- Without Windows, dispatch the **Update visual baselines** workflow on your branch. It runs the same command on `windows-latest` and commits changed baselines to that branch; pull and inspect them like any other baseline change.
- Inspect every changed PNG, commit only intended differences, and commit them alongside the change that caused them.

## Lighthouse budgets

`npm run test:lighthouse`

- `lighthouse.config.mjs` holds the audited URLs, the run count and the median gates. Add a URL when a new page deserves budget coverage.
- Lower a threshold only as a deliberate, recorded decision. A score that has fallen is a performance or accessibility regression to fix, not a number to move.

## Production and external-link checks

`npm run test:production`, `npm run test:external-links`

- Both follow the manifest and run against the deployed site, so they need no edit for a wording change. They need a deploy to have happened before they agree with the repository.
- Update the expectations when routing, DNS, the canonical domain or the status-page integration changes, and follow `docs/status-page-operations.md` for the monitoring side.

## Deciding in practice

1. Search the test tree for the strings on both sides of the change: `rg -n "old wording|new wording" tests/`.
2. Check whether the page's manifest entry (path, title, heading, keyword) still holds.
3. Ask whether the changed pixels fall inside one of the eight baseline regions listed above.
4. Run the affected suites before concluding anything. `npm run check` covers every deterministic suite; the production and external-link checks run separately.
5. Only then decide that an expectation itself is out of date.

## Worked examples

- Reword body copy on `/contact/` outside the form: no check changes. No test asserts that text and the contact baseline is clipped to `.contact-form`.
- Reword the homepage hero eyebrow: regenerate `home-desktop.png`, because `/` is captured full page.
- Rename a contact form field `id`: update `initialiseContactForm()`, the label, the e2e assertions and the integration notes in `AGENTS.md` together.
- Change a page's `<h1>`: update the manifest heading and keyword, the Better Stack monitor and the runbook table.
- Move or restyle the footer status link: expect the static status-link check, both footer baselines and the production check to be involved.

## Never

- Never edit an assertion only because it is failing.
- Never run `npm run test:visual:update` without reviewing each resulting PNG.
- Never skip, disable or delete a check to reach green.
- Never commit visual baselines produced on a platform other than Windows.
