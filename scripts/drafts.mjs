// Drafts: content saved in this repository but not published on thomaswhite.me.
//
// An element marked data-draft is a draft. The preview site (new.thomaswhite.me)
// publishes drafts as written, marked by CSS (CSS/general.css). The live site's
// build (.github/workflows/pages.yml) runs stripDrafts() over every built page,
// and CI checks the pages as they will be live (liveView()), so a draft is never
// served, and never breaks the live site's checks, until it is published.
//
// The kinds, by the attribute's value:
//   data-draft          a placeholder still to write (class draft-note or draft-inline)
//   data-draft="check"  a sentence drafted from the record, waiting for approval
//   data-draft="new"    content not published yet
//   data-draft="replace"  a new version of the element just before it, which
//                       stays live until the draft is published
//   data-draft="remove" content that stays live until its removal is published
// Every kind but "remove" is left out of the live site; "remove" loses only its
// marker there. The editor at edit.thomaswhite.me writes and publishes them.

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const LIVE_HOST = "thomaswhite.me";
export const DRAFT_KINDS = new Set(["", "check", "new", "replace", "remove"]);

const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const tokenPattern = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g;
const draftAttribute = /\sdata-draft(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?(?=[\s/>]|$)/i;
const removeMarker = /\s+data-draft\s*=\s*(?:"remove"|'remove'|remove)(?=[\s/>]|$)/i;

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
  for (const match of html.matchAll(tokenPattern)) {
    if (match[0].startsWith("<!--") || match[1]) continue;
    const tag = match[3].toLowerCase();
    if (match[2]) {
      const open = stack.map((entry) => entry.tag).lastIndexOf(tag);
      if (open < 1) continue;
      for (const entry of stack.slice(open + 1)) if (entry.kind !== null) fail(entry, `has no </${entry.tag}> end tag`);
      const [entry] = stack.splice(open, 1);
      stack.length = open;
      close(entry, match.index + match[0].length);
      continue;
    }
    const marker = draftAttribute.exec(` ${match[4]}`);
    const parent = stack[stack.length - 1];
    const previous = parent.lastChild && !html.slice(parent.lastChild.end, match.index).trim() ? parent.lastChild : null;
    const entry = {
      tag,
      kind: marker ? (marker[1] ?? marker[2] ?? marker[3] ?? "") : null,
      start: match.index,
      startTagEnd: match.index + match[0].length,
      previous: previous ? { tag: previous.tag, kind: previous.kind } : null,
      lastChild: null,
    };
    if (voidElements.has(tag) || match[4].trim().endsWith("/")) close(entry, entry.startTagEnd);
    else stack.push(entry);
  }
  for (const entry of stack.slice(1)) if (entry.kind !== null) fail(entry, `has no </${entry.tag}> end tag`);
  return drafts.sort((a, b) => a.start - b.start);
}

const hasText = (html) => /\S/.test(html.replace(/<[^>]*>/g, ""));

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
    const tag = match[3].toLowerCase();
    if (tag !== "p" && tag !== "li") continue;
    if (!match[2]) {
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

// A removal range, widened to whole lines when the element has its lines to
// itself, or by one space when it sits between two (so no double space is left).
function removalRange(html, draft) {
  const lineStart = html.lastIndexOf("\n", draft.start - 1) + 1;
  const lineEnd = html.indexOf("\n", draft.end);
  const after = lineEnd === -1 ? html.length : lineEnd + 1;
  if (!html.slice(lineStart, draft.start).trim() && !html.slice(draft.end, lineEnd === -1 ? html.length : lineEnd).trim()) {
    return [lineStart, after];
  }
  if (html[draft.start - 1] === " " && html[draft.end] === " ") return [draft.start, draft.end + 1];
  return [draft.start, draft.end];
}

// The page as thomaswhite.me serves it: every draft left out, except that a
// "remove" draft keeps its element and loses only the marker. Bytes outside
// the drafts are untouched.
export function stripDrafts(html) {
  const drafts = findDrafts(html);
  const edits = [];
  let coveredUntil = -1;
  for (const draft of drafts) {
    if (draft.start < coveredUntil) continue;
    if (draft.kind === "remove") {
      const startTag = html.slice(draft.start, draft.startTagEnd);
      if (draft.tag === "span" && /^<span\s+data-draft\s*=\s*(["']?)remove\1\s*>$/i.test(startTag)) {
        // A phrase's span has nothing but its marker: its tags go, its words stay.
        const endTagStart = html.lastIndexOf("</", draft.end - 1);
        edits.push([draft.start, draft.startTagEnd, ""], [endTagStart, draft.end, ""]);
        continue;
      }
      // All the whitespace before the marker goes too, so a start tag written
      // one attribute per line keeps its shape.
      const marker = removeMarker.exec(startTag);
      edits.push([draft.start + marker.index, draft.start + marker.index + marker[0].length, ""]);
      continue;
    }
    const [start, end] = removalRange(html, draft);
    edits.push([start, end, ""]);
    coveredUntil = draft.end;
  }
  let result = html;
  for (const [start, end, text] of edits.sort((a, b) => b[0] - a[0])) result = result.slice(0, start) + text + result.slice(end);
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
