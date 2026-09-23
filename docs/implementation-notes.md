# Content strategy: implementation notes

This file records the implementation of `docs/content-strategy.md` in the preview repository (`ThomasWCode/ThomasWCode.github.io-revised`, published at `https://new.thomaswhite.me`) on 23 September 2026. It covers:

1. what changed;
2. everything Tom still has to write, check or supply;
3. what has to happen outside the repository;
4. where the implementation departs from the plan;
5. open questions;
6. how to merge this into the main repository with its history.

`docs/` is excluded from the published site, so this file is not public on the website. It is visible to anyone who can see the GitHub repository.

---

## 1. What changed

Each phase went in as its own pull request and was merged with a merge commit, so every individual commit is kept.

| PR | Phase | What it did |
| --- | --- | --- |
| [#1](https://github.com/ThomasWCode/ThomasWCode.github.io-revised/pull/1) | Groundwork | `_config.yml` stops GitHub Pages publishing `docs/` (including the private record), `tests/`, `scripts/`, `AGENTS.md` and the tooling. Adds a manual Windows workflow that regenerates visual baselines. Production checks now test the host named in `CNAME`. |
| [#2](https://github.com/ThomasWCode/ThomasWCode.github.io-revised/pull/2) | 1: quick copy fixes | The seven audited typos, the Volunteering placeholder box removed, the new home hero lede, About opens "I'm in Year 12", the approved Programming lede, the new call to action on four pages, the email address on Contact, YouTube out of the nav and footer. |
| [#3](https://github.com/ThomasWCode/ThomasWCode.github.io-revised/pull/3) | 2: structure | Priority-plus navigation (with a no-JavaScript fallback). Shared components: proof block, Details toggle, compact list, post list, post layout, draft notes. The date-attribute convention with the monthly content review workflow and its contract tests. `cv.html` and `Tom-White-CV.pdf` with `npm run build:cv`. |
| [#5](https://github.com/ThomasWCode/ThomasWCode.github.io-revised/pull/5) | 3: Physics & Ideas and the Blog | `/physics/`, `/physics/magnetic-newtons-cradle/`, `/blog/` with the post template and the "Bridging the Gap" skeleton, the TEDx page split into the talk and organising the 2027 event, Physics & Ideas and Blog in the nav, footer and home grid. |
| [#6](https://github.com/ThomasWCode/ThomasWCode.github.io-revised/pull/6) | 4: Programming and Volunteering | Programming rebuilt around three proof blocks (Namesake, this website, TechAssist), Using AI and Where I started. Volunteering split into building, advising (LSHTM) and hands-on. The "How this site works" post. |
| #7 | 5: consolidation | `/sport/` and `/music&drama/` merged into `/sport-music-and-drama/`, with the old URLs redirecting. The Now section on the homepage. Contact finished. Consistent JSON-LD `sameAs`. `AGENTS.md` and the docs rewritten. This file. |

Page by page, the site now has:

- **Home:** the new hero lede, About with Year 12 and links to the reading section and the CV, the new Now section, the reordered grid (Programming and Physics & Ideas as the wide cards, then TEDx, Volunteering, Blog, Sport music & drama and Gallery), "A few other bits" without YouTube, and the new call to action.
- **Programming:** the approved lede, "How I got into it" with two edited lines, three proof blocks, Using AI, Where I started (with the YouTube channel) and the call to action.
- **Physics & Ideas (new):** the cradle proof block, the TEDx talk and event, reading, Questions I'm stuck on and the physics-flavoured code.
- **Magnetic Newton's cradle (new):** laid out as a short lab report, with every section from the brief.
- **Volunteering:** Building for people, Advising (new), Hands-on, and the call to action.
- **Blog (new):** pinned strip and post list. Two posts: "Bridging the Gap" (structure only) and "How this site works" (drafted).
- **TEDx:** part one is the talk, part two is organising the 2027 event.
- **Sport, music & drama (new, merged):** Sport, then Music, then Drama. `/sport/` and `/music&drama/` forward to it.
- **Contact:** "Email is best", the Gmail address, the form, then GitHub and the CV.
- **Testimonials:** "I'll add more as I collect them."
- **YouTube:** content unchanged, typos fixed, and an age slot in the lede. No longer in the nav or footer; linked from Programming.
- **CV (new):** `/cv/` (unlinked, noindex) printed to `/Tom-White-CV.pdf`, linked from the footer, About and Contact.

Behind the pages:

- `_config.yml` hides `docs/` and the tooling (see §3 for why this is urgent on the live site).
- The navigation measures itself: items move into More instead of wrapping, and without JavaScript the last two start in More and More opens on hover or keyboard focus.
- Every dated item carries `data-record`, `data-when` and `data-review`. `npm run review:content` and the monthly **Content review** workflow list anything due. The workflow was run twice with simulated dates: it opened exactly one issue (#4), then updated that issue instead of opening a second. I closed it afterwards.
- New contract tests:
  - date attributes and record slugs;
  - review dates on school-year mentions;
  - the Now section's "Updated" line;
  - banned words and at most one "passionate";
  - one consistent JSON-LD Person;
  - the redirects;
  - no draft placeholders once `CNAME` is `thomaswhite.me`.
- `npm run list:drafts` lists every placeholder still to fill.

---

## 2. What Tom still has to write, check or supply

Nothing on the site is invented. Anything the record did not cover is marked one of two ways:

- **Write:** a visible dashed box labelled "Draft: Tom to write", or a dashed inline slot (`data-draft`). Replace it with your text and delete the element's `draft-note`/`draft-inline` class and `data-draft` attribute.
- **Check:** a sentence I drafted from the record, marked with an invisible `data-draft="check"`. Read it, rewrite it if it doesn't sound like you or isn't accurate, then delete the attribute.

Run `npm run list:drafts` for the live list with file and line numbers. On 23 September 2026 there were 77: 63 to write and 14 to check. **CI in the main repository will fail until the list is empty.** That is deliberate, so a placeholder can't reach thomaswhite.me.

### Home (`index.html`)
- Check the hero follow-on sentence: "This is where I keep the physics I'm working on, the things I've built for people, and some of the other stuff I get up to." The plan marks it for your approval.
- Check the call-to-action eyebrow "Volunteering, the online kind" (you may veto it). It is repeated on Programming, Volunteering and Contact.
- Keep the Now section current. When a line changes, change `data-updated="YYYY-MM"` and the visible "Updated Month Year" together; the tests check they match.

### Physics & Ideas (`physics.html`), 18 items
- **Cradle proof block:**
  - a build photo or a five-second clip;
  - the headline finding;
  - one honest limitation;
  - "What I took from it";
  - the tracking software, runs per parameter and which term;
  - check "What I did", especially that you did the motion tracking.
- **Reading:**
  - your reaction to Hawking and to *Why Does E=mc²?*;
  - the papers list;
  - one line on why for each "beyond physics" book;
  - check that *This Mortal Coil* is Andrew Doig's.
- **Questions I'm stuck on:** five, in your words.
- **Simulations:** your age for the Bouncing Ball simulation and Game of Life.

### Magnetic Newton's cradle (`physics/magnetic-newtons-cradle.html`), 9 items
- **Write:**
  - how you built it, with photos;
  - the software, frame rate and runs;
  - at least two plots and a clip (optionally a CSV);
  - what you found;
  - what went wrong and what you'd do next;
  - what you took from it;
  - term and hours in Details.
- **Check:** "Why it's interesting" and "My role".

### TEDx (`tedx.html`), 4 items
- Check the summary of the essay (it describes the essay you haven't written yet).
- Write "Things I drew on": three to five items.
- Organising: write "What's hard" and the milestone dates.
- After 28 February 2027: write the organising post, link it from the organising block, and change the "I'm organising" lines to past tense. Their `data-review` dates (1 March 2027) will flag them.

### Blog
- `blog/bridging-the-gap.html`, 8 items: the whole essay (800 to 1,000 words) from your script, section by section. Write it in `docs/blog-sources/bridging-the-gap.md` and a session can convert it.
- `blog/how-this-site-works.html`, 2 items: I drafted the post from what the repository actually does. Rewrite it in your voice, write "What building it taught me" (including how you used AI tools), then remove `data-draft="check"` from the `<article>`.
- `blog/index.html`: check the lede.

### Programming (`programming.html`), 22 items
- **Check:**
  - the replacement "Why I like programming" line ("solitary when I want it to be…");
  - Namesake "What was hard" and "The cause matters to me";
  - "This website" (the AI-tools sentence and "What was hard");
  - TechAssist "What was hard".
- **Write:**
  - "What I took from it" for all three proof blocks;
  - Namesake before-and-after map screenshots;
  - your age for this website and TechAssist;
  - TechAssist screenshots, what your grandparents said and the repository link;
  - "How I actually use AI" (two or three sentences);
  - ages for the five early projects and the YouTube channel;
  - hours and dates in the new Details lines.

### Volunteering (`volunteering.html`), 5 items
- Check the hero lede.
- Advising: one example of advice that changed something, "What I took from it", and the start month of the calls.
- Parks: links to the Islington Life and Gazette pieces if they're online. Delete the box if they aren't.

### Sport, music & drama (`sport-music-and-drama.html`), 1 item
- The years or ages you did LAMDA.

### YouTube (`youtube.html`), 1 item
- Your age when you made the tutorials.

### CV (`cv.html`), 6 items
- School, A level subjects and predicted grades, then GCSE results.
- Dates for St John's Garden, TechAssist, the YouTube channel, the Parks events and the Mind shop.
- After editing, run `npm run build:cv` and commit `cv.html` and `Tom-White-CV.pdf` together.

### Things to gather (strategy §10)
- LinkedIn URL, when it exists. Add it to the footer More group, Contact, the CV and every JSON-LD `sameAs` list at once.
- Namesake: a before-and-after screenshot of the support map, and a live screenshot. The map would also be the best image for the home Programming card.
- TechAssist: screenshots, and make the repository public.
- Cradle: clips, data, plots, photos, software name, runs per parameter, your role.
- TEDx organising: photos, the poster, milestone dates. Add them to the Gallery too.
- The ages and dates listed in `docs/record.md` under "To confirm".

---

## 3. Outside the repository

- **Urgent, on the live site now:** `https://thomaswhite.me/docs/record.html` publishes `docs/record.md`, including Tom's exact birth date. GitHub Pages renders Markdown files even without front matter. The fix is `_config.yml` from PR #1 and is already live on new.thomaswhite.me (that URL now returns 404).
  - You can copy `_config.yml` into the main repository on its own today, before the rest of this work is ready.
  - If the GitHub repository is public, the record is also readable there. Consider keeping it somewhere private.
- **Better Stack:** when this reaches thomaswhite.me, edit three monitors and rename one component. The exact steps are in `docs/status-page-operations.md` under "Changing the monitors for the content-strategy pages". The ten monitored pages are the ten in the navigation; `/youtube/` is no longer monitored.
- **Domain email:** still a trigger. When `tom@thomaswhite.me` works, change every `mailto:` link and the CV together.
- **Namesake research:** the site says only "research, still in progress", as agreed.

---

## 4. Where the implementation departs from the plan

- **Privacy fix (not in the plan):** `_config.yml`. The plan assumed Markdown without front matter isn't published; it is. I annotated `docs/content-strategy.md` with the correction.
- **Tooling added to make the plan workable:**
  - the Windows baseline workflow (the baselines are Windows-only);
  - production checks that follow `CNAME`;
  - the drafts guard tied to `CNAME`;
  - `npm run list:drafts`;
  - `unknown` and open ranges (`2026-07/`) allowed in `data-when`;
  - `data-review` allowed on its own for plain school-year copy.
- **Namesake "What I did":**
  - It says "the summer after Year 11" rather than the plan's example "(July 2026, age 16)", because principle 3 keeps real months out of visible copy. The real dates are in Details.
  - The "My merged changes" button links to a GitHub search for merged PRs by `ThomasWCode` (see questions).
- **"This website":** it says AI coding tools helped. Before this work, 13 of the repository's 57 commits were authored by Claude, and principle 6 is "say exactly what happened". The wording is marked for you to check.
- **Details toggles:** these follow the plan (`initialiseInfoToggles()`) but work without JavaScript. The details show until the script collapses them.
- **More menu:** without JavaScript it opens on hover and keyboard focus. Before, it could not be opened at all without JavaScript.
- **TEDx page title:** "TEDx Talk | Tom White" is now "TEDx | Tom White", and the nav and footer label is "TEDx", because the page now covers organising too. The H1 and URL are unchanged.
- **Blog slot:** the plan had it hidden in Phase 2 until Phase 3. The phases went out back to back, so it was simply added in Phase 3.
- **Home card images:**
  - The Programming card keeps the Bouncing Ball screenshot until a Namesake map screenshot exists.
  - Physics & Ideas uses the TEDx stage photo (no cradle photos yet).
  - The TEDx card now uses the speaker photoshoot.
  - The Blog card has no image.
- **New image:** `Images/this-website.png` is a homepage screenshot. ImageMagick wasn't available, so its WebP derivatives were encoded by Chromium at quality 0.92, not with `-define webp:method=6`. Re-encode them with the commands in `AGENTS.md` if you want them to match exactly.
- **Redirects:** these are plain meta-refresh pages, not the Jekyll plugin, so they need no configuration and are tested locally.
- **Rabbit strip:** "A few other bits" now has two cards in a two-column grid.
- **Unused files:** the early-project screenshots (`chrome-dino.png`, `minesweeper.png` and others) are no longer shown on Programming. I kept the files.

---

## 5. Questions

1. Do you approve the hero follow-on sentence and the "Volunteering, the online kind" eyebrow?
2. The **Full talk** YouTube player on `/tedx/` has had an empty video ID and thumbnail since your commit of 24 August 2026 ("update tedx and testimonials"), so it shows a broken image and plays nothing. Was that intentional? If not, restore `data-videoid="YJ-s-Gx1FN0"` and the thumbnail `https://i.ytimg.com/vi/YJ-s-Gx1FN0/hqdefault.jpg`.
3. "The code" links (Programming and the post) point to `https://github.com/ThomasWCode/ThomasWCode.github.io`, which I took to be the main repository. Is that right, and is it public?
4. The Namesake "My merged changes" link searches for merged PRs by the GitHub user `ThomasWCode`. Did you open the Namesake PRs from that account?
5. How do you want to describe the AI help in building this site? I drafted one plain sentence on Programming, and left "How building it taught me" in the post for you.
6. Is *This Mortal Coil* the Andrew Doig book (a history of death)? The record only says "Doig".
7. The LSHTM copy says "It's the team my dad works in, and they asked me." Is that the wording you want? The plan's phrasing was "The team my dad works in asked me."
8. Is it acceptable to drop the Better Stack monitor for `/youtube/` to stay within ten monitors? The alternative is dropping Testimonials instead.
9. Should the CV fit on one A4 page? It is two pages now, with the education gaps.
10. Is the GitHub repository public? If so, `docs/record.md`, including the birth date, is readable there even after the website fix.
11. The overlay scrollbar's 14px arrow buttons cost one Lighthouse accessibility point on every page (`target-size`). This existed before this work. Should they be enlarged or removed?

---

## 6. Merging into the main repository with its history

This repository shares its history with the main one up to `49b9582`. Its first own commit, `f2e3fc3 Update CNAME`, points the domain at `new.thomaswhite.me`. That commit must not reach production.

1. Finish section 2 first. With `CNAME` set to `thomaswhite.me`, the content contract fails while any draft remains, so CI in the main repository stays red until `npm run list:drafts` prints nothing. You can do the writing here in the preview repository first and check it on new.thomaswhite.me.
2. In a local clone of the main repository:

   ```bash
   git switch main
   git pull
   git remote add revised https://github.com/ThomasWCode/ThomasWCode.github.io-revised.git
   git fetch revised
   git switch -c content-strategy revised/main
   git revert --no-edit f2e3fc3   # puts CNAME back to thomaswhite.me
   cat CNAME                      # must print thomaswhite.me
   git merge main                 # only needed if the main repository has moved on since the split
   npm ci
   npm run list:drafts            # must print nothing
   npm run check                  # on Windows, or rely on CI
   git push -u origin content-strategy
   ```

3. Open a pull request from `content-strategy` to `main` in the main repository. When CI is green, merge with **Create a merge commit**. Do not use Squash or Rebase: a merge commit keeps every commit and every PR merge from this repository, with their authors and dates.
4. Straight after the deploy:
   - make the Better Stack edits (section 3);
   - run `npm run test:production`;
   - run the **Content review** workflow once from the Actions tab.
5. Keep or delete the preview repository afterwards. If you keep using it for previews, pull `main` from the main repository into it (and keep its own `CNAME`).

If the main repository has not changed since `49b9582`, the merge commit is optional. Once the revert is in, `main` can fast-forward to `content-strategy`, and the history is identical either way.
