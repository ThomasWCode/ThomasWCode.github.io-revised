# Editor merge feature: data-safety findings that concern this repository

From an audit on 27 September 2026 of the editor's merge feature (bringing `main` into `edits`) and every other path that could delete, corrupt or overwrite edits. The full report, with every finding, the evidence and scripts that reproduce each one, is in `ThomasWCode/edit.thomaswhite.me` on the branch `claude/merge-feature-safety-audit-mhz5e9`: `docs/audits/2026-09-27-merge-safety.md`.

Nothing was fixed, and nothing was written to `main` or `edits` here; the repository was only read. The numbers are the full report's.

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

## The live `edits` branch (27 September, read only)

- 8 saves from 26 September, 19 commits behind `main`, no open pull request. The editor's next load with nothing unsaved will try to merge `main` in.
- Simulated with git, that merge is clean. The 6 pages edited come out byte for byte as on `edits`, and the result passes all 96 static contracts.
- `main`'s side adds `.github/workflows/pages.yml`, and the editor's GitHub App has no Workflows permission. Whether GitHub then refuses the merge is undocumented and unverified (full report, finding 11); it would lose nothing.
