import assert from "node:assert/strict";
import test from "node:test";
import { listPublishedHtml } from "../../scripts/content-review.mjs";
import { DraftMarkupError, findDrafts, LIVE_HOST, liveView, stripDrafts } from "../../scripts/drafts.mjs";
import { readSiteFile, repositoryRoot } from "../support/site-files.mjs";

const page = (body) => `<main>\n${body}</main>\n`;

test("findDrafts: every kind, with offsets, the element before it and whether it is alone", () => {
  const html = page(
    [
      "  <p>Live.</p>",
      '  <p data-draft="replace">Live, reworded.</p>',
      "  <ul>",
      '    <li><span data-draft="new">Only this</span></li>',
      '    <li>Kept <span class="draft-inline" data-draft>slot</span> here</li>',
      "  </ul>",
      '  <p data-draft="check">Checked.</p>',
      '  <img data-draft="new" src="/a.png" alt="" />',
      "",
    ].join("\n"),
  );
  const drafts = findDrafts(html);
  assert.deepEqual(
    drafts.map(({ tag, kind, previous, alone, parentTag }) => ({ tag, kind, previous, alone, parentTag })),
    [
      { tag: "p", kind: "replace", previous: { tag: "p", kind: null }, alone: false, parentTag: "main" },
      { tag: "span", kind: "new", previous: null, alone: true, parentTag: "li" },
      { tag: "span", kind: "", previous: null, alone: false, parentTag: "li" },
      { tag: "p", kind: "check", previous: { tag: "ul", kind: null }, alone: false, parentTag: "main" },
      { tag: "img", kind: "new", previous: { tag: "p", kind: "check" }, alone: false, parentTag: "main" },
    ],
  );
  assert.equal(html.slice(drafts[0].start, drafts[0].end), '<p data-draft="replace">Live, reworded.</p>');
  assert.equal(drafts[0].line, 3);
  assert.deepEqual(findDrafts('<p data-drafted="x">No.</p><p data-draft-note>No.</p>'), [], "only the data-draft attribute itself");
});

test("findDrafts refuses a draft without an explicit end tag", () => {
  assert.throws(() => findDrafts("<ul>\n<li data-draft=\"new\">Open\n<li>Next</li>\n</ul>"), DraftMarkupError);
  assert.throws(() => findDrafts('<p data-draft="new">Never closed'), /line 1 has no <\/p> end tag/);
});

test("stripDrafts: drafts on their own lines go with their lines; the rest is untouched", () => {
  const html = page(
    [
      "  <p>Before.</p>",
      '  <p data-draft="new">',
      "    A new paragraph over",
      "    two lines.",
      "  </p>",
      "  <p>After.</p>",
      "",
    ].join("\n"),
  );
  assert.equal(stripDrafts(html), page("  <p>Before.</p>\n  <p>After.</p>\n"));
});

test("stripDrafts: a phrase inside a sentence leaves no double space, and hugging end tags stay", () => {
  assert.equal(stripDrafts('<p>A <span data-draft="new">very</span> good day.</p>'), "<p>A good day.</p>");
  assert.equal(stripDrafts('<p>Good<span data-draft="new">, really</span>.</p>'), "<p>Good.</p>");
  const hugging = [
    '<span class="compact-list-text"',
    "  >Almost all of his books.",
    '  <span class="draft-inline" data-draft',
    "    >Your reaction</span",
    "  ></span",
    ">",
  ].join("\n");
  assert.equal(stripDrafts(hugging), '<span class="compact-list-text"\n  >Almost all of his books.\n  </span\n>');
});

test("stripDrafts: a new version goes and the live element stays; a removal keeps its element and loses its marker", () => {
  const replaced = page('  <p>Live.</p>\n  <p data-draft="replace">Reworded.</p>\n');
  assert.equal(stripDrafts(replaced), page("  <p>Live.</p>\n"));
  assert.equal(stripDrafts('<ul><li data-draft="remove" class="x">Going</li></ul>'), '<ul><li class="x">Going</li></ul>');
  assert.equal(stripDrafts('<p>A <span data-draft="remove">very</span> good day.</p>'), "<p>A very good day.</p>", "a phrase's bare span unwraps");
  assert.equal(stripDrafts('<p>A <span class="x" data-draft="remove">very</span> day.</p>'), '<p>A <span class="x">very</span> day.</p>');
  const multiLine = '<li\n  data-draft="remove"\n  data-record="x"\n>Going</li>';
  assert.equal(stripDrafts(multiLine), '<li\n  data-record="x"\n>Going</li>');
  const nested = '<section data-draft="remove">\n  <p>Old.</p>\n  <p data-draft="new">New.</p>\n</section>\n';
  assert.equal(stripDrafts(nested), "<section>\n  <p>Old.</p>\n</section>\n", "a draft inside a removal still goes");
  const inside = '<section data-draft="new">\n  <p data-draft="remove">x</p>\n</section>\n<p>y</p>\n';
  assert.equal(stripDrafts(inside), "<p>y</p>\n", "a draft inside a new section goes with it");
});

test("stripDrafts is idempotent and leaves nothing marked", () => {
  const html = page('  <p>A <span data-draft="new">b</span> c.</p>\n  <p data-draft>Placeholder</p>\n  <p data-draft="remove">d</p>\n');
  const once = stripDrafts(html);
  assert.equal(stripDrafts(once), once);
  assert.ok(!/data-draft/.test(once));
});

test("liveView leaves drafts out on thomaswhite.me only", () => {
  const html = '<p data-draft="new">x</p>';
  assert.equal(liveView(html, LIVE_HOST), "");
  assert.equal(liveView(html, "new.thomaswhite.me"), html);
});

test("every published page's drafts can be left out cleanly", async () => {
  for (const file of await listPublishedHtml(repositoryRoot)) {
    const live = stripDrafts(await readSiteFile(file));
    assert.ok(!/\sdata-draft\b/.test(live), `${file} still holds a draft`);
  }
});
