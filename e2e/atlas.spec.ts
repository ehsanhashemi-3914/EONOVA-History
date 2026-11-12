/**
 * End-to-end tests: a real browser against the production build.
 * Each test follows something a visitor would actually do.
 *
 * Run:  npm run build  &&  npm run test:e2e
 */
import { expect, test, type Page } from "@playwright/test";

/** Start a test in English (the default language is Persian). */
async function useEnglish(page: Page, baseURL: string | undefined) {
  await page.context().addCookies([{ name: "eonova-locale", value: "en", url: baseURL ?? "http://localhost:3100" }]);
}

/** Collect browser console errors so a test can assert there were none. */
function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    // Failed tile requests are an expected, handled condition (offline fallback).
    if (message.type() === "error" && !/tiles\.openfreemap\.org|Failed to load resource|net::ERR/i.test(message.text())) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  return errors;
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "page is wider than the viewport").toBeLessThanOrEqual(1);
}

test.describe("language and direction", () => {
  test("opens in Persian, right-to-left, by default", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("EONOVA");
    await expect(page.getByText("گذشته را بکاوید. جهان را بفهمید.").first()).toBeVisible();
  });

  test("switches to English (LTR) and remembers it after a reload", async ({ page }) => {
    await page.goto("/entities");
    await page.getByRole("button", { name: "تغییر زبان به انگلیسی" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Civilizations and Empires");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Civilizations and Empires");

    // …and back again
    await page.getByRole("button", { name: "Switch to Persian" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });
});

test.describe("atlas", () => {
  test("changing the year changes what the atlas shows", async ({ page, baseURL }) => {
    const errors = trackConsoleErrors(page);
    await useEnglish(page, baseURL);
    await page.goto("/atlas?y=-499");

    const entityList = page.getByRole("complementary", { name: "Details" });
    await expect(entityList.getByRole("button", { name: /Achaemenid Empire/ })).toBeVisible();
    await expect(entityList.getByRole("button", { name: /Roman Empire/ })).toHaveCount(0);

    // The map itself: a WebGL canvas plus HTML place markers.
    await expect(page.locator("canvas.maplibregl-canvas")).toBeVisible();
    await expect(page.locator(".atlas-marker").first()).toBeAttached({ timeout: 30_000 });
    const markersAt500 = await page.locator(".atlas-marker").evaluateAll((nodes) => nodes.map((node) => node.textContent).sort());
    expect(markersAt500).toContain("Persepolis");

    // Jump to the 117 CE milestone.
    await page.getByRole("button", { name: "117 CE", exact: true }).click();
    await expect(page.getByRole("status").or(page.locator("output")).first()).toContainText("117 CE");
    await expect(entityList.getByRole("button", { name: /Roman Empire/ })).toBeVisible();
    await expect(entityList.getByRole("button", { name: /Achaemenid Empire/ })).toHaveCount(0);
    await expect(page).toHaveURL(/y=117/);

    await expect.poll(async () => page.locator(".atlas-marker").evaluateAll((nodes) => nodes.map((node) => node.textContent))).toContain("Rome");
    const markersAt117 = await page.locator(".atlas-marker").evaluateAll((nodes) => nodes.map((node) => node.textContent));
    expect(markersAt117).not.toContain("Persepolis");
    expect(markersAt117).not.toContain("Constantinople"); // not founded until 330 CE

    expect(errors).toEqual([]);
  });

  test("is honest when no outline exists for a year", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/atlas?y=-549");
    const panel = page.getByRole("complementary", { name: "Details" });
    await expect(panel.getByText("No reliable outline for 550 BCE").first()).toBeVisible();
    await expect(panel.getByText(/Nearest available reconstruction: 520 BCE/)).toBeVisible();

    await panel.getByRole("button", { name: "Go to 520 BCE" }).click();
    await expect(page).toHaveURL(/y=-519/);
    await expect(panel.getByText(/Approximate reconstructed extent/).first()).toBeVisible();
  });

  test("falls back to the built-in basemap when the tile server is unreachable", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    // Simulate being offline for the tile provider only.
    await page.route(/tiles.openfreemap.org/, (route) => route.abort());
    await page.goto("/atlas?y=-499");
    await expect(page.getByText(/Online map tiles are unavailable/)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator("canvas.maplibregl-canvas")).toBeVisible();
    // The historical layer still works on top of the offline basemap.
    await expect(page.locator(".atlas-marker").first()).toBeAttached({ timeout: 30_000 });
    await expect(page.getByText("Basemap: Natural Earth (public domain)")).toBeAttached();
  });

  test("restores a shared view from the URL", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/atlas?y=260&e=sasanian-empire&p=edessa");
    await expect(page.locator("output")).toContainText("260 CE");
    await expect(page.getByRole("complementary", { name: "Place" })).toContainText("Edessa");
    await expect(page.getByRole("button", { name: /Sasanian Empire/ })).toHaveAttribute("aria-expanded", "true");
  });

  test("ignores nonsense in the URL instead of breaking", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/atlas?y=banana&e=atlantis&p=nowhere");
    await expect(page.locator("output")).toContainText("550 BCE");
  });

  test("the step buttons and the year form move through time, never to a year 0", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/atlas?y=1");
    const output = page.locator("output");
    await expect(output).toContainText("1 CE");
    await page.getByRole("button", { name: "Back 1 year" }).click();
    await expect(output).toContainText("1 BCE");
    await expect(output).not.toContainText(/\b0\b/);
    await page.getByRole("button", { name: "Back 1 year" }).click();
    await expect(output).toContainText("2 BCE");
    await page.getByRole("button", { name: "Forward 10 years" }).click();
    await expect(output).toContainText("9 CE");
  });
});

test.describe("profiles, search and tools", () => {
  test("search finds a person and opens the profile with the keyboard", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/");
    await page.getByRole("button", { name: "Search the atlas" }).click();
    const input = page.getByRole("combobox");
    await input.fill("cyrus");
    await expect(page.getByRole("option").first()).toContainText("Cyrus II");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/people\/cyrus-ii$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cyrus II (the Great)");
  });

  test("search works in Persian and shows an empty state", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "جست‌وجو در اطلس" }).click();
    const input = page.getByRole("combobox");
    await input.fill("ساسانی");
    await expect(page.getByRole("option").first()).toContainText("ساسانی");
    await input.fill("qqqqzzzz");
    await expect(page.getByText("برای «qqqqzzzz» چیزی یافت نشد.")).toBeVisible();
    await input.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("an entity profile shows its kind, sources and related records", async ({ page, baseURL }) => {
    const errors = trackConsoleErrors(page);
    await useEnglish(page, baseURL);
    await page.goto("/entities/achaemenid-empire");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Achaemenid Empire");
    await expect(page.getByText("c. 550–330 BCE").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sources for this page" })).toBeVisible();
    await expect(page.getByRole("link", { name: /CYRUS iii\. Cyrus II The Great/ })).toHaveAttribute("href", /iranicaonline\.org/);

    await page.getByRole("link", { name: "Cyrus' capture of Babylon" }).click();
    await expect(page).toHaveURL(/\/events\/capture-of-babylon$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cyrus' capture of Babylon");
    await page.getByRole("link", { name: "Cyrus II (the Great)" }).first().click();
    await expect(page).toHaveURL(/\/people\/cyrus-ii$/);
    expect(errors).toEqual([]);
  });

  test("favorites survive a reload and appear on the saved page", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/entities/sasanian-empire");
    await page.getByRole("button", { name: "Add to saved: Sasanian Empire" }).click();
    const saved = page.getByRole("button", { name: "Remove from saved: Sasanian Empire" });
    await expect(saved).toHaveAttribute("aria-pressed", "true");

    await page.reload();
    await expect(saved).toHaveAttribute("aria-pressed", "true");

    await page.goto("/favorites");
    await expect(page.getByRole("link", { name: "Sasanian Empire" })).toBeVisible();
    await page.getByRole("button", { name: "Clear all" }).click();
    await expect(page.getByText("Nothing saved yet.")).toBeVisible();
  });

  test("comparison warns when the two are different kinds of entity", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/compare?a=ancient-egypt&b=han-dynasty");
    await expect(page.getByRole("heading", { name: "These are different kinds of entity" })).toBeVisible();
    await expect(page.getByText(/Ancient Egypt is a Civilization; Han Dynasty is a Dynasty/)).toBeVisible();

    // Egypt (to 30 BCE) and Rome (from 27 BCE) just miss each other…
    await page.getByLabel("Second entity").selectOption("roman-empire");
    await expect(page).toHaveURL(/b=roman-empire/);
    await expect(page.getByText("They did not exist at the same time: 3 years separate them.")).toBeVisible();
    // …whereas Egypt and the Achaemenid Empire coexisted for the latter's whole span.
    await page.getByLabel("Second entity").selectOption("achaemenid-empire");
    await expect(page.getByText(/They coexisted for about 220 years/)).toBeVisible();
  });

  test("the quiz can be played to the end and scores the answers", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/quiz");
    await page.getByLabel("Category").selectOption("geography");
    await expect(page.getByText("3 questions available")).toBeVisible();
    await page.getByRole("button", { name: "Start" }).click();

    for (let i = 0; i < 3; i++) {
      await expect(page.getByText(`Question ${i + 1} of 3`)).toBeVisible();
      await page.locator("main ul button").first().click();
      await expect(page.getByText(/^(Correct|Not quite)$/)).toBeVisible();
      await page.getByRole("button", { name: i === 2 ? "See result" : "Next question" }).click();
    }
    await expect(page.getByRole("heading", { name: /\d of 3 correct/ })).toBeVisible();
    await page.getByRole("button", { name: "Play again" }).click();
    await expect(page.getByText("Question 1 of 3")).toBeVisible();
  });

  test("the timeline filters events", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    await page.goto("/timeline");
    await page.getByLabel("Entity").selectOption("sasanian-empire");
    await page.getByLabel("Category").selectOption("battle");
    await expect(page.getByText("3 results")).toBeVisible();
    await expect(page).toHaveURL(/entity=sasanian-empire/);
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByText("30 results")).toBeVisible();
  });

  test("unknown addresses show the not-found page", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    const response = await page.goto("/entities/atlantis");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page is not in the atlas");
  });
});

test.describe("layout", () => {
  const routes = [
    "/",
    "/atlas",
    "/timeline",
    "/entities",
    "/entities/roman-empire",
    "/events",
    "/events/battle-of-al-qadisiyyah",
    "/people",
    "/people/khosrow-i",
    "/compare",
    "/quiz",
    "/sources",
    "/about",
    "/favorites",
  ];

  for (const route of routes) {
    test(`${route} renders without errors or horizontal overflow (Persian)`, async ({ page }) => {
      const errors = trackConsoleErrors(page);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("main h1").first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
      expect(errors).toEqual([]);
    });
  }

  test("English pages do not overflow either", async ({ page, baseURL }) => {
    await useEnglish(page, baseURL);
    for (const route of ["/", "/atlas", "/entities/roman-empire", "/compare", "/sources"]) {
      await page.goto(route);
      await expectNoHorizontalOverflow(page);
    }
  });
});
