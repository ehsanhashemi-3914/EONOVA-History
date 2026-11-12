import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright = end-to-end tests: it drives a real browser against the built
 * app, exactly as a visitor would. Run with `npm run test:e2e` (after
 * `npm run build`). Two "projects" run the same tests at desktop and phone size.
 *
 * Which browser?
 *   - default: Playwright's own Chromium  → first run `npx playwright install chromium`
 *   - or reuse a browser already on the machine, without downloading anything:
 *       PW_CHANNEL=msedge npm run test:e2e      (Windows: Microsoft Edge)
 *       PW_CHANNEL=chrome npm run test:e2e      (Google Chrome)
 */
const PORT = 3100;
const channel = process.env.PW_CHANNEL || undefined;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    channel,
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, channel } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel } },
  ],
});
