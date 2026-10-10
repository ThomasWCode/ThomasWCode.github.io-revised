import { expect, test } from "@playwright/test";
import { openDeterministicPage } from "../support/browser-fixtures.mjs";

const desktopWidths = [1025, 1060, 1100, 1140, 1280, 1440];

async function readNavigation(page, visible) {
  return page.evaluate((mode) => {
    const inner = document.querySelector(".navbar-inner");
    const shown = (element) =>
      mode === "hidden-attribute" ? !element.hidden : getComputedStyle(element).display !== "none";
    const items = Array.from(document.querySelectorAll("[data-nav-item]"), (item) => {
      const copy = document.querySelector(`[data-nav-copy="${item.dataset.navItem}"]`);
      return {
        key: item.dataset.navItem,
        inBar: shown(item),
        inMore: shown(copy),
        itemAriaHidden: item.getAttribute("aria-hidden"),
        copyAriaHidden: copy.getAttribute("aria-hidden"),
      };
    });

    return {
      overflow: inner.scrollWidth - inner.clientWidth,
      contactRight: document.querySelector(".contact-nav").getBoundingClientRect().right,
      viewportWidth: document.documentElement.clientWidth,
      headerHeight: document.querySelector(".site-header").getBoundingClientRect().height,
      items,
    };
  }, visible);
}

function expectPriorityOrder(items) {
  const inBar = items.map((item) => item.inBar);
  const firstInMore = inBar.indexOf(false);

  if (firstInMore > -1) {
    expect(inBar.slice(firstInMore)).not.toContain(true);
  }
}

for (const width of desktopWidths) {
  test(`@desktop-only the navigation fits one line at ${width}px and lists each page once`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const health = await openDeterministicPage(page, "/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".navbar")).toHaveClass(/nav-measured/);

    const navigation = await readNavigation(page, "hidden-attribute");

    expect(navigation.overflow).toBeLessThanOrEqual(1);
    expect(navigation.contactRight).toBeLessThanOrEqual(navigation.viewportWidth);
    for (const item of navigation.items) {
      expect(item.inBar, item.key).not.toBe(item.inMore);
      expect(item.inBar ? item.copyAriaHidden : item.itemAriaHidden, item.key).toBe("true");
    }
    expectPriorityOrder(navigation.items);
    if (width === 1440) {
      expect(navigation.items.every((item) => item.inBar)).toBe(true);
    }
    health.assertHealthy();
  });
}

test("@desktop-only the current page stays marked when it moves into More", async ({ page }) => {
  await page.setViewportSize({ width: 1025, height: 900 });
  await openDeterministicPage(page, "/gallery/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".navbar")).toHaveClass(/nav-measured/);

  const current = page.locator('[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveAttribute("href", "/gallery/");

  const inMore = await current.evaluate((link) => Boolean(link.closest(".more-menu")));
  await expect(page.locator(".more-toggle")).toHaveClass(inMore ? /current/ : /^(?!.*current)/);
});

test("@desktop-only the navigation refits when the window is resized", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openDeterministicPage(page, "/");
  await page.evaluate(() => document.fonts.ready);
  await page.setViewportSize({ width: 1025, height: 900 });

  await expect.poll(async () => (await readNavigation(page, "hidden-attribute")).overflow).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect
    .poll(async () => (await readNavigation(page, "hidden-attribute")).items.every((item) => item.inBar))
    .toBe(true);
});

test("@phone-only the mobile menu lists every page once", async ({ page }) => {
  await openDeterministicPage(page, "/");
  await page.locator(".nav-toggle").click();

  const links = await page
    .locator("#primary-navigation a")
    .evaluateAll((elements) =>
      elements.filter((element) => element.offsetParent !== null).map((element) => element.getAttribute("href")),
    );

  expect(links.length).toBeGreaterThan(0);
  expect(new Set(links).size).toBe(links.length);
});

async function finishAnimations(page) {
  await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished)));
}

test("@phone-only the header becomes a corner menu button once the page scrolls", async ({ page }) => {
  await openDeterministicPage(page, "/programming/");
  const header = page.locator(".site-header");
  const toggle = page.locator(".nav-toggle");
  const brand = page.locator(".brand-name");

  await expect(header).not.toHaveClass(/site-header--compact/);
  await expect(brand).toBeVisible();

  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
  await expect(header).toHaveClass(/site-header--compact/);
  await expect(brand).toBeHidden();
  await finishAnimations(page);

  const box = await toggle.boundingBox();
  const viewport = page.viewportSize();
  expect(Math.round(box.x + box.width)).toBe(viewport.width);
  expect(Math.round(box.y)).toBe(0);
  expect(
    await page.evaluate(() => Boolean(document.elementFromPoint(40, 35).closest(".site-header"))),
    "the empty header must not block taps on the page",
  ).toBe(false);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.locator("#primary-navigation a[href='/gallery/']:visible").click({ trial: true });
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(header).not.toHaveClass(/site-header--compact/);
  await expect(brand).toBeVisible();
});

test("@phone-only the mobile menu slides in and its rows follow one by one, top to bottom", async ({ page }) => {
  await openDeterministicPage(page, "/");
  await page.locator(".nav-toggle").click();
  const panel = page.locator("#primary-navigation");
  await expect(panel).toHaveClass(/nav-panel--open/);

  const rows = await panel.evaluate((element) =>
    Array.from(element.querySelectorAll(".nav-row"))
      .filter((row) => row.getClientRects().length > 0)
      .map((row) => ({
        text: row.textContent.trim(),
        top: row.getBoundingClientRect().top,
        delay: row.getAnimations()[0]?.effect.getComputedTiming().delay,
      })),
  );
  expect(rows.map((row) => row.text)).toContain("Home");
  expect(rows.at(-1).text).toBe("Contact :)");
  for (let index = 1; index < rows.length; index += 1) {
    expect(rows[index].delay, rows[index].text).toBeGreaterThan(rows[index - 1].delay);
  }
  expect(await panel.evaluate((element) => element.getAnimations().length)).toBe(1);

  await finishAnimations(page);
  await panel.getByRole("link", { name: "Gallery", exact: true }).filter({ visible: true }).click({ trial: true });
});

test("@phone-only the open mobile menu blurs the page, and slides off with its rows leaving bottom first", async ({ page }) => {
  await openDeterministicPage(page, "/");
  const header = page.locator(".site-header");
  const toggle = page.locator(".nav-toggle");
  const panel = page.locator("#primary-navigation");
  const backdropFilter = () =>
    header.evaluate((element) => {
      const backdrop = window.getComputedStyle(element, "::after");
      return backdrop.visibility === "visible" ? backdrop.backdropFilter : "none";
    });

  await toggle.click();
  await expect(header).toHaveClass(/site-header--menu-open/);
  expect(await backdropFilter()).toContain("blur");
  await finishAnimations(page);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(header).not.toHaveClass(/site-header--menu-open/);
  await expect(panel).toHaveClass(/nav-panel--closing/);
  await expect(panel).toBeVisible();

  const animations = await panel.evaluate((element) => ({
    panel: element.getAnimations().map((animation) => animation.animationName),
    rowDelays: Array.from(element.querySelectorAll(".nav-row"))
      .filter((row) => row.getClientRects().length > 0)
      .map((row) => row.getAnimations()[0]?.effect.getComputedTiming().delay),
  }));
  expect(animations.panel).toEqual(["nav-panel-out"]);
  for (let index = 1; index < animations.rowDelays.length; index += 1) {
    expect(animations.rowDelays[index]).toBeLessThan(animations.rowDelays[index - 1]);
  }

  await expect(panel).toBeHidden();
  await expect(panel).not.toHaveClass(/nav-panel--closing/);
  await finishAnimations(page);
  expect(await backdropFilter()).toBe("none");
});

test("@phone-only tapping the blurred page closes the mobile menu", async ({ page }) => {
  await openDeterministicPage(page, "/");
  const toggle = page.locator(".nav-toggle");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await finishAnimations(page);
  const viewport = page.viewportSize();
  await page.mouse.click(viewport.width / 2, viewport.height - 10);

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#primary-navigation")).toBeHidden();
});

test("@phone-only the mobile menu opens without motion when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openDeterministicPage(page, "/");
  await page.locator(".nav-toggle").click();

  await expect(page.locator("#primary-navigation")).toBeVisible();
  expect(
    await page.locator("#primary-navigation").evaluate((element) =>
      element.getAnimations({ subtree: true }).map((animation) => animation.animationName),
    ),
  ).toEqual([]);
});

test("@desktop-only the desktop header does not change when the page scrolls", async ({ page }) => {
  await openDeterministicPage(page, "/programming/");
  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

  await expect(page.locator(".site-header")).not.toHaveClass(/site-header--compact/);
});

for (const width of desktopWidths) {
  test(`@no-js the navigation fits one line without JavaScript at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const navigation = await readNavigation(page, "computed");

    expect(navigation.overflow).toBeLessThanOrEqual(1);
    expect(navigation.contactRight).toBeLessThanOrEqual(navigation.viewportWidth);
    for (const item of navigation.items) {
      expect(item.inBar, item.key).not.toBe(item.inMore);
    }
    expectPriorityOrder(navigation.items);
  });
}

test("@no-js the More menu opens on hover and keyboard focus without JavaScript", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const menu = page.locator("#more-navigation");

  await expect(menu).toBeHidden();
  await page.locator(".more-toggle").hover();
  await expect(menu).toBeVisible();
  await page.mouse.move(0, 400);
  await expect(menu).toBeHidden();
  await page.locator(".more-toggle").focus();
  await expect(menu).toBeVisible();
});
