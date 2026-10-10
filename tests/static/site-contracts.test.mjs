import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { HtmlValidate } from "html-validate";
import { listPublishedHtml } from "../../scripts/content-review.mjs";
import {
  documents,
  externalRedirects,
  pages,
  publishedSources,
  redirects,
  statusPageUrl,
} from "../support/page-manifest.mjs";
import {
  readSiteFile,
  repositoryRoot,
  servedHtml,
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

function frontMatter(permalink) {
  return new RegExp(`^---\\r?\\npermalink: ${permalink.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\r?\\n---\\r?\\n`);
}

test("the page manifest covers every published HTML file", async () => {
  const files = await listPublishedHtml(repositoryRoot);

  assert.deepEqual(files, [...publishedSources].sort());
});

for (const page of pages) {
  test(`${page.source} preserves the GitHub Pages and metadata contracts`, async () => {
    const source = await readSiteFile(page.source);
    const html = servedHtml(source);

    assert.match(source, frontMatter(page.path));
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
    const html = servedHtml(await readSiteFile(page.source));
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
    const html = servedHtml(await readSiteFile(page.source));
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
        `<a\\s+class="footer-status-link external-link"\\s+href="${statusPageUrl}"\\s+target="_blank"\\s+rel="noopener noreferrer"\\s+aria-label="Website status"\\s*>\\s*Status</a\\s*>`,
      ),
    );
    assert.equal(matches(html, /class="footer-status-link[ "]/g).length, 1);
  });

  test(`${page.source} is valid HTML after front matter processing`, async () => {
    const report = await validator.validateString(servedHtml(await readSiteFile(page.source)));
    const messages = report.results.flatMap((result) =>
      result.messages.map((message) => `${message.line}:${message.column} ${message.ruleId} ${message.message}`),
    );

    assert.equal(messages.join("\n"), "");
  });
}

for (const printDocument of documents) {
  test(`${printDocument.source} is an unlinked, unindexed print document`, async () => {
    const source = await readSiteFile(printDocument.source);
    const html = servedHtml(source);
    const report = await validator.validateString(html);
    const messages = report.results.flatMap((result) =>
      result.messages.map((message) => `${message.line}:${message.column} ${message.ruleId} ${message.message}`),
    );

    assert.match(source, frontMatter(printDocument.path));
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

for (const redirect of redirects) {
  test(`${redirect.source} redirects its old URL to a published page`, async () => {
    const source = await readSiteFile(redirect.source);
    const html = servedHtml(source);
    const targetPath = redirect.target.split("#")[0];
    const target = pages.find((page) => page.path === targetPath);
    const report = await validator.validateString(html);
    const messages = report.results.flatMap((result) =>
      result.messages.map((message) => `${message.line}:${message.column} ${message.ruleId} ${message.message}`),
    );

    assert.ok(target, `${redirect.target} is not a page in the manifest`);
    assert.match(source, frontMatter(redirect.path));
    assert.ok(html.includes(`<meta http-equiv="refresh" content="0; url=${redirect.target}" />`));
    assert.ok(html.includes(`<link rel="canonical" href="${target.canonical}" />`));
    assert.match(html, /<meta name="robots" content="noindex"\s*\/>/);
    assert.ok(html.includes(`<a href="${redirect.target}">`), "no-refresh fallback link");
    assert.equal(textContent(html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || ""), redirect.heading);
    assert.equal(messages.join("\n"), "");
  });
}

for (const redirect of externalRedirects) {
  test(`${redirect.source} forwards its short URL to ${redirect.target}`, async () => {
    const source = await readSiteFile(redirect.source);
    const html = servedHtml(source);
    const report = await validator.validateString(html);
    const messages = report.results.flatMap((result) =>
      result.messages.map((message) => `${message.line}:${message.column} ${message.ruleId} ${message.message}`),
    );

    assert.match(redirect.target, /^https:\/\//, `${redirect.target} is not an external HTTPS URL`);
    assert.match(source, frontMatter(redirect.path));
    assert.ok(html.includes(`<meta http-equiv="refresh" content="0; url=${redirect.target}" />`));
    assert.ok(html.includes(`<link rel="canonical" href="${redirect.target}" />`));
    assert.match(html, /<meta name="robots" content="noindex"\s*\/>/);
    assert.ok(html.includes(`<a href="${redirect.target}">`), "no-refresh fallback link");
    assert.equal(textContent(html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || ""), redirect.heading);
    assert.equal(messages.join("\n"), "");
  });
}

test("structured data parses and describes the same Person everywhere", async () => {
  const people = [];

  function collectPeople(node, file) {
    if (Array.isArray(node)) {
      node.forEach((child) => collectPeople(child, file));
    } else if (node && typeof node === "object") {
      if (node["@type"] === "Person") {
        people.push({ file, name: node.name, url: node.url, sameAs: JSON.stringify(node.sameAs) });
      }
      Object.values(node).forEach((child) => collectPeople(child, file));
    }
  }

  for (const page of [...pages, ...documents]) {
    const html = servedHtml(await readSiteFile(page.source));
    for (const match of matches(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      collectPeople(JSON.parse(match[1]), page.source);
    }
  }

  const reference = people.find((person) => person.file === "index.html");
  assert.ok(reference, "index.html must describe Tom as a Person");
  for (const person of people) {
    assert.deepEqual(
      { name: person.name, url: person.url, sameAs: person.sameAs },
      { name: reference.name, url: reference.url, sameAs: reference.sameAs },
      person.file,
    );
  }
});

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

  for (const page of [...pages, ...documents, ...redirects, ...externalRedirects]) {
    const html = servedHtml(await readSiteFile(page.source));
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

test("only links to the site's own pages open in the same tab", async () => {
  const pagePaths = new Set([...pages, ...documents, ...redirects].map((page) => page.path));
  const wrong = [];

  for (const page of [...pages, ...documents, ...redirects]) {
    const html = servedHtml(await readSiteFile(page.source));

    for (const [tag] of matches(html, /<a\s[^>]*>/g)) {
      const href = tag.match(/\shref="([^"]*)"/)?.[1] ?? "";
      const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
      const sitePage = href.startsWith("#") || pathname === "/" || pagePaths.has(pathname);
      const newTab = /\starget="_blank"/.test(tag);
      const noOpener = /\srel="[^"]*\bnoopener\b[^"]*"/.test(tag);

      if (sitePage ? newTab : !(newTab && noOpener)) {
        wrong.push(`${page.source}: ${href}`);
      }
    }
  }

  assert.deepEqual(wrong, []);
});
