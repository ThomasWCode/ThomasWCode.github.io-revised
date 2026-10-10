// Prints /cv/ to Tom-White-CV.pdf with Playwright Chromium, as this checkout's
// site serves the page (the committed PDF). With --live it prints the page as
// thomaswhite.me serves it, drafts left out; the live site's build
// (.github/workflows/pages.yml) does that with --out _site/Tom-White-CV.pdf, so
// the PDF thomaswhite.me serves never holds a draft.
//
//   node scripts/build-cv.mjs [--live] [--out <file>]
import path from "node:path";
import { chromium } from "@playwright/test";
import { startServer } from "../tests/support/clean-url-server.mjs";
import { repositoryRoot } from "./content-review.mjs";
import { LIVE_HOST } from "./drafts.mjs";

const args = process.argv.slice(2);
const out = args.indexOf("--out");
if (out !== -1 && !args[out + 1]) {
  console.error("Use: node scripts/build-cv.mjs [--live] [--out <file>]");
  process.exit(2);
}
const outputPath = out === -1 ? path.join(repositoryRoot, "Tom-White-CV.pdf") : path.resolve(args[out + 1]);
const server = await startServer({ port: 0, ...(args.includes("--live") ? { servedAs: LIVE_HOST } : {}) });
const { port } = server.address();
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {},
);

try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: "networkidle" });
  await page.evaluate("document.fonts.ready");
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log(`Wrote ${path.relative(repositoryRoot, outputPath)}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
