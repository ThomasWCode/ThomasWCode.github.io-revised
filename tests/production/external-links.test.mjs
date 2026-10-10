import assert from "node:assert/strict";
import test from "node:test";
import { externalRedirects, pages } from "../support/page-manifest.mjs";
import { readSiteFile, stripFrontMatter } from "../support/site-files.mjs";

const acceptedRestrictedStatuses = new Set([401, 403, 405, 429]);

async function checkUrl(url) {
  let lastResult;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      let response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        headers: { "User-Agent": "thomaswhite.me external link test" },
      });
      if (response.status === 405) {
        response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          signal: AbortSignal.timeout(15_000),
          headers: { "User-Agent": "thomaswhite.me external link test" },
        });
      }

      lastResult = `${response.status} ${response.url}`;
      if (response.status < 400 || acceptedRestrictedStatuses.has(response.status)) {
        return;
      }
    } catch (error) {
      lastResult = error.message;
    }
  }

  assert.fail(`${url}: ${lastResult}`);
}

test("published external links remain reachable", async () => {
  const urls = new Set();

  for (const page of pages) {
    const html = stripFrontMatter(await readSiteFile(page.source));
    for (const match of html.matchAll(/href="(https:\/\/[^"#]+)"/g)) {
      urls.add(match[1]);
    }
  }

  for (const redirect of externalRedirects) {
    urls.add(redirect.target);
  }

  const failures = [];
  const queue = [...urls];
  const workers = Array.from({ length: Math.min(4, queue.length) }, async () => {
    while (queue.length > 0) {
      const url = queue.shift();
      try {
        await checkUrl(url);
      } catch (error) {
        failures.push(error.message);
      }
    }
  });

  await Promise.all(workers);
  assert.deepEqual(failures, []);
});
