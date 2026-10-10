// Drafts: content saved in this repository but not published on thomaswhite.me.
//
// An element marked data-draft is a draft. The preview site (new.thomaswhite.me)
// publishes drafts as written, most marked by CSS (CSS/general.css; checks read
// as plain text). The live site's build (.github/workflows/pages.yml) runs
// stripDrafts() over every built page, and CI checks the pages as they will be
// live (liveView()), so a draft is never served, and never breaks the live
// site's checks, until it is published.
//
// The kinds, by the attribute's value:
//   data-draft          a placeholder still to write (class draft-note or draft-inline)
//   data-draft="check"  a sentence drafted from the record, waiting for approval
//   data-draft="new"    content not published yet
//   data-draft="replace"  a new version of the element just before it, which
//                       stays live until the draft is published; the editor
//                       records the live element as it was on it, in
//                       data-draft-of (a short hash of its source)
//   data-draft="remove" content that stays live until its removal is published
// Every kind but "remove" is left out of the live site; "remove" loses only its
// marker there. The editor at edit.thomaswhite.me writes and publishes them.
// Only an attribute named data-draft marks a draft: text that mentions it, on
// the page or in an attribute's value (alt text, a title), never does.

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const LIVE_HOST = "thomaswhite.me";
export const DRAFT_KINDS = new Set(["", "check", "new", "replace", "remove"]);

const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
// A start tag's attributes: a quoted value may hold ">".
const attributes = String.raw`((?:[^>"']|"[^"]*"|'[^']*')*)`;
// Comments; script and style elements whole (their start tags are read, their
// content is opaque); then any other start or end tag. Groups: 1 script or
// style, 2 its attributes; 3 "/" for an end tag, 4 the tag name, 5 attributes.
const tokenPattern = new RegExp(
  String.raw`<!--[\s\S]*?-->|<(script|style)\b${attributes}>[\s\S]*?<\/\1\s*>|<(\/?)([a-zA-Z][\w-]*)${attributes}>`,
  "g",
);
// One attribute of a start tag, as HTML reads it: a name, then an optional
// value, quoted or bare. Groups: 1 the name, 2 to 4 the value.
const attributePattern = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

// A start tag's attributes, one by one, from the text after its tag name:
// [{ name (lower case), value (null when there is none), start, end }], with
// offsets into `text`. A value is read whole, so what it says is never a name.
function readAttributes(text) {
  return Array.from(text.matchAll(attributePattern), (match) => ({
    name: match[1].toLowerCase(),
    value: match[2] ?? match[3] ?? match[4] ?? null,
    start: match.index,
    end: match.index + match[0].length,
  }));
}

// The data-draft attribute among a start tag's attributes, or undefined.
const draftMarker = (text) => readAttributes(text).find((attribute) => attribute.name === "data-draft");

export class DraftMarkupError extends Error {
  constructor(message) {
    super(message);
    this.name = "DraftMarkupError";
  }
}

function lineAt(html, offset) {
  let line = 1;
  for (let index = html.indexOf("\n"); index !== -1 && index < offset; index = html.indexOf("\n", index + 1)) line += 1;
  return line;
}

// Every element marked data-draft, in source order:
//   { tag, kind, start, end, startTagEnd, line, previous }
// with source offsets (the whole element is html.slice(start, end)). `previous`
// is the element just before it ({ tag, kind }, or null when text or nothing
// comes first). A draft must have an explicit end tag (or be a void element):
// anything else throws, so a build fails rather than publish a page cut in the
// wrong place.
export function findDrafts(html) {
  const drafts = [];
  const stack = [{ tag: "#root", lastChild: null }];
  const fail = (entry, reason) => {
    throw new DraftMarkupError(`The draft <${entry.tag}> on line ${lineAt(html, entry.start)} ${reason}.`);
  };
  const close = (entry, end) => {
    const parent = stack[stack.length - 1];
    parent.lastChild = { tag: entry.tag, kind: entry.kind, end };
    if (entry.kind !== null) {
      const draft = { ...entry, end, line: lineAt(html, entry.start) };
      delete draft.lastChild;
      drafts.push(draft);
    }
  };
  const opened = (tag, attrs, start, startTagEnd) => {
    const marker = draftMarker(attrs);
    const parent = stack[stack.length - 1];
    const previous = parent.lastChild && !html.slice(parent.lastChild.end, start).trim() ? parent.lastChild : null;
    return {
      tag,
      kind: marker ? (marker.value ?? "") : null,
      start,
      startTagEnd,
      previous: previous ? { tag: previous.tag, kind: previous.kind } : null,
      lastChild: null,
    };
  };
  for (const match of html.matchAll(tokenPattern)) {
    if (match[0].startsWith("<!--")) continue;
    if (match[1]) {
      // A script or style element, whole: it can be a draft like any other.
      const startTagEnd = match.index + `<${match[1]}${match[2]}>`.length;
      close(opened(match[1].toLowerCase(), match[2], match.index, startTagEnd), match.index + match[0].length);
      continue;
    }
    const tag = match[4].toLowerCase();
    if (match[3]) {
      const open = stack.map((entry) => entry.tag).lastIndexOf(tag);
      if (open < 1) continue;
      for (const entry of stack.slice(open + 1)) if (entry.kind !== null) fail(entry, `has no </${entry.tag}> end tag`);
      const [entry] = stack.splice(open, 1);
      stack.length = open;
      close(entry, match.index + match[0].length);
      continue;
    }
    const entry = opened(tag, match[5], match.index, match.index + match[0].length);
    if (voidElements.has(tag) || match[5].trim().endsWith("/")) close(entry, entry.startTagEnd);
    else stack.push(entry);
  }
  for (const entry of stack.slice(1)) if (entry.kind !== null) fail(entry, `has no </${entry.tag}> end tag`);
  return drafts.sort((a, b) => a.start - b.start);
}

const anyTag = new RegExp(String.raw`<!--[\s\S]*?-->|<\/?[a-zA-Z][\w-]*${attributes}>`, "g");
const hasText = (html) => /\S/.test(html.replace(anyTag, ""));

// Paragraphs and list items that have words but would be served with none once
// the drafts `counted` picks are left out (every kind thomaswhite.me leaves out,
// by default): a draft that is all a <p> or <li> holds, even inside an <em>, or
// several that fill it between them. [{ tag, line }]; mark the element itself.
export function emptiedByDrafts(html, counted = (draft) => draft.kind !== "remove") {
  const drafts = findDrafts(html).filter(counted);
  const found = [];
  if (!drafts.length) return found;
  const open = [];
  for (const match of html.matchAll(tokenPattern)) {
    if (match[0].startsWith("<!--") || match[1]) continue;
    const tag = match[4].toLowerCase();
    if (tag !== "p" && tag !== "li") continue;
    if (!match[3]) {
      open.push({ tag, start: match.index, innerStart: match.index + match[0].length });
      continue;
    }
    const index = open.map((item) => item.tag).lastIndexOf(tag);
    if (index === -1) continue;
    const [item] = open.splice(index, 1);
    const [innerEnd, end] = [match.index, match.index + match[0].length];
    // Inside a draft (or one itself), it is left out whole.
    if (drafts.some((draft) => draft.start <= item.start && end <= draft.end)) continue;
    let left = "";
    let at = item.innerStart;
    for (const draft of drafts) {
      if (draft.start < at || draft.end > innerEnd) continue;
      left += html.slice(at, draft.start);
      at = draft.end;
    }
    if (at === item.innerStart) continue;
    left += html.slice(at, innerEnd);
    if (hasText(html.slice(item.innerStart, innerEnd)) && !hasText(left)) found.push({ tag, line: lineAt(html, item.start) });
  }
  return found;
}

const closing = /[.,;:!?)\]}’”»…%]/;
const opening = /[([{‘“«]/;

// A removal range: whole lines when the element has its lines to itself.
// Otherwise the element and the spacing it would leave wrong: the whitespace
// before it when closing punctuation or the end of a line follows (no "a bit ."
// and no trailing spaces), one of the two spaces around it, or the space after
// an opening bracket or quote. `last` is the removal before it ({ range, floor },
// or null): a range never reaches back into it, and straight after it the two
// count as one (its range may grow back). The editor's drafting.js
// (removalSplice) does exactly the same.
function removalRange(html, draft, last) {
  const floor = last ? last.range[1] : 0;
  const lineStart = html.lastIndexOf("\n", draft.start - 1) + 1;
  const lineEnd = html.indexOf("\n", draft.end);
  const lineFinish = lineEnd === -1 ? html.length : lineEnd;
  if (lineStart >= floor && !html.slice(lineStart, draft.start).trim() && !html.slice(draft.end, lineFinish).trim()) {
    return [lineStart, lineEnd === -1 ? html.length : lineEnd + 1];
  }
  const joined = last && draft.start === floor;
  const before = joined ? (last.range[0] > last.floor ? html[last.range[0] - 1] : "") : draft.start > floor ? html[draft.start - 1] : "";
  const next = html[draft.end] ?? "";
  const back = (from, limit, pattern) => {
    let start = from;
    while (start > limit && pattern.test(html[start - 1])) start -= 1;
    return start;
  };
  const closeUp = (pattern) => {
    if (joined) last.range[0] = back(last.range[0], last.floor, pattern);
    return [back(draft.start, floor, pattern), draft.end];
  };
  if (closing.test(next)) return closeUp(/\s/);
  if (next === "" || next === "\n" || next === "\r") return closeUp(/[ \t]/);
  if (before === " " && next === " ") return [draft.start, draft.end + 1];
  if (opening.test(before) && (next === " " || next === "\t")) {
    let end = draft.end;
    while (end < html.length && (html[end] === " " || html[end] === "\t")) end += 1;
    return [draft.start, end];
  }
  return [draft.start, draft.end];
}

// The page as thomaswhite.me serves it: every draft left out, except that a
// "remove" draft keeps its element and loses only the marker. Bytes outside
// the drafts are untouched.
export function stripDrafts(html) {
  const drafts = findDrafts(html);
  const edits = [];
  let last = null;
  for (const draft of drafts) {
    if (last && draft.start < last.range[1]) continue;
    if (draft.kind === "remove") {
      // The start tag's attributes, after "<" and its name, before its ">".
      const nameEnd = draft.start + 1 + draft.tag.length;
      const attributes = readAttributes(html.slice(nameEnd, draft.startTagEnd - 1));
      if (draft.tag === "span" && attributes.length === 1) {
        // A phrase's span has nothing but its marker: its tags go, its words stay.
        const endTagStart = html.lastIndexOf("</", draft.end - 1);
        edits.push([draft.start, draft.startTagEnd, ""], [endTagStart, draft.end, ""]);
        continue;
      }
      // All the whitespace before the marker goes too, so a start tag written
      // one attribute per line keeps its shape.
      const marker = attributes.find((attribute) => attribute.name === "data-draft");
      let from = nameEnd + marker.start;
      while (from > nameEnd && /\s/.test(html[from - 1])) from -= 1;
      edits.push([from, nameEnd + marker.end, ""]);
      continue;
    }
    const range = removalRange(html, draft, last);
    edits.push(range);
    last = { range, floor: last ? last.range[1] : 0 };
  }
  let result = html;
  for (const [start, end, text = ""] of edits.sort((a, b) => b[0] - a[0])) result = result.slice(0, start) + text + result.slice(end);
  return result;
}

// The page as its site serves it: drafts left out on thomaswhite.me, kept on
// the preview. `host` is the CNAME.
export function liveView(html, host) {
  return host === LIVE_HOST ? stripDrafts(html) : html;
}

// Every .html file under `directory`, rewritten without its drafts. Used on the
// built site (_site) by .github/workflows/pages.yml. Throws if a draft is
// malformed or anything marked is left, so the deploy never happens then.
export async function stripDirectory(directory) {
  const changed = [];
  const walk = async (folder) => {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith(".html")) {
        const html = await readFile(file, "utf8");
        const live = stripDrafts(html);
        // Start tags only: prose that names the attribute is not a draft.
        if (findDrafts(live).length) throw new DraftMarkupError(`${file} still holds a draft after stripping.`);
        if (live !== html) {
          await writeFile(file, live);
          changed.push(path.relative(directory, file));
        }
      }
    }
  };
  await walk(directory);
  return changed;
}

// node scripts/drafts.mjs --strip _site
if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const directory = process.argv[2] === "--strip" ? process.argv[3] : null;
  if (!directory) {
    console.error("Use: node scripts/drafts.mjs --strip <built site directory>");
    process.exit(2);
  }
  const changed = await stripDirectory(directory);
  const pages = `${changed.length} ${changed.length === 1 ? "page" : "pages"}`;
  console.log(changed.length ? `Left drafts out of ${pages}:\n${changed.map((file) => `  ${file}`).join("\n")}` : "No drafts to leave out.");
}
