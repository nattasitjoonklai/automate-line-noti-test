import { defineConfig, devices } from "@playwright/test";

const Parallel = false;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // use this in prod
  // workers: process.env.CI ? 5 : undefined,
  // use for debug
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    video: "retain-on-failure",
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.CRM_BASE_URL,

    launchOptions: {
      args: ["--start-maximized"], // open fullscreen
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    // ----------------------------
    // Setup project
    // ----------------------------
    { name: "kbj_full_template_setup", testMatch: /.*\.template\.ts/ },

    // ----------------------------
    // Test Login Flow
    // ----------------------------
    {
      name: "login",
      use: {
        ...devices["Desktop Chrome"],
        storageState: undefined,
      },
      testMatch: /.*\/(login|register).*\.spec\.ts/,
      fullyParallel: Parallel,
    },

    // ----------------------------
    // Test New Contact Flow
    // ----------------------------
    {
      name: "new_contact",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.template/kbj_full.json",
      },
      testMatch: /.*\/(new_contact).*\.spec\.ts/,
      fullyParallel: Parallel,
    },

    // ----------------------------
    // Test Exist Contact Flow
    // ----------------------------
    {
      name: "exist_contact",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.template/kbj_full.json",
      },
      testMatch: /.*\/(exist_contact).*\.spec\.ts/,
      fullyParallel: Parallel,
    },

    // ----------------------------
    // Test Contact Flow
    // ----------------------------
    {
      name: "contact",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.template/kbj_full.json",
      },
      testMatch: /.*\/(contact).*\.spec\.ts/,
      fullyParallel: Parallel,
    },
  ],
});
