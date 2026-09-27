import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { listPublishedHtml } from "../../scripts/content-review.mjs";
import { DraftMarkupError, emptiedByDrafts, findDrafts, LIVE_HOST, liveView, stripDirectory, stripDrafts } from "../../scripts/drafts.mjs";
import { readSiteFile, repositoryRoot } from "../support/site-files.mjs";

const page = (body) => `<main>\n${body}</main>\n`;

test("findDrafts: every kind, with offsets and the element before it", () => {
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
    drafts.map(({ tag, kind, previous }) => ({ tag, kind, previous })),
    [
      { tag: "p", kind: "replace", previous: { tag: "p", kind: null } },
      { tag: "span", kind: "new", previous: null },
      { tag: "span", kind: "", previous: null },
      { tag: "p", kind: "check", previous: { tag: "ul", kind: null } },
      { tag: "img", kind: "new", previous: { tag: "p", kind: "check" } },
    ],
  );
  assert.equal(html.slice(drafts[0].start, drafts[0].end), '<p data-draft="replace">Live, reworded.</p>');
  assert.equal(drafts[0].line, 3);
  assert.deepEqual(findDrafts('<p data-drafted="x">No.</p><p data-draft-note>No.</p>'), [], "only the data-draft attribute itself");
});

test("only an attribute named data-draft marks a draft: text in an attribute's value that mentions it stays live", () => {
  const live = [
    '<p title="how data-draft works">A live paragraph.</p>',
    '<img src="/Images/a.png" alt="A page with a data-draft element">',
    '<a href="/blog/how-this-site-works/" aria-label="Read how data-draft hides text">Read it</a>',
    `<p title='a data-draft="new" example'>Live.</p>`,
    '<meta name="description" content="What data-draft=remove does">',
  ];
  for (const html of live) {
    assert.deepEqual(findDrafts(html), [], html);
    assert.equal(stripDrafts(html), html, html);
  }
  // The removal marker is read the same way: a value that mentions it is left as written.
  assert.equal(stripDrafts('<p title="a data-draft=remove b" data-draft="remove">Going</p>'), '<p title="a data-draft=remove b">Going</p>');
  assert.equal(stripDrafts("<p data-draft=remove title=x>Going</p>"), "<p title=x>Going</p>", "a bare value");
  assert.equal(stripDrafts('<p DATA-DRAFT="new">Upper case</p><p>y</p>'), "<p>y</p>", "names are case-insensitive");
});

test("a new version's record of its live element (data-draft-of) goes with it, and marks nothing by itself", () => {
  const html = page('  <p>Live.</p>\n  <p data-draft="replace" data-draft-of="1a2b3c4d">Reworded.</p>\n');
  assert.deepEqual(
    findDrafts(html).map(({ tag, kind, previous }) => ({ tag, kind, previous })),
    [{ tag: "p", kind: "replace", previous: { tag: "p", kind: null } }],
  );
  assert.equal(stripDrafts(html), page("  <p>Live.</p>\n"));
  assert.deepEqual(findDrafts('<p>Live.</p><p data-draft-of="1a2b3c4d" data-draft="replace">Reworded.</p>').map((draft) => draft.kind), ["replace"]);
  assert.deepEqual(findDrafts('<p data-draft-of="1a2b3c4d">Not a draft.</p>'), []);
});

test("emptiedByDrafts: a paragraph or item whose words are all drafts, through wrappers and across siblings", () => {
  const lines = (html) => emptiedByDrafts(html).map(({ tag, line }) => `${tag}:${line}`);
  assert.deepEqual(lines('<ul>\n<li><span data-draft="new">Only this</span></li>\n</ul>'), ["li:2"]);
  assert.deepEqual(lines('<p><em><span data-draft="new">Only text</span></em></p>'), ["p:1"], "inside a wrapper");
  assert.deepEqual(lines('<p><span data-draft="new">One</span> <span data-draft>two</span></p>'), ["p:1"], "several between them");
  assert.deepEqual(lines('<p>Kept <span data-draft="new">and new</span>.</p>'), [], "words left");
  assert.deepEqual(lines('<p><span data-draft="remove">Stays live</span></p>'), [], "a removal keeps its words");
  assert.deepEqual(lines('<p><a href="/">Live</a><a data-draft="replace" href="/x">Live</a></p>'), [], "the live version stays");
  assert.deepEqual(lines('<section data-draft="new"><p><span data-draft="new">All</span></p></section>'), [], "left out whole");
  assert.deepEqual(lines('<p data-draft="new">Itself a draft</p>'), []);
  assert.deepEqual(lines("<p></p>"), [], "empty to begin with");
  const newOnly = (html) => emptiedByDrafts(html, (draft) => draft.kind === "new").length;
  assert.equal(newOnly('<li><span class="draft-inline" data-draft>Which term</span></li>'), 0, "other kinds can be left uncounted");
});

test("findDrafts reads quoted attributes whole, and scripts and styles can be drafts", () => {
  const quoted = '<p title="1 > 0" data-draft="new">x</p><p>y</p>';
  assert.deepEqual(findDrafts(quoted).map(({ tag, kind }) => ({ tag, kind })), [{ tag: "p", kind: "new" }]);
  assert.equal(stripDrafts(quoted), "<p>y</p>");
  const styled = '<style data-draft="new">p { color: red; }</style><p>y</p>';
  assert.deepEqual(findDrafts(styled).map(({ tag, kind }) => ({ tag, kind })), [{ tag: "style", kind: "new" }]);
  assert.equal(stripDrafts(styled), "<p>y</p>");
  assert.deepEqual(findDrafts(`<script>const x = '<p data-draft="new">';</script>`), [], "a script's content is not markup");
});

test("stripDrafts leaves no space before punctuation or at a line's end, nor after an opening bracket", () => {
  assert.equal(stripDrafts('<p>A bit <span data-draft="new">interesting</span>.</p>'), "<p>A bit.</p>");
  assert.equal(stripDrafts('<p>Kept\n  <span data-draft="new">and new</span>, then more.</p>'), "<p>Kept, then more.</p>");
  assert.equal(stripDrafts('<p>A bit <span data-draft="new">more</span>\n  words.</p>'), "<p>A bit\n  words.</p>");
  assert.equal(stripDrafts('<p>(<span data-draft="new">aside</span> text)</p>'), "<p>(text)</p>");
  assert.equal(stripDrafts('<p>A <span data-draft="new">b</span> <span data-draft="new">c</span> d.</p>'), "<p>A d.</p>", "neighbours count as one");
  assert.equal(stripDrafts('<p>A <span data-draft="new">b</span> <span data-draft="new">c</span>.</p>'), "<p>A.</p>");
  assert.equal(stripDrafts('<p>(<span data-draft="new">b</span> <span data-draft="new">c</span> d)</p>'), "<p>(d)</p>");
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

test("stripDirectory rewrites built pages, and prose that names the attribute is not a draft", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "drafts-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(path.join(directory, "index.html"), '<p>The data-draft attribute marks drafts.</p>\n<p data-draft="new">x</p>\n');
  await writeFile(path.join(directory, "plain.html"), "<p>No drafts.</p>\n");
  assert.deepEqual(await stripDirectory(directory), ["index.html"]);
  assert.equal(await readFile(path.join(directory, "index.html"), "utf8"), "<p>The data-draft attribute marks drafts.</p>\n");
});

test("every published page's drafts can be left out cleanly", async () => {
  for (const file of await listPublishedHtml(repositoryRoot)) {
    const live = stripDrafts(await readSiteFile(file));
    assert.deepEqual(findDrafts(live), [], `${file} still holds a draft`);
  }
});
