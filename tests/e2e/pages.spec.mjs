import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { documents, pages, redirects, statusPageUrl } from "../support/page-manifest.mjs";
import { openDeterministicPage } from "../support/browser-fixtures.mjs";

for (const sitePage of pages) {
  test(`${sitePage.path} renders its shell, metadata and accessible content`, async ({ page }) => {
    const health = await openDeterministicPage(page, sitePage.path);

    await expect(page).toHaveTitle(sitePage.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(sitePage.heading);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", sitePage.canonical);
    await expect(page.getByRole("link", { name: "Website status" })).toHaveAttribute(
      "href",
      statusPageUrl,
    );
    await expect(page.locator('[aria-current="page"]')).toHaveCount(sitePage.inNavigation ? 1 : 0);

    const duplicateIds = await page.locator("[id]").evaluateAll((elements) => {
      const seen = new Set();
      return elements
        .map((element) => element.id)
        .filter((id) => seen.has(id) || !seen.add(id));
    });
    expect(duplicateIds).toEqual([]);

    const overflows = await page.evaluate(() => ({
      body: document.body.scrollWidth - document.body.clientWidth,
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(overflows.body).toBeLessThanOrEqual(1);
    expect(overflows.document).toBeLessThanOrEqual(1);

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(
      accessibility.violations.map((violation) => ({
        id: violation.id,
        targets: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
    health.assertHealthy();
  });
}

for (const printDocument of documents) {
  test(`${printDocument.path} renders as an accessible print document`, async ({ page }) => {
    const health = await openDeterministicPage(page, printDocument.path);

    await expect(page).toHaveTitle(printDocument.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(printDocument.heading);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.map((violation) => violation.id)).toEqual([]);
    health.assertHealthy();
  });
}

for (const redirect of redirects) {
  test(`${redirect.path} forwards visitors to ${redirect.target}`, async ({ page }) => {
    await openDeterministicPage(page, redirect.path);

    await expect(page).toHaveURL(new RegExp(`${redirect.target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sport, music & drama");
  });
}

test("@smoke the homepage loads in each browser engine", async ({ page }) => {
  const health = await openDeterministicPage(page, "/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hi, I’m Tom.");
  await expect(page.getByRole("link", { name: "Website status" })).toBeVisible();
  await expect(page.locator("[data-last-updated]")).toHaveText("31st August 2026");
  health.assertHealthy();
});

test("@desktop-only the More menu opens, closes with Escape and restores focus", async ({ page }) => {
  await openDeterministicPage(page, "/");
  const toggle = page.getByRole("button", { name: "More" });

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#more-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("@phone-only the mobile menu opens, closes with Escape and restores focus", async ({ page }) => {
  await openDeterministicPage(page, "/");
  const toggle = page.locator(".nav-toggle");

  await expect(toggle).toHaveAttribute("aria-label", "Open navigation menu");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#primary-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toHaveAttribute("aria-label", "Open navigation menu");
  await expect(toggle).toBeFocused();
});

test("the skip link moves keyboard focus to main content", async ({ page }) => {
  await openDeterministicPage(page, "/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("the overlay only replaces the native scrollbar for fine pointers", async ({ page }) => {
  await openDeterministicPage(page, "/");

  const scrollbarState = await page.evaluate(() => ({
    customScrollbarDisplay: getComputedStyle(document.querySelector(".site-scrollbar")).display,
    hasFinePointer: matchMedia("(pointer: fine)").matches,
    nativeScrollbarWidth: getComputedStyle(document.documentElement).scrollbarWidth,
    overlayActive: document.documentElement.classList.contains("site-scrollbar-active"),
  }));

  expect(scrollbarState.overlayActive).toBe(true);

  if (scrollbarState.hasFinePointer) {
    expect(scrollbarState.customScrollbarDisplay).not.toBe("none");
    expect(scrollbarState.nativeScrollbarWidth).toBe("none");
  } else {
    expect(scrollbarState.customScrollbarDisplay).toBe("none");
    expect(scrollbarState.nativeScrollbarWidth).not.toBe("none");
  }
});

test("the current year and last-updated date use deterministic runtime values", async ({ page }) => {
  await openDeterministicPage(page, "/");

  await expect(page.locator("[data-current-year]")).toHaveText(String(new Date().getFullYear()));
  await expect(page.locator("[data-last-updated] time")).toHaveText("31st August 2026");
  await expect(page.locator("[data-last-updated] time")).toHaveAttribute(
    "datetime",
    "2026-08-31",
  );
});

test.describe("a visitor fourteen hours ahead of UTC", () => {
  test.use({ timezoneId: "Pacific/Kiritimati" });

  test("sees the deployment's own UTC day, not their local one", async ({ page }) => {
    await openDeterministicPage(page, "/", { lastModified: "Fri, 31 Jul 2026 23:30:00 GMT" });

    await expect(page.locator("[data-last-updated] time")).toHaveText("31st July 2026");
    await expect(page.locator("[data-last-updated] time")).toHaveAttribute(
      "datetime",
      "2026-07-31",
    );
  });
});

test("the last-updated fallback reports an unknown date without a Last-Modified header", async ({
  page,
}) => {
  await openDeterministicPage(page, "/", { lastModified: null });

  await expect(page.locator("[data-last-updated]")).toHaveText("unknown");
  await expect(page.locator("[data-last-updated] time")).toHaveCount(0);
});

test("analytics loads only after analytics consent", async ({ page }) => {
  let analyticsRequests = 0;
  await openDeterministicPage(page, "/", {
    onAnalyticsRequest() {
      analyticsRequests += 1;
    },
  });

  expect(analyticsRequests).toBe(0);
  await page.evaluate(() => {
    document.dispatchEvent(
      new CustomEvent("cookieyes_consent_update", {
        detail: { categories: { analytics: true } },
      }),
    );
  });
  await expect.poll(() => analyticsRequests).toBe(1);
});

test("@reduced-motion the reduced-motion stylesheet removes meaningful transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDeterministicPage(page, "/");

  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  const duration = await page.locator(".button").first().evaluate(
    (element) => getComputedStyle(element).transitionDuration,
  );
  expect(Math.max(...duration.split(",").map((value) => Number.parseFloat(value)))).toBeLessThanOrEqual(
    0.001,
  );
});

test("@reduced-motion the homepage cards do not zoom on hover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDeterministicPage(page, "/");

  // Read the transform two frames after the hover so a started transition has settled.
  const settledTransform = (locator, pseudoElement = null) =>
    locator.evaluate(
      (element, pseudo) =>
        new Promise((resolve) => {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => resolve(getComputedStyle(element, pseudo).transform)),
          );
        }),
      pseudoElement,
    );

  const photoCard = page.locator(".path-card:not(.path-card--plain)").first();
  await photoCard.hover();
  expect(await settledTransform(photoCard.locator("img"))).toBe("none");

  const plainCard = page.locator(".path-card--plain").first();
  await plainCard.hover();
  expect(await settledTransform(plainCard, "::before")).toBe("none");
});

test("@no-js core content and the status link remain available without JavaScript", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hi, I’m Tom.");
  await expect(page.getByRole("link", { name: "Website status" })).toBeVisible();
  await expect(page.locator("[data-last-updated]")).toHaveText(
    "unknown \u2013 please enable JavaScript",
  );
  expect(
    await page.evaluate(() => ({
      nativeScrollbarWidth: getComputedStyle(document.documentElement).scrollbarWidth,
      overlayActive: document.documentElement.classList.contains("site-scrollbar-active"),
    })),
  ).toEqual({ nativeScrollbarWidth: "auto", overlayActive: false });
});
