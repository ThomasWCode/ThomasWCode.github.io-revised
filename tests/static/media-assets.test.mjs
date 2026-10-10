import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { pages } from "../support/page-manifest.mjs";
import { readImageDimensions } from "../support/image-dimensions.mjs";
import { readSiteFile, repositoryRoot, servedHtml } from "../support/site-files.mjs";

function imageTags(html) {
  return Array.from(html.matchAll(/<img\s[\s\S]*?>/gi), (match) => match[0]);
}

function attribute(markup, name) {
  return markup.match(new RegExp(`${name}="([^"]+)"`, "i"))?.[1];
}

test("responsive image descriptors match intrinsic widths", async () => {
  const errors = [];

  for (const page of pages) {
    const html = servedHtml(await readSiteFile(page.source));
    for (const srcset of Array.from(html.matchAll(/srcset="([^"]+)"/g), (match) => match[1])) {
      for (const candidate of srcset.split(",")) {
        const [source, descriptor] = candidate.trim().split(/\s+/);
        if (!source.startsWith("/") || !descriptor?.endsWith("w")) {
          continue;
        }

        const buffer = await readFile(path.join(repositoryRoot, decodeURIComponent(source.slice(1))));
        const dimensions = readImageDimensions(buffer);
        const declaredWidth = Number(descriptor.slice(0, -1));
        if (dimensions.width !== declaredWidth) {
          errors.push(`${page.source}: ${source} is ${dimensions.width}px, declared ${descriptor}`);
        }
      }
    }
  }

  assert.deepEqual(errors, []);
});

test("image dimensions and deferred-loading attributes are internally consistent", async () => {
  const errors = [];

  for (const page of pages) {
    const html = servedHtml(await readSiteFile(page.source));
    for (const markup of imageTags(html)) {
      const source = attribute(markup, "src");
      if (!source?.startsWith("/") || source.endsWith(".svg")) {
        continue;
      }

      const buffer = await readFile(path.join(repositoryRoot, decodeURIComponent(source.slice(1))));
      const dimensions = readImageDimensions(buffer);
      const width = Number(attribute(markup, "width"));
      const height = Number(attribute(markup, "height"));

      if (width !== dimensions.width || height !== dimensions.height) {
        errors.push(
          `${page.source}: ${source} is ${dimensions.width}x${dimensions.height}, declared ${width}x${height}`,
        );
      }

      if (attribute(markup, "loading") === "lazy" && attribute(markup, "decoding") !== "async") {
        errors.push(`${page.source}: ${source} is lazy-loaded without decoding=async`);
      }
    }
  }

  assert.deepEqual(errors, []);
});

test("gallery expansion sources stay below one megabyte", async () => {
  const html = servedHtml(await readSiteFile("gallery.html"));
  const sources = Array.from(html.matchAll(/data-full-src="([^"]+)"/g), (match) => match[1]);

  assert.ok(sources.length > 0);
  for (const source of sources) {
    const fileStats = await stat(path.join(repositoryRoot, decodeURIComponent(source.slice(1))));
    assert.ok(fileStats.size < 1_000_000, `${source} is ${fileStats.size} bytes`);
  }
});

test("the above-the-fold gallery image is eagerly prioritised", async () => {
  const html = servedHtml(await readSiteFile("gallery.html"));
  const firstGalleryImage = html.match(
    /<figure class="gallery-item gallery-item--wide">[\s\S]*?<img([\s\S]*?)\/>/,
  )?.[1];

  assert.ok(firstGalleryImage);
  assert.doesNotMatch(firstGalleryImage, /loading="lazy"/);
  assert.match(firstGalleryImage, /fetchpriority="high"/);
});

test("every picture has responsive sources and an image fallback", async () => {
  for (const page of pages) {
    const html = servedHtml(await readSiteFile(page.source));
    for (const picture of Array.from(html.matchAll(/<picture>([\s\S]*?)<\/picture>/gi), (match) => match[1])) {
      assert.match(picture, /<source\s[^>]*srcset="[^"]+"[^>]*>/i, page.source);
      assert.match(picture, /<img\s[^>]*src="[^"]+"[^>]*>/i, page.source);
    }
  }
});
