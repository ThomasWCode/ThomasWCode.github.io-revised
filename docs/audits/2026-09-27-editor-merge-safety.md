# Editor merge feature: data-safety findings that concern this repository

From an audit on 27 September 2026 of the editor's merge feature (bringing `main` into `edits`) and every other path that could delete, corrupt or overwrite edits. The full report, with every finding, the evidence and scripts that reproduce each one, is in `ThomasWCode/edit.thomaswhite.me` on the branch `claude/merge-feature-safety-audit-mhz5e9`: `docs/audits/2026-09-27-merge-safety.md`.

The audit itself fixed nothing, and wrote nothing to `main` or `edits` here; the repository was only read. The numbers are the full report's.

How each is to be fixed was decided on 27 September (see [Decisions](#decisions-27-september)). The fixes followed the same day, on the branch `claude/editor-data-safety-fixes-xe1fd6` here and in the editor's repository, in pull requests not yet merged: see [Fixed](#fixed-27-september). The full report marks every finding, with its commits and evidence.

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
- **4.** `1c83c80`: § Editor says squash and rebase merging must stay off. **Not done: the setting**, which is Tom's. Read from the API after the fixes, it still allows squash and rebase merging here and in `ThomasWCode/ThomasWCode.github.io`.
- **5.** `1c83c80`: § Editor says the editor never deletes `edits`: it moves it up to `main` by fast-forwards GitHub refuses once a save has landed on it.
- **6.** `5c1377f`: `scripts/drafts.mjs` reads a start tag's attribute names only, for the marker and for `remove`; new cases in `tests/static/drafts.test.mjs`. `733c9f5`: `docs/testing.md` says so.
- **8.** `a6e25cd`: `content-review.yml` opens a new issue each month and then closes any earlier open review issue with a link to it, never touching its body. Checked with a stub `gh`; not run against the live repository. `AGENTS.md`, `docs/testing.md` and `docs/implementation-notes.md` §4 say so.
- **10.** `2a86b4e`: `docs/implementation-notes.md` §6 step 2 (steps 2 to 7 in one go; the Claude session tells Tom at step 2 that the editor's changes are no longer read) and step 6 (the commands that keep this repository's `CNAME`, checked with git on a local simulation); the reminder in `AGENTS.md`.
- **11.** `2a86b4e`: §6 step 7 adds the main repository to the App's installation, which holds the Workflows permission. **Not done: granting it**, which is Tom's (the editor's `docs/setup.md` has the steps).

## The live `edits` branch (27 September, read only)

- 8 saves from 26 September, 19 commits behind `main`, no open pull request. The editor's next load with nothing unsaved will try to merge `main` in.
- Simulated with git, that merge is clean. The 6 pages edited come out byte for byte as on `edits`, and the result passes all 96 static contracts.
- `main`'s side adds `.github/workflows/pages.yml`, and the editor's GitHub App has no Workflows permission yet. Whether GitHub refuses the merge without it is undocumented and unverified (full report, finding 11); it would lose nothing. The permission is to be granted.
