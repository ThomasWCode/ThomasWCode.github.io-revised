import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import lighthouse, { desktopConfig } from "lighthouse";
import { lighthouseConfig } from "../../lighthouse.config.mjs";
import { startServer } from "./clean-url-server.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportDirectory = path.join(repositoryRoot, ".lighthouseci");

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForChrome(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error("Chromium did not expose its debugging endpoint");
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

async function waitForExit(child, timeout) {
  if (child.exitCode !== null) {
    return true;
  }

  return Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    new Promise((resolve) => setTimeout(() => resolve(false), timeout)),
  ]);
}

async function stopChrome(child) {
  child.kill();
  if (await waitForExit(child, 5_000)) {
    return;
  }

  if (process.platform === "win32") {
    const taskkill = spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
    });
    await waitForExit(taskkill, 5_000);
  } else {
    child.kill("SIGKILL");
  }

  if (!(await waitForExit(child, 5_000))) {
    throw new Error("Chromium did not exit after forced termination");
  }
}

const server = await startServer({ port: 4173 });
const chromePort = await getFreePort();
const profileDirectory = await mkdtemp(path.join(os.tmpdir(), "thomaswhite-lighthouse-"));
const chrome = spawn(
  chromium.executablePath(),
  [
    "--headless=new",
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${profileDirectory}`,
    "--disable-gpu",
    "--no-first-run",
  ],
  { stdio: "ignore" },
);

let failed = false;

try {
  await waitForChrome(chromePort);
  await mkdir(reportDirectory, { recursive: true });

  for (const urlPath of lighthouseConfig.urls) {
    const categoryScores = Object.fromEntries(
      Object.keys(lighthouseConfig.thresholds).map((category) => [category, []]),
    );

    for (let run = 1; run <= lighthouseConfig.runs; run += 1) {
      const url = `http://127.0.0.1:4173${urlPath}`;
      const result = await lighthouse(url, {
        port: chromePort,
        logLevel: "error",
        output: "json",
        onlyCategories: Object.keys(lighthouseConfig.thresholds),
        blockedUrlPatterns: lighthouseConfig.blockedUrlPatterns,
      }, desktopConfig);

      if (result.lhr.configSettings.formFactor !== "desktop") {
        throw new Error("Lighthouse did not apply its desktop configuration");
      }

      const slug = urlPath === "/" ? "home" : urlPath.replaceAll("/", "");
      await writeFile(
        path.join(reportDirectory, `${slug}-${run}.json`),
        result.report,
        "utf8",
      );

      for (const category of Object.keys(lighthouseConfig.thresholds)) {
        categoryScores[category].push(result.lhr.categories[category].score);
      }
    }

    for (const [category, threshold] of Object.entries(lighthouseConfig.thresholds)) {
      const score = median(categoryScores[category]);
      const formattedScore = Math.round(score * 100);
      const formattedThreshold = Math.round(threshold * 100);
      console.log(`${urlPath} ${category}: ${formattedScore} (minimum ${formattedThreshold})`);
      if (score < threshold) {
        failed = true;
      }
    }
  }
} finally {
  await stopChrome(chrome);
  await new Promise((resolve) => server.close(resolve));
  await rm(profileDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
}

if (failed) {
  process.exitCode = 1;
}
