import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never" }]]
    : [["line"]],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: {
    command: "node tests/support/clean-url-server.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: "chromium-desktop",
      testMatch: /e2e\/.*\.spec\.mjs/,
      grepInvert: /@phone-only|@reduced-motion|@no-js/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-phone",
      testMatch: /e2e\/.*\.spec\.mjs/,
      grepInvert: /@desktop-only|@reduced-motion|@no-js/,
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: "firefox-smoke",
      testMatch: /e2e\/.*\.spec\.mjs/,
      grep: /@smoke/,
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "webkit-smoke",
      testMatch: /e2e\/.*\.spec\.mjs/,
      grep: /@smoke/,
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-reduced-motion",
      testMatch: /e2e\/.*\.spec\.mjs/,
      grep: /@reduced-motion/,
      use: {
        ...devices["Desktop Chrome"],
        reducedMotion: "reduce",
      },
    },
    {
      name: "chromium-no-js",
      testMatch: /e2e\/.*\.spec\.mjs/,
      grep: /@no-js/,
      use: {
        ...devices["Desktop Chrome"],
        javaScriptEnabled: false,
      },
    },
    {
      name: "visual-chromium",
      testMatch: /visual\/.*\.spec\.mjs/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
