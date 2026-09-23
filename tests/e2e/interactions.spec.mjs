import { expect, test } from "@playwright/test";
import { openDeterministicPage } from "../support/browser-fixtures.mjs";

test("the contact form reports required and malformed fields", async ({ page }) => {
  await openDeterministicPage(page, "/contact/");

  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#formStatus")).toHaveText("Please fill in all required fields.");

  await page.locator("#name").fill("Test Person");
  await page.locator("#email").fill("not-an-email");
  await page.locator("#message").fill("Hello");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#formStatus")).toHaveText("Please enter a valid email address.");
});

test("the contact form explains blocked spam and returns to the form", async ({ page }) => {
  await openDeterministicPage(page, "/contact/");
  await page.locator("#name").fill("Test Person");
  await page.locator("#email").fill("sales@thomaswhite.me");
  await page.locator("#message").fill("Hello");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.locator("#spamBlockedMessage")).toBeVisible();
  await expect(page.locator("#spamReason")).toContainText("known automated spam source");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator("#contactForm")).toBeVisible();
  await expect(page.locator("#subject")).toBeFocused();
});

test("the contact form handles success, reset and retryable failure", async ({ page }) => {
  await openDeterministicPage(page, "/contact/");

  async function fillForm() {
    await page.locator("#name").fill("Test Person");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("Hello from an automated test");
  }

  await fillForm();
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#thankYouMessage")).toBeVisible();
  await page.getByRole("button", { name: "Send another message" }).click();
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.locator("#name")).toHaveValue("");

  await page.unroute("**/*");
  await openDeterministicPage(page, "/contact/", { formspreeStatus: 500 });
  await fillForm();
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#formStatus")).toContainText("problem sending your message");
  await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled();
});

test("the gallery dialog navigates, wraps, closes and restores focus", async ({ page }) => {
  await openDeterministicPage(page, "/gallery/");
  const buttons = page.locator(".gallery-open");
  const first = buttons.first();
  const firstSource = await first.getAttribute("data-full-src");
  const lastSource = await buttons.last().getAttribute("data-full-src");

  await first.click();
  await expect(page.locator("#galleryDialog")).toBeVisible();
  await expect(page.locator("#dialogImage")).toHaveAttribute("src", firstSource);
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#dialogImage")).toHaveAttribute("src", lastSource);
  await page.keyboard.press("Escape");
  await expect(page.locator("#galleryDialog")).not.toBeVisible();
  await expect(first).toBeFocused();
});

test("a YouTube facade becomes a titled, autoplaying iframe on demand", async ({ page }) => {
  await openDeterministicPage(page, "/tedx/");
  const facade = page.locator(".youtube-facade").first();
  await facade.evaluate((element) => {
    element.dataset.videoid = "test-video-id";
  });
  const videoId = await facade.getAttribute("data-videoid");
  const title = await facade.getAttribute("data-video-title");

  await facade.click();
  const iframe = page.locator("iframe.youtube-embed").first();
  await expect(iframe).toHaveAttribute("src", `https://www.youtube.com/embed/${videoId}?autoplay=1`);
  await expect(iframe).toHaveAttribute("title", title);
});

test("audio playback pauses other tracks and resets altered playback speed", async ({ page }) => {
  await openDeterministicPage(page, "/music&drama/");
  await page.evaluate(() => {
    const container = document.createElement("div");
    container.innerHTML = '<audio class="track-audio"></audio><audio class="track-audio"></audio>';
    document.body.appendChild(container);
    initialiseTrackAudio();
  });
  const tracks = page.locator(".track-audio");
  await expect(tracks).toHaveCount(2);

  const paused = await tracks.evaluateAll((elements) => {
    const calls = [];
    elements.forEach((element, index) => {
      element.pause = () => calls.push(index);
    });
    elements[0].dispatchEvent(new Event("play"));
    return calls;
  });
  expect(paused).toContain(1);

  await tracks.first().evaluate((track) => {
    track.playbackRate = 1.5;
    track.dispatchEvent(new Event("ratechange"));
  });
  await expect.poll(() => tracks.first().evaluate((track) => track.playbackRate)).toBe(1);
});

test("details toggles start collapsed with JavaScript and expand on demand", async ({ page }) => {
  await openDeterministicPage(page, "/");
  await page.evaluate(() => {
    const container = document.createElement("div");
    container.innerHTML =
      '<button type="button" class="details-toggle" data-info-toggle aria-controls="test-details" aria-expanded="true" hidden>Details</button>' +
      '<div class="details-panel" id="test-details"><ul><li>July 2026</li></ul></div>';
    document.querySelector("main").appendChild(container);
    initialiseInfoToggles();
  });
  const toggle = page.getByRole("button", { name: "Details" });
  const panel = page.locator("#test-details");

  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  await toggle.click();
  await expect(panel).toBeHidden();
});
