import assert from "node:assert/strict";
import test from "node:test";
import { startServer } from "../support/clean-url-server.mjs";

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
