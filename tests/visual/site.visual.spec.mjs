import { expect, test } from "@playwright/test";
import { openDeterministicPage } from "../support/browser-fixtures.mjs";

const screenshotOptions = {
  animations: "disabled",
  caret: "hide",
  scale: "css",
};

async function settleVisualAssets(page) {
  await expect(page.locator("[data-last-updated]")).toHaveText("31st August 2026");
  await page.locator("img").evaluateAll((images) => {
    images.forEach((image) => {
      image.loading = "eager";
    });
  });
  await expect
    .poll(() =>
      page.locator("img").evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
    )
    .toBe(true);
  await page.locator("img").evaluateAll((images) =>
    Promise.all(images.map((image) => image.decode())),
  );
}

test("@visual homepage desktop", async ({ page }) => {
  await openDeterministicPage(page, "/");
  await settleVisualAssets(page);

  await expect(page).toHaveScreenshot("home-desktop.png", {
    ...screenshotOptions,
    fullPage: true,
  });
});

test("@visual homepage phone navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDeterministicPage(page, "/");
  await page.locator(".nav-toggle").click();
  await settleVisualAssets(page);

  await expect(page).toHaveScreenshot("home-phone-navigation.png", screenshotOptions);
});

test("@visual phone header as a corner menu button after scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDeterministicPage(page, "/programming/");
  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
  await expect(page.locator(".site-header")).toHaveClass(/site-header--compact/);
  await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished)));
  await settleVisualAssets(page);

  await expect(page).toHaveScreenshot("phone-compact-header.png", screenshotOptions);
});

test("@visual programming desktop", async ({ page }) => {
  await openDeterministicPage(page, "/programming/");
  await settleVisualAssets(page);

  await expect(page).toHaveScreenshot("programming-desktop.png", {
    ...screenshotOptions,
    fullPage: true,
  });
});

test("@visual gallery dialog", async ({ page }) => {
  await openDeterministicPage(page, "/gallery/");
  await page.locator(".gallery-open").first().click();
  await settleVisualAssets(page);

  await expect(page).toHaveScreenshot("gallery-dialog.png", screenshotOptions);
});

test("@visual contact phone validation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDeterministicPage(page, "/contact/");
  await page.getByRole("button", { name: "Send message" }).click();
  await settleVisualAssets(page);

  await expect(page.locator(".contact-form")).toHaveScreenshot(
    "contact-phone-validation.png",
    screenshotOptions,
  );
});

test("@visual footer status link desktop", async ({ page }) => {
  await openDeterministicPage(page, "/");
  await page.locator(".footer-bottom").scrollIntoViewIfNeeded();
  await settleVisualAssets(page);

  await expect(page.locator(".footer-bottom")).toHaveScreenshot(
    "footer-status-desktop.png",
    screenshotOptions,
  );
});

test("@visual footer status link phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDeterministicPage(page, "/");
  await page.locator(".footer-bottom").scrollIntoViewIfNeeded();
  await settleVisualAssets(page);

  await expect(page.locator(".footer-bottom")).toHaveScreenshot(
    "footer-status-phone.png",
    screenshotOptions,
  );
});
