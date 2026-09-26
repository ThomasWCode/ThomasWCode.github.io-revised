# Repository instructions

## Architecture

This repository contains the source for `thomaswhite.me`. The published site is a dependency-free, multi-page site built with HTML, CSS, and vanilla JavaScript. GitHub Pages processes YAML front matter in each HTML file to provide clean URLs. The npm packages and `scripts/` are development-only tools; do not introduce a production framework, runtime dependency or build step unless the task explicitly requires it. The planned exception is the Eleventy migration in `docs/content-strategy.md` §12, triggered when the Blog passes about eight posts or the site about fifteen pages, not before.

- `index.html` is the homepage; other root-level `.html` files are top-level pages. `physics/` and `blog/` hold deep pages and posts.
- `CSS/general.css` contains shared design tokens, layout, navigation (including priority-plus), footer, the overlay scrollbar, the shared components (§ Styling), responsive rules, and reduced-motion rules.
- `CSS/<page>.css` contains page-specific styles. `CSS/physics.css` serves both physics pages; `CSS/blog.css` serves the Blog index and every post.
- `JS/script.js` contains all shared behaviour.
- `Images/` contains originals/fallbacks, local videos, and `Images/optimized/` derivatives.
- `Fonts/` contains local Inter and Fraunces files and licences.
- `logo-text.png`, `favicon.ico`, and `favicon.png` are shared brand assets.
- `cv.html` is the unlinked source of `Tom-White-CV.pdf` (see § CV).
- `CNAME` sets the domain: `thomaswhite.me` in the main repository, `new.thomaswhite.me` in the preview clone.
- `_config.yml` excludes `docs/`, `tests/`, `scripts/`, `AGENTS.md` and the tooling from the published site. Jekyll renders Markdown even without front matter, so anything not excluded is public. Never remove the `docs/` exclusion: `docs/record.md` is private.
- `scripts/` holds the content review (`content-review.mjs`) and the CV build (`build-cv.mjs`).
- `tests/` contains static, browser, visual, Lighthouse and deployed-site checks.
- `docs/content-strategy.md` is the content, structure and voice plan; `docs/record.md` is Tom's private record of facts, dates and decisions; `docs/blog-sources/` holds post sources; `docs/implementation-notes.md` records what the strategy implementation changed and what is still to write. `docs/testing.md`, `docs/updating-tests-and-baselines.md` and `docs/status-page-operations.md` cover tests, baselines and monitoring. The browser editor for the site's text lives in its own repository (§ Editor).

## Page map

| Source | Public path | Stylesheet | In navigation |
| --- | --- | --- | --- |
| `index.html` | `/` | `CSS/index.css` | Yes |
| `programming.html` | `/programming/` | `CSS/programming.css` | Yes |
| `physics.html` | `/physics/` | `CSS/physics.css` | Yes |
| `physics/magnetic-newtons-cradle.html` | `/physics/magnetic-newtons-cradle/` | `CSS/physics.css` | No (under Physics & Ideas) |
| `volunteering.html` | `/volunteering/` | `CSS/volunteering.css` | Yes |
| `blog/index.html` | `/blog/` | `CSS/blog.css` | Yes |
| `blog/<slug>.html` | `/blog/<slug>/` | `CSS/blog.css` | No (under Blog) |
| `sport-music-and-drama.html` | `/sport-music-and-drama/` | `CSS/sport-music-and-drama.css` | Yes |
| `gallery.html` | `/gallery/` | `CSS/gallery.css` | Yes |
| `tedx.html` | `/tedx/` | `CSS/tedx.css` | Yes (in More) |
| `testimonials.html` | `/testimonials/` | `CSS/testimonials.css` | Yes (in More) |
| `contact.html` | `/contact/` | `CSS/contact.css` | Yes |
| `youtube.html` | `/youtube/` | `CSS/youtube.css` | No (linked from Programming) |
| `cv.html` | `/cv/` (unlinked, `noindex`) | `CSS/cv.css` | No |

Redirects: `sport.html` (`/sport/`) and `music&drama.html` (`/music&drama/`) are `noindex` pages with a meta refresh to `/sport-music-and-drama/#sport` and `#music`, a canonical link to the new page and a plain fallback link. Keep them while inbound links and old monitors may use the old URLs.

External redirect: `gravatar.html` (`/gravatar/`) is a `noindex` short link with a meta refresh, a canonical link and a plain fallback link to Tom's Gravatar profile, `https://gravatar.com/thomaswhiteuk`. If the profile URL changes, change all three, the manifest's `target` and every JSON-LD `sameAs` list together.

`tests/support/page-manifest.mjs` lists every published HTML file as a page, a document (`cv.html`), a redirect or an external redirect (`gravatar.html`). A static contract fails if a published HTML file is missing from it.

## Editing HTML

- Preserve YAML front matter as the first three lines:

  ```yaml
  ---
  permalink: /example/
  ---
  ```

- Pages with front matter pass through Jekyll's Liquid, so never write `{{` or `{%` in page text.
- When a page’s subject, title, summary, URL, or main image changes, update `<title>`, the meta description, canonical URL, Open Graph metadata, and JSON-LD together.
- Every JSON-LD `Person` (including post and article authors) uses the homepage's name, URL and `sameAs` list; a contract enforces it. Add LinkedIn to every `sameAs` list at once when it exists.
- Use absolute site paths beginning with `/`. Do not use filesystem paths or `file://` URLs.
- Load `CSS/general.css` before the page stylesheet.
- Keep `<script defer src="/JS/script.js"></script>` immediately before `</body>` on every page with the shared shell.
- Keep the skip link targeting `id="main-content"`.
- Apply `aria-current="page"` only to the current page’s navigation link. Deep pages mark their parent section's link with `aria-current="true"` instead.
- Preserve one `<h1>` and a logical `<h2>`/`<h3>` hierarchy.
- Use buttons for actions and links for navigation. Keep every control keyboard-operable.
- Retain existing visible wording unless the requested content change requires otherwise.
- Search every published HTML file (`rg -g "*.html"` covers the subfolders) before changing shared wording or markup.

## Voice and content rules

`docs/content-strategy.md` §4 and §5 are the rules; the short version:

- Keep Tom's voice. Short first-person sentences, contractions, British spelling, at most one exclamation mark per page. Jokes only in eyebrows, ledes and last sentences, never in an H2, a caption or a proof block's "What I did".
- Visible copy shows ages and school years; real dates go in data attributes and Details lines. TEDx event dates and blog post months are the visible exceptions; blog posts show no age.
- Proof over claims. Never overclaim: IYPT was the in-school stage; Tom is one of three student organisers of TEDxDulwich Youth (never "licensee"); the LSHTM work is advising, via the team Tom's dad works in; Namesake #753 was proposed, not built.
- Banned everywhere: impressive, incredible, journey, leverage, showcase. "Passionate" at most once site-wide. A contract enforces both.
- Every deep page and post gets a summary on its parent page, never a bare link.

## Drafts

A draft is saved in this repository but not published on thomaswhite.me: any element marked `data-draft`. The preview (new.thomaswhite.me) shows drafts, marked by CSS. thomaswhite.me is built by `.github/workflows/pages.yml`, which leaves them out before anything is served (`scripts/drafts.mjs`), and when `CNAME` is `thomaswhite.me` the tests check the pages as they will be live.

- Text Tom must write is a visible dashed box: `<p class="draft-note" data-draft>What to write</p>`, or inline `<span class="draft-inline" data-draft>…</span>`.
- Text drafted from `docs/record.md` for Tom to confirm carries `data-draft="check"`; remove the attribute once Tom approves it.
- Content not yet published carries `data-draft="new"`.
- A new version of a live element is a copy straight after it, with `data-draft="replace"`. Publishing it deletes the live element and removes the marker from the copy; until then the live one stays live.
- Content to remove carries `data-draft="remove"`: it stays live until the removal is published, and only its marker is left out.
- The editor at `https://edit.thomaswhite.me` writes and publishes all of these (§ Editor).
- A draft needs an explicit end tag. No `<p>` or `<li>` may have only drafts for words (one draft, even inside an `<em>`, or several between them), which would leave it empty on thomaswhite.me: mark the element itself. On the preview only `new` drafts count, since the placeholders and checks are resolved before the merge; in the main repository every kind does. `tests/static/content-contracts.test.mjs` checks both.
- `Tom-White-CV.pdf` is printed from the CV as this repository's site shows it, so on the preview it can hold drafts. thomaswhite.me's build prints its own copy from the page without them (§ CV).
- `npm run list:drafts` lists every draft with its file, line, kind and record slug.
- Once drafts can reach the main repository, thomaswhite.me must never be published by GitHub's automatic Pages build, which would serve them. Its Settings → Pages → Source stays "GitHub Actions", and `npm run test:production` fails if a live page holds a draft.
- Tom resolves the placeholders and checks from the content-strategy work before merging into the main repository.

## Date attributes and the content review

- Every proof block, dated list item and dated card carries `data-record="<slug>"` (a `### slug` heading in `docs/record.md`), `data-when` (`YYYY-MM`, `YYYY`, a range `2025-09/2026-07`, an open range `2026-07/`, or `unknown`) and `data-review="YYYY-MM-DD"`.
- Choose `data-review` as: the next 1 September for school-year mentions and anything that ages; 90 days out for "currently" and "this year" lines; the day after an event for copy written before it.
- Any element whose text or attributes mention "Year 10" to "Year 13" needs a `data-review` on itself or an ancestor; a contract enforces it.
- The homepage Now section uses `data-updated="YYYY-MM"` and a visible "Updated Month Year" line that must match. Update both whenever a Now line changes.
- `npm run review:content` (add `-- --today=YYYY-MM-DD` to simulate a date) lists passed review dates, `data-updated` older than 60 days and uncovered school years. `.github/workflows/content-review.yml` runs it at 07:00 UTC on the 1st of each month and opens or updates one "Content review: <Month Year>" issue.
- Each September, bump school years and ages, move review dates forward, rebuild the CV and close the review issue.
- Update `docs/record.md` whenever a fact enters the site or a decision is made not to publish something.

## Adding pages and posts

- Copy the most similar existing page. Set metadata deliberately; do not retain metadata copied from another page.
- Add the page to `tests/support/page-manifest.mjs` (source, path, title, heading, monitor keyword, and `stylesheet` or `inNavigation: false` when they differ from the defaults).
- Add a top-level page to the desktop navigation, its More copy, the mobile menu and the footer on every page (§ Shared navigation and footer), and check `aria-current`.
- Blog posts: Tom writes `docs/blog-sources/<slug>.md` (unpublished); convert it into `blog/<slug>.html` from the post template (page hero with a "Month Year" eyebrow, no age, `.prose.post-body` article with `h2` subheadings, a Related block). Then add it to the post list on `/blog/` (newest first), pin it if it is informative (at most three pinned), summarise it on its parent page, and give it a `BlogPosting` JSON-LD block.
- Include the shared header, footer, CookieYes script, and `/JS/script.js`.
- Verify desktop, tablet, phone, keyboard, reduced-motion and no-JavaScript behaviour.

## Shared navigation and footer

The header and footer are repeated in every page rather than generated from a template.

- Desktop order: Home · Programming · Physics & Ideas · Volunteering · Blog · Sport, music & drama · Gallery · More · Contact :). More always holds TEDx and Testimonials.
- Priority-plus: every item after Programming appears twice, in the bar as `<li data-nav-item="key">` and at the top of More as `<li data-nav-copy="key">`, in the same order. `initialiseNavigation()` measures the bar and moves trailing items into More, last first, marking the unused copy `hidden` and `aria-hidden`. Contact :) never moves.
- Without JavaScript, the last two items carry `nav-item--fallback` / `nav-copy--fallback` and start in More; the `min-width` media queries in `general.css` promote them at widths known to fit (currently 1060px and 1140px). Re-measure these whenever a nav label changes; `tests/e2e/navigation.spec.mjs` checks the bar never overflows.
- The mobile menu (1024px and below) shows each page once and hides every More copy. When it opens, the panel slides in from the right and its rows (each page, the "A few more pages" label and Contact :)) fade in from the right one after another, 40ms apart; `initialiseNavigation()` adds `nav-panel--open` and numbers the visible rows in `--nav-row`. Reduced motion skips the animation.
- At 1024px and below the header is fixed. Once the page scrolls more than 24px, `initialiseNavigation()` adds `site-header--compact`: the bar slides up, the logo and name slide off to the left, and the Menu button swings in as a quarter circle flush with the top-right corner (under the overlay scrollbar where that shows). Scrolling back to the top reverses it. Desktop is unchanged.
- Footer "Pages": Home, Programming, Physics & Ideas, Volunteering, Blog, Sport, music & drama, Gallery. Footer "More": TEDx, Testimonials, GitHub, LinkedIn (when it exists), CV (PDF), Contact :). Each page leaves itself out of the footer lists.
- Do not manually update only the copyright end year; `data-current-year` is populated at runtime.
- Keep `<span data-last-updated>unknown – please enable JavaScript</span>` identical on every page. `initialiseLastUpdated()` replaces it with a `<time>` element carrying the deployed page's `Last-Modified` date, or with `unknown` when that header is missing.
- Keep the small `Status` link beside the last-modified label and point it to `https://status.thomaswhite.me/` on every page.

Useful searches:

```bash
rg -n "Text being replaced" -g "*.html" .
rg -n 'data-nav-item|data-nav-copy|aria-current' -g "*.html" .
rg -n 'data-last-updated|data-current-year' -g "*.html" .
```

## Call to action

Home, Programming, Volunteering and Contact end with the same block (`id="tech-projects"`): eyebrow "Volunteering, the online kind", H2 "Got something technical you need help with?", the approved two-paragraph body naming websites, web apps, Python tools and desktop apps, and the buttons "Email me" (mailto) and "See what I’ve made" (`/programming/#projects`). Change all four together.

## Styling

- Put shared colours, typography, spacing, components, header/footer rules, and breakpoints in `CSS/general.css`. Page-only layout goes in the page stylesheet.
- Shared components (content strategy §8), reuse rather than restyle:
  - `.proof-block.editorial-card` (`.proof-block-media` + `.proof-block-body`, `h4` subheadings "What it is / What I did / What was hard / What I took from it", `.proof-block--solo` without media).
  - `.details-toggle` + `.details-panel` (see `initialiseInfoToggles()`).
  - `.compact-list` with `.compact-list-label`, `.compact-list-text` and an optional `.link-arrow`.
  - `.post-list`, `.post-body`, `.related-list`.
  - `.path-grid` / `.path-card` (home grid and the Blog's `.path-grid--three` pinned strip; `.path-card--plain` has no image). The image, or the plain card's rings, zooms on hover; reduced motion removes the zoom.
  - `.draft-note` and `.draft-inline`, and the `[data-draft]` kinds `new`, `replace` and `remove`.
- Reuse existing custom properties in `:root`. Follow the 1024, 768 and 480 pixel breakpoints unless a component requires otherwise.
- Preserve visible focus, contrast, reduced-motion support, and touch-device behaviour.
- Preserve the warm editorial design: cream backgrounds, deep green, warm accents, Fraunces headings, and Inter body text. Alternate paper and plain sections down a page.

## JavaScript

All JavaScript is in `JS/script.js` and initializes after `DOMContentLoaded`. Preserve initializer names and order unless the requested behaviour requires restructuring.

- `initialiseAnalytics()`: consent-aware Google Analytics.
- `initialiseSkipLink()`: keyboard focus transfer.
- `initialiseNavigation()`: desktop More menu, mobile navigation, priority-plus fitting (measures on load, resize and font load; adds `nav-measured` to `.navbar`, which switches off the no-JavaScript fallback CSS), the compact mobile header (`site-header--compact` once the page scrolls, `site-header--animated` after the first time so the button animates back into the bar), and the mobile menu's opening animation (`nav-panel--open`, `.nav-row` and `--nav-row`).
- `initialiseScrollbarTrack()`: overlay scrollbar for fine-pointer devices.
- `initialiseCurrentYear()`: `data-current-year` elements.
- `initialiseLastUpdated()`: deployment date from `document.lastModified`, rendered as a `<time>` element.
- `initialiseContactForm()`: validation, submission, and result views.
- `initialiseGallery()`: expanded-image dialog.
- `initialiseYouTubeFacades()`: click-to-load YouTube embeds.
- `initialiseTrackAudio()`: exclusive playback and rate reset. No page ships audio; `tests/e2e/interactions.spec.mjs` covers it against injected elements.
- `initialiseInfoToggles()`: `aria-controls` + `data-info-toggle` Details panels. Markup ships the panel visible and the button `hidden` with `aria-expanded="true"`; the initializer collapses the panel (unless `data-info-toggle="open"`) and reveals the button, so details stay readable without JavaScript.

Extend the relevant initializer when possible. A new initializer must be called once in the `DOMContentLoaded` handler and return safely when its page-specific elements are absent.

## CV

- Edit `cv.html`; every fact must come from `docs/record.md`. Entries carry the date attributes.
- Run `npm run build:cv` to print `/cv/` with Playwright Chromium to `Tom-White-CV.pdf`, then commit both. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` only if Playwright's own Chromium is unavailable.
- The PDF is printed as this checkout's site serves the CV. thomaswhite.me's build (`.github/workflows/pages.yml`) prints it again with `--live`, from the page with its drafts left out, and deploys that copy instead.
- The PDF is linked from the footer, About and Contact. It is public and will be indexed; that is accepted.

## Images

- Store originals/fallbacks in `Images/` and responsive WebP files in `Images/optimized/`.
- Use lowercase, descriptive, hyphenated filenames.
- Name derivatives with their true pixel width, such as `example-480.webp`.
- Never upscale a source merely to create a standard size.
- Ensure every `srcset` width descriptor equals the image’s intrinsic width.
- Retain a fallback file for the `<img src>` inside `<picture>`.
- Match existing derivatives: WebP quality 92 with `webp:method=6`.

```bash
magick identify -format "%f | %m | %wx%h | %b\n" "Images/example.jpg"
magick "Images/example.jpg" -auto-orient -strip -colorspace sRGB -resize "480x>" -quality 92 -define webp:method=6 "Images/optimized/example-480.webp"
magick "Images/example.jpg" -auto-orient -strip -colorspace sRGB -resize "960x>" -quality 92 -define webp:method=6 "Images/optimized/example-960.webp"
magick identify -format "%f | %m | %wx%h | quality=%Q | %b\n" "Images/optimized/example-*.webp"
```

When changing an image, update the fallback `src`, every WebP source, intrinsic `width` and `height`, contextual alt text, and any applicable Open Graph image. Use `loading="lazy"` and `decoding="async"` below the fold; do not lazy-load the primary above-the-fold image.

For gallery entries:

- Keep `data-full-src`, `data-caption`, the button’s `aria-label`, image alt text, and `<figcaption>` aligned.
- Prefer an optimized display-sized WebP for `data-full-src`.
- Update the visible photo count when adding or removing entries.
- Preserve the dialog controls and IDs required by `initialiseGallery()`.
- Test previous/next controls, arrow keys, Escape, backdrop closing, and focus restoration.

## Integrations and media

- The contact form uses Formspree and Google reCAPTCHA. Keep field `id`, `name`, `label for`, required state, autocomplete values, and JavaScript validation aligned. Private configuration is not in this repository.
- Keep `formStatus`, `thankYouMessage`, `spamBlockedMessage`, `sendAnotherBtn`, and `tryAgainBtn` aligned with `initialiseContactForm()`.
- The public email address is `tom@thomaswhite.me` (Contact, the call to action and the CV). If it changes, change every `mailto:`, the Contact page's meta description and the CV together, and rebuild the CV PDF.
- YouTube facades require `class="youtube-facade"`, a bare `data-videoid`, `data-video-title`, a thumbnail, and accessible button text.
- Local videos belong in `Images/`; use optimized versions for normal playback when available.
- No page currently ships audio and there is no `Music/` directory. If audio returns, put released songs in `Music/Songs/` and unfinished clips in `Music/Previews/`, and use MP3, `type="audio/mpeg"`, `preload="metadata"`, and `class="track-audio"` so `initialiseTrackAudio()` applies.
- If changing the domain, update `CNAME`, canonical and Open Graph URLs, structured-data URLs, and identity/contact references together.
- If replacing fonts, update the relevant `@font-face` URL and retain its licence in `Fonts/`.
- Better Stack monitors the ten pages marked `monitored` in `tests/support/page-manifest.mjs` (the pages in the navigation) and hosts the public status page at `https://status.thomaswhite.me/`. Keep monitor keywords aligned with the manifest; follow `docs/status-page-operations.md` for DNS, notifications and incident changes. Do not add Vercel infrastructure or expose Better Stack account details in the repository.

## Verification

The repository has a development-only npm test toolchain. The only production build is thomaswhite.me's `.github/workflows/pages.yml`: GitHub's Jekyll build, then drafts left out and the CV's PDF printed again without them. Install Node.js 24, run `npm ci`, then install the Playwright browsers with `npx playwright install chromium firefox webkit`. On Linux, use `npx playwright install --with-deps chromium firefox webkit`. See `docs/testing.md` for the full command and scope reference.

For relevant changes:

1. Run `git diff --check`.
2. Run `npm run check` for the full deterministic suite: lint, static and content contracts, Playwright browser coverage, committed visual baselines and Lighthouse budgets.
3. Run `npm audit --audit-level=high` after dependency changes.
4. Run `npm run test:production` when the deployed site, routing, redirects, DNS or status-page integration changes. Run `npm run test:external-links` when link destinations change or as a periodic maintenance check.
5. Run `npm run list:drafts` to see what is still a draft. Everything it lists stays off thomaswhite.me.
6. Preview manually when visual or interaction risk remains. `node tests/support/clean-url-server.mjs` serves clean paths at `http://127.0.0.1:4173`; unlike `python -m http.server`, it strips YAML front matter in memory and models GitHub Pages clean URLs and folder index pages.
7. Check affected pages at wide desktop, tablet and phone widths. Navigate without a mouse; verify focus, tab order, Escape behaviour, the browser console, reduced motion and basic no-JavaScript usability as applicable.
8. Test Formspree, reCAPTCHA, CookieYes and canonical-domain behaviour on the deployed domain when those integrations change; deterministic tests stub third-party services and do not prove their live behavior.

## Editor

The site's text can also be edited in the browser at `https://edit.thomaswhite.me`, a separate site built in the private repository `ThomasWCode/edit.thomaswhite.me` (`docs/how-it-works.md` there). It edits this preview repository until the content-strategy merge, then the main repository (`docs/implementation-notes.md` §6). What it does to this repository:

- **Edits arrive on the `edits` branch.** Each Save is one commit of every changed file, with a message describing the change (for example "Physics & Ideas: “see” → “watch”"). Publish opens a pull request from `edits`, titled and described from the changes (both editable in the editor, which can also suggest them with AI), waits for CI, merges it with a merge commit and deletes `edits` (keeping it if a newer save landed on it meanwhile). A pull request merged or closed on GitHub instead is followed too, and a merged `edits` left behind is deleted the next time the editor loads. Do not hand-edit `edits` while that pull request is open; merge or close it first. A file changed elsewhere (in a Claude session, say) while the editor has it open shows there as a conflict, never as an overwrite.
- **It changes as little as possible.** Only the changed words are rewritten, with `&`, `<` and `>` escaped; entities, line wraps and indentation elsewhere stay byte for byte. It also adds and removes paragraphs and list items, marks drafts done (removing `data-draft` and the `draft-note` class, or an inline slot's `<span>` tags) or approved (removing `data-draft="check"`), sets link targets, alt text and gallery captions, and changes the Now section's `data-updated` and its "Updated Month Year" line together.
- **It can save any of those changes as a draft** (§ Drafts): new content as `data-draft="new"`, a changed paragraph, list item, section, link, image or caption as a `replace` copy after the live element, a removal as `remove`, a phrase as a `new` span. Its Publish button on a draft makes it live on the next Publish.
- **It locks what the contracts pin:** everything outside `main`, each page's `h1`, Analisa's words, the Updated line, proof-block labels, forms and buttons, and the whole of `cv.html` and the redirect pages. `docs/record.md` and the blog sources are edited as plain text.
- **Its pre-save checks mirror `tests/static/content-contracts.test.mjs` and `site-contracts.test.mjs`:** Liquid markers, banned words, "passionate" once, school years without `data-review`, the Updated line, the new-tab rule, local references and record slugs. It adds its own: no relative links (links here are written from the root), anchors that exist, no emptied headings, and nothing changed outside `main` or in a locked part. When a contract here changes, change `src/checks.js` in the editor repository too. CI here remains the gate.
- **CI and baselines:** a save runs nothing until a pull request is open; after that, every save runs CI. At Publish it first dispatches **Update visual baselines** on `edits` when the homepage, Programming or Gallery changed, and it dispatches **Test suite** itself only when that workflow's commit moved an already-open pull request (a push made with `GITHUB_TOKEN` starts no workflow).
- **Its test fixtures are copies of these pages** (`tests/fixtures/site/` in the editor repository, at the commit in its `SOURCE.md`). Copy a new component or markup pattern into them so the editor's tests cover it.
