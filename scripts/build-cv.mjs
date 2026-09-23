import path from "node:path";
import { chromium } from "@playwright/test";
import { startServer } from "../tests/support/clean-url-server.mjs";
import { repositoryRoot } from "./content-review.mjs";

const outputPath = path.join(repositoryRoot, "Tom-White-CV.pdf");
const server = await startServer({ port: 0 });
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
