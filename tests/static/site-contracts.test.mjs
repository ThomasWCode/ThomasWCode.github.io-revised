import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { HtmlValidate } from "html-validate";
import { listPublishedHtml } from "../../scripts/content-review.mjs";
import { documents, pages, publishedSources, statusPageUrl } from "../support/page-manifest.mjs";
import {
  readSiteFile,
  repositoryRoot,
  stripFrontMatter,
  textContent,
} from "../support/site-files.mjs";

const validator = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    "attribute-boolean-style": "off",
    "doctype-style": "off",
    "long-title": "off",
    "no-inline-style": "off",
    "prefer-native-element": "off",
    "attribute-allowed-values": "off",
    "element-permitted-order": "off",
    "unique-landmark": "off",
    "void-style": "off",
  },
});

function matches(source, expression) {
  return Array.from(source.matchAll(expression));
}

test("the page manifest covers every published HTML file", async () => {
  const files = await listPublishedHtml(repositoryRoot);

  assert.deepEqual(files, [...publishedSources].sort());
});

for (const page of pages) {
  test(`${page.source} preserves the GitHub Pages and metadata contracts`, async () => {
    const source = await readSiteFile(page.source);
    const html = stripFrontMatter(source);

    assert.match(
      source,
      new RegExp(`^---\\r?\\npermalink: ${page.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\r?\\n---\\r?\\n`),
    );
    assert.equal(textContent(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || ""), page.title);
    assert.match(html, /<meta\s+name="description"\s+content="[^"]+"(?:\s+data-[\w-]+="[^"]*")*\s*\/>/i);
    assert.match(html, new RegExp(`<link rel="canonical" href="${page.canonical}"\\s*/>`));
    assert.match(html, new RegExp(`<meta property="og:url" content="${page.canonical}"\\s*/>`));
    assert.match(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/i);

    const headings = matches(html, /<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi);
    assert.equal(headings.length, 1);
    assert.equal(textContent(headings[0][1]), page.heading);
  });

  test(`${page.source} keeps the shared shell consistent`, async () => {
    const html = stripFrontMatter(await readSiteFile(page.source));
    const generalStyleIndex = html.indexOf('href="/CSS/general.css"');
    const pageStyleIndex = html.indexOf(`href="${page.stylesheet}"`);
    const sharedScriptIndex = html.indexOf('<script defer src="/JS/script.js"></script>');
    const closingBodyIndex = html.indexOf("</body>");

    assert.ok(generalStyleIndex > -1);
    assert.ok(pageStyleIndex > generalStyleIndex);
    assert.ok(sharedScriptIndex > pageStyleIndex);
    assert.ok(closingBodyIndex > sharedScriptIndex);
    assert.equal(html.slice(sharedScriptIndex + 43, closingBodyIndex).trim(), "");
    assert.match(html, /<a class="skip-link" href="#main-content">/);
    assert.match(html, /<main id="main-content"(?:\s[^>]*)?>/);
    assert.equal(matches(html, /data-current-year/g).length, 1);
    assert.equal(matches(html, /<span data-last-updated>/g).length, 1);
    assert.equal(matches(html, /aria-current="page"/g).length, page.inNavigation ? 1 : 0);
  });

  test(`${page.source} links to the public status page beside Last updated`, async () => {
    const html = stripFrontMatter(await readSiteFile(page.source));
    const footerBottom = html.match(/<div class="footer-bottom">([\s\S]*?)<\/div>/)?.[1] || "";
    const lastUpdatedParagraph = footerBottom.match(/<p>\s*Last updated[\s\S]*?<\/p>/)?.[0] || "";

    assert.match(
      lastUpdatedParagraph,
      /<span data-last-updated>unknown \u2013 please enable JavaScript<\/span>\./,
    );
    assert.match(lastUpdatedParagraph, /<span class="footer-status-separator" aria-hidden="true">·<\/span>/);
    assert.match(
      lastUpdatedParagraph,
      new RegExp(
        `<a\\s+class="footer-status-link"\\s+href="${statusPageUrl}"\\s+aria-label="Website status"\\s*>\\s*Status</a\\s*>`,
      ),
    );
    assert.equal(matches(html, /class="footer-status-link"/g).length, 1);
  });

  test(`${page.source} is valid HTML after front matter processing`, async () => {
    const report = await validator.validateString(stripFrontMatter(await readSiteFile(page.source)));
    const messages = report.results.flatMap((result) =>
      result.messages.map((message) => `${message.line}:${message.column} ${message.ruleId} ${message.message}`),
    );

    assert.equal(messages.join("\n"), "");
  });
}

for (const printDocument of documents) {
  test(`${printDocument.source} is an unlinked, unindexed print document`, async () => {
    const source = await readSiteFile(printDocument.source);
    const html = stripFrontMatter(source);
    const report = await validator.validateString(html);
    const messages = report.results.flatMap((result) =>
      result.messages.map((message) => `${message.line}:${message.column} ${message.ruleId} ${message.message}`),
    );

    assert.match(source, new RegExp(`^---\\r?\\npermalink: ${printDocument.path}\\r?\\n---\\r?\\n`));
    assert.equal(textContent(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || ""), printDocument.title);
    assert.match(html, /<meta name="robots" content="noindex"\s*\/>/);
    assert.match(html, new RegExp(`<link rel="canonical" href="${printDocument.canonical}"\\s*/>`));
    assert.ok(html.indexOf('href="/CSS/general.css"') > -1);
    assert.ok(html.indexOf(`href="${printDocument.stylesheet}"`) > html.indexOf('href="/CSS/general.css"'));
    assert.equal(textContent(html.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)?.[1] || ""), printDocument.heading);
    assert.equal(messages.join("\n"), "");
    await readSiteFile(printDocument.pdf).catch(() => assert.fail(`${printDocument.pdf} has not been built`));
  });
}

test("active site files contain no Vercel deployment assumptions", async () => {
  const files = [
    ...(await readdir(path.join(repositoryRoot, "JS"))).map((file) => `JS/${file}`),
    ...(await readdir(path.join(repositoryRoot, "CSS"))).map((file) => `CSS/${file}`),
    ...publishedSources,
    "CNAME",
    "package.json",
  ];

  for (const file of files) {
    const source = await readSiteFile(file);
    assert.doesNotMatch(source, /vercel/i, file);
  }
});

test("the Jekyll configuration keeps the private record, docs, tests and tooling unpublished", async () => {
  const config = await readSiteFile("_config.yml");
  const excluded = new Set(
    matches(config, /^\s+-\s+(\S+)\s*$/gm).map((match) => match[1]),
  );

  for (const entry of ["AGENTS.md", "docs/", "node_modules/", "package.json", "scripts/", "tests/"]) {
    assert.ok(excluded.has(entry), `_config.yml must exclude ${entry}`);
  }
});

test("all local site references resolve to files or clean page routes", async () => {
  const pagePaths = new Set([...pages, ...documents].map((page) => page.path));
  const missing = [];

  for (const page of [...pages, ...documents]) {
    const html = stripFrontMatter(await readSiteFile(page.source));
    const attributes = matches(
      html,
      /(?:href|src|poster|data-full-src)="(\/[^"]+)"|srcset="([^"]+)"/g,
    );

    for (const match of attributes) {
      const values = match[1]
        ? [match[1]]
        : match[2].split(",").map((candidate) => candidate.trim().split(/\s+/)[0]);

      for (const value of values) {
        const pathname = decodeURIComponent(value.split(/[?#]/)[0]);
        if (!pathname || pagePaths.has(pathname) || pathname === "/") {
          continue;
        }

        try {
          await readSiteFile(pathname.slice(1));
        } catch {
          missing.push(`${page.source}: ${value}`);
        }
      }
    }
  }

  assert.deepEqual(missing, []);
});
