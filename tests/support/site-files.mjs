import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { liveView } from "../../scripts/drafts.mjs";

export const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export async function readSiteFile(relativePath) {
  return readFile(path.join(repositoryRoot, relativePath), "utf8");
}

export function stripFrontMatter(source) {
  return source.replace(/^---\r?\npermalink: [^\r\n]+\r?\n---\r?\n/, "");
}

// The site this checkout publishes (CNAME). thomaswhite.me leaves drafts out.
export const siteHost = (await readSiteFile("CNAME")).trim();

// A page as a site serves it (this checkout's, unless `host` names another):
// front matter processed and, on thomaswhite.me, drafts left out
// (scripts/drafts.mjs), so the checks see the live pages.
export function servedHtml(source, host = siteHost) {
  return liveView(stripFrontMatter(source), host);
}

export function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&rsquo;", "’")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export function textContent(markup) {
  return decodeHtml(markup.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
}
