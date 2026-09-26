import assert from "node:assert/strict";
import test from "node:test";
import { findDrafts, LIVE_HOST } from "../../scripts/drafts.mjs";
import {
  externalRedirects,
  pages,
  productionBaseUrl,
  redirects,
  statusPageUrl,
} from "../support/page-manifest.mjs";
import { readSiteFile, textContent } from "../support/site-files.mjs";

const deployedHost = (await readSiteFile("CNAME")).trim();
const baseUrl = (
  process.env.PRODUCTION_BASE_URL || (deployedHost ? `https://${deployedHost}` : productionBaseUrl)
).replace(/\/$/, "");
const publicStatusUrl = process.env.STATUS_PAGE_URL || statusPageUrl;

async function fetchWithRetries(url, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "User-Agent": "thomaswhite.me production test" },
      });
      if (response.status >= 500 && attempt < attempts) {
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

for (const page of pages) {
  test(`production ${page.path} serves the expected page contract`, async () => {
    const response = await fetchWithRetries(`${baseUrl}${page.path}`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") || "", /^text\/html/i);
    assert.ok(
      textContent(html).includes(page.monitorKeyword),
      `${page.path} is missing ${page.monitorKeyword}`,
    );
    assert.ok(html.includes(`<link rel="canonical" href="${page.canonical}"`));
    assert.ok(html.includes(`href="${publicStatusUrl}"`));
    if (new URL(baseUrl).hostname === LIVE_HOST) {
      // The live build leaves drafts out (scripts/drafts.mjs). A draft here means
      // the site was built some other way, such as GitHub's automatic build.
      assert.deepEqual(findDrafts(html), [], `${page.path} is serving drafts: check the Pages source is GitHub Actions`);
    }
  });
}

for (const redirect of [...redirects, ...externalRedirects]) {
  test(`production ${redirect.path} still answers and forwards to ${redirect.target}`, async () => {
    const response = await fetchWithRetries(`${baseUrl}${redirect.path}`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.ok(html.includes(`url=${redirect.target}`), `${redirect.path} does not forward to ${redirect.target}`);
  });
}

test("every production page reports the same UTC Last-Modified day", async () => {
  const headers = [];
  const publishedDays = new Set();

  for (const page of pages) {
    const response = await fetchWithRetries(`${baseUrl}${page.path}`);
    const lastModified = response.headers.get("last-modified");

    assert.ok(lastModified, `${page.path} is missing a Last-Modified header`);
    assert.ok(
      Number.isFinite(Date.parse(lastModified)),
      `${page.path} has an unparseable Last-Modified header`,
    );
    assert.ok(
      Date.parse(lastModified) <= Date.now(),
      `${page.path} reports a Last-Modified date in the future`,
    );

    headers.push(lastModified);
    publishedDays.add(new Date(lastModified).toISOString().slice(0, 10));
  }

  assert.equal(
    publishedDays.size,
    1,
    `the deployed pages disagree about the last deployment day: ${[...new Set(headers)].join(", ")}`,
  );
});

test("the public status subdomain serves the branded status page over HTTPS", async () => {
  assert.match(publicStatusUrl, /^https:\/\//);
  const response = await fetchWithRetries(publicStatusUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Thomas White|Website status/i);
});
