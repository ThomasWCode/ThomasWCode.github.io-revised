# Editor merge feature: data-safety findings that concern this repository

From an audit on 27 September 2026 of the editor's merge feature (bringing `main` into `edits`) and every other path that could delete, corrupt or overwrite edits. The full report, with every finding, the evidence and scripts that reproduce each one, is `docs/audits/2026-09-27-merge-safety.md` in `ThomasWCode/edit.thomaswhite.me`, which gained it with the editor's fixes (its pull request #5).

The audit itself fixed nothing, and wrote nothing to `main` or `edits` here; the repository was only read. The numbers are the full report's.

How each is to be fixed was decided on 27 September (see [Decisions](#decisions-27-september)). The fixes followed the same day, on the branch `claude/editor-data-safety-fixes-xe1fd6` here and in the editor's repository, in pull requests #37 here and #5 there: see [Fixed](#fixed-27-september). The full report marks every finding, with its commits and evidence.

## Findings here

- **2 (High). Publishing a `replace` draft undoes changes made to its live element on `main`.**
  - When `main` changes a different line of a live element that has a new version waiting on `edits`, git merges the two cleanly: in 94 of 128 fixture cases. That merge happens at the editor's auto-merge, at Update from main, or at the pull request's own merge.
  - "Publish new version" then cuts the live element, with `main`'s change, and keeps the copy made before it.
  - § Drafts has no rule telling a Claude session to change the waiting copy too. § Editor's "a conflict, never as an overwrite" doesn't hold here.
- **4 (Medium, conditional). Squash and rebase merges are allowed** (`allow_squash_merge`, `allow_rebase_merge`).
  - If the editor's pull request is squashed or rebased on GitHub, `edits` is never deleted.
  - If `main` later reverts one of those changes, the editor's auto-merge brings it back, and the next Publish re-applies it.
  - Turning both merge methods off, in Settings → General → Pull Requests, removes the risk. The same holds for `ThomasWCode/ThomasWCode.github.io`.
- **6 (Low, latent). `scripts/drafts.mjs` strips any element whose attribute *value* mentions `data-draft`.**
  - Examples: `title="how data-draft works"`, alt text, an `aria-label` or a meta description. The regular expression reads quoted values as attributes.
  - The element is left out of thomaswhite.me while the editor reports it live.
  - No file has such a value today. The "How this site works" post is the likeliest place one would appear.
- **8 (Low). `content-review.yml` replaces the open review issue's title and whole body each month.** A checklist ticked on an issue left open is reset.
- **10 (Medium, process). `docs/implementation-notes.md` §6.**
  - Nothing stops a save through the editor between steps 2 and 7; it would miss the merge.
  - In step 6, a plain pull of the main repository merges the `CNAME` revert without a conflict, so the preview's `CNAME` becomes `thomaswhite.me` unless it is restored by hand.
  - Checked safe:
    - `f2e3fc3` touches only `CNAME`;
    - the main repository is still at the fork point `49b9582`, so the merge overwrites nothing there.

## Decisions (27 September)

- **2.** "Publish new version" is refused when the live element has changed since its new version was made, and both are shown for Tom to merge by hand.
  - The draft copy records what the live element was, in a new attribute (such as `data-draft-of`). `scripts/drafts.mjs` and the contracts here must accept it.
  - § Drafts gains a rule: a Claude session that changes a live element with a new version waiting makes the same change in the new version.
- **4.** Squash and rebase merging are turned off, here and in `ThomasWCode/ThomasWCode.github.io`: Settings → General → Pull Requests, leaving "Allow merge commits". Tom can do this now.
- **6.** The build is fixed: `scripts/drafts.mjs` reads attribute names only, never their values, with new cases in `tests/static/drafts.test.mjs`.
  - Visible text on a page was never affected. Only an attribute's text (alt text, a label, a hover title) with "data-draft" mid-text is.
- **8.** `content-review.yml` opens a new issue each month and closes the previous one with a link to it, without touching its body or ticks.
- **10.** No read-only switch in the editor: Tom runs the merge from step 2 to step 7 in one go.
  - The Claude session running it tells him at step 2 that, from then on, changes made in the editor are no longer read, until step 7.
  - Step 6 gets exact commands that keep this repository's `CNAME` (in the full report, finding 10).
- **11.** The editor's GitHub App is granted the Workflows permission; at step 7 the main repository joins the same installation.

## Fixed (27 September)

Commits here, on `claude/editor-data-safety-fixes-xe1fd6`; the editor's commits are in the full report. Each finding was reproduced first.

- **2.** `205ca31`: `scripts/drafts.mjs` never takes the editor's `data-draft-of` for the marker (a new test), and the contracts accept it as they stand; § Drafts describes the record and has the rule for Claude sessions. The editor records the live element and refuses to publish a new version once it has changed, showing both.
- **4.** `1c83c80`: § Editor says squash and rebase merging must stay off. **The setting: done** by Tom on 27 September, here and in `ThomasWCode/ThomasWCode.github.io`. Read back from the API, both allow merge commits only.
- **5.** `1c83c80`: § Editor says the editor never deletes `edits`: it moves it up to `main` by fast-forwards GitHub refuses once a save has landed on it.
- **6.** `5c1377f`: `scripts/drafts.mjs` reads a start tag's attribute names only, for the marker and for `remove`; new cases in `tests/static/drafts.test.mjs`. `733c9f5`: `docs/testing.md` says so.
- **8.** `a6e25cd`: `content-review.yml` opens a new issue each month and then closes any earlier open review issue with a link to it, never touching its body. `7d382cf`, after Codex's review: a second run in the same month leaves that month's issue as it is, instead of opening another and closing the one with the ticks. Checked with a stub `gh`; not run against the live repository. `AGENTS.md`, `docs/testing.md` and `docs/implementation-notes.md` §4 say so.
- **10.** `2a86b4e`: `docs/implementation-notes.md` §6 step 2 (steps 2 to 7 in one go; the Claude session tells Tom at step 2 that the editor's changes are no longer read) and step 6 (the commands that keep this repository's `CNAME`, checked with git on a local simulation); the reminder in `AGENTS.md`.
- **11.** `2a86b4e`: §6 step 7 adds the main repository to the App's installation. `85ecb2c`, after Codex's review: step 7 first checks that the Workflows permission is granted and accepted, rather than saying it is. **Granted** by Tom on 27 September. The editor's next load then merged `main` into `edits` (`18cfe58`), over both workflow files `edits` lacked.

### Still to test

What couldn't be run here, to do later:

- **The content review, for real.** Its new step ran only with a stub `gh`. At its first real run, the scheduled one on the 1st or a dispatch from the Actions tab, check that it:
  - opens this month's issue, or leaves it as it is when it is open already;
  - closes the other open review issues, each with a link to it, their bodies untouched.

  Nothing is due on 1 October 2026, so that run opens nothing. The first to open an issue is 1 November 2026, when the homepage's Now section passes 60 days and the TEDx line "Speakers chosen: by the end of October 2026" reaches its review date. On 27 September the step's issue query ran read-only against this repository with the real `gh`: it returns the number, title and URL the step compares, in the form `gh issue create` prints.
- **§6 step 6, for real.** Its commands ran only on a local simulation of the two repositories. When they run at the merge, `cat CNAME` must print `new.thomaswhite.me` before the commit.
- **Run here or in CI:** lint and the static tests (98 of 98) locally. The browser, visual and Lighthouse suites weren't run locally, but passed in CI on #37.
- **Run on Windows 11** (Tom's machine, 27 September): lint clean; the static tests 98 of 98 with LF files. In this Windows checkout, CRLF (`core.autocrlf`), three redirect-page tests fail, on `main` too: they compare the front matter with `\n` endings. Not part of these fixes.

## The live `edits` branch (27 September, read only)

- 8 saves from 26 September, 19 commits behind `main`, no open pull request. The editor's next load with nothing unsaved will try to merge `main` in.
- Simulated with git, that merge is clean. The 6 pages edited come out byte for byte as on `edits`, and the result passes all 96 static contracts.
- `main`'s side adds `.github/workflows/pages.yml`, and the editor's GitHub App has no Workflows permission yet. Whether GitHub refuses the merge without it is undocumented and unverified (full report, finding 11); it would lose nothing. The permission was granted later that day (below).
- Rehearsed again with the fixes (27 September, locally, never pushed): `edits` merged with `main` plus #37 is clean, the 6 pages come out byte for byte as on `edits`, and the result passes all 98 static tests. #37 also changes `.github/workflows/content-review.yml`, a second workflow change for that merge to carry.
- Done for real the same day, at 17:05 UTC, once Tom had granted the Workflows permission: the editor's first load after the fixes merged `main` into `edits` (`18cfe58`). It leaves the 6 pages as they were, and differs from the rehearsal only in two documents added to #37 after it. `edits` is now 9 ahead of `main` (the 8 saves and the merge) and 0 behind. Whether GitHub would have refused the merge without the permission stays unverified: it was granted first.
