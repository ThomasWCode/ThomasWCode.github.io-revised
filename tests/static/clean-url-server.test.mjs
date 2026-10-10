import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { LIVE_HOST, stripDrafts } from "../../scripts/drafts.mjs";
import { startServer } from "../support/clean-url-server.mjs";
import { readSiteFile, repositoryRoot, stripFrontMatter } from "../support/site-files.mjs";

test("the local server models clean GitHub Pages routes without exposing front matter", async (context) => {
  const server = await startServer({ port: 0 });
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const response = await fetch(`${baseUrl}/programming/`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(html, /<title>Programming \| Tom White<\/title>/);
  assert.doesNotMatch(html, /^---/);
});

test("the local server sends a real media type for every kind of file in Images", async (context) => {
  const server = await startServer({ port: 0 });
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const samples = new Map();

  for (const file of await readdir(path.join(repositoryRoot, "Images"), { recursive: true })) {
    const extension = path.extname(file).toLowerCase();
    if (extension && !samples.has(extension)) {
      samples.set(extension, file.split(path.sep).join("/"));
    }
  }

  for (const [extension, file] of samples) {
    const response = await fetch(`http://127.0.0.1:${address.port}/Images/${file}`);
    await response.arrayBuffer();
    assert.equal(response.status, 200, file);
    assert.notEqual(response.headers.get("content-type"), "application/octet-stream", `${extension} (${file})`);
  }

  assert.equal(
    (await fetch(`http://127.0.0.1:${address.port}/Images/blog-card-texture.svg`)).headers.get("content-type"),
    "image/svg+xml",
  );
});

test("the local server serves folder index pages at their clean path", async (context) => {
  const server = await startServer({ port: 0 });
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/blog/`);

  assert.equal(response.status, 200);
  assert.match(await response.text(), /<title>Blog \| Tom White<\/title>/);
});

test("the local server returns real 404 responses for missing routes and traversal attempts", async (context) => {
  const server = await startServer({ port: 0 });
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const missing = await fetch(`${baseUrl}/not-a-page/`);
  const traversal = await fetch(`${baseUrl}/..%2Fpackage.json`);

  assert.equal(missing.status, 404);
  assert.equal(traversal.status, 404);
});

test("the local server serves a page as either site does: drafts left out as thomaswhite.me", async (context) => {
  const source = stripFrontMatter(await readSiteFile("cv.html"));
  for (const [servedAs, expected] of [
    [LIVE_HOST, stripDrafts(source)],
    ["new.thomaswhite.me", source],
  ]) {
    const server = await startServer({ port: 0, servedAs });
    context.after(() => new Promise((resolve) => server.close(resolve)));
    const response = await fetch(`http://127.0.0.1:${server.address().port}/cv/`);
    assert.equal(await response.text(), expected, servedAs);
  }
});
