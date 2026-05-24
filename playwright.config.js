// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directory where tests are located
  testDir: './tests',

  // Run tests sequentially (safer for checkout flows on shared demo environments)
  fullyParallel: false,

  // Retry once on CI to handle transient network issues with the demo server
  retries: process.env.CI ? 1 : 0,

  // Limit workers to 1 — we're testing a shared demo store, no parallel runs
  workers: 1,

  // HTML reporter gives a nice visual overview; also print to console
  reporter: [['html', { outputFolder: 'reports/playwright-report' }], ['list']],

  use: {
    // Base URL for all tests
    baseURL: 'https://www.shopware6-demo.development-s25.com',

    // Keep screenshots and traces on failure for easier debugging
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',

    // Slightly longer timeout — demo server can be slow
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // Run in headless mode by default; override with --headed flag
    headless: true,
  },

  // Global test timeout (3 minutes — checkout flow has multiple steps)
  timeout: 180000,

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 13'] },
    // },
  ],

  // Output folder for test artifacts (screenshots, videos, traces)
  outputDir: 'reports/test-results',
});
