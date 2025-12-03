import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const Parallel = false;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  reporter: [['html'], ['json', { outputFile: 'playwright-report/results.json' }]],

  use: {
    video: "on",
    baseURL: process.env.CRM_BASE_URL,
    launchOptions: { args: ["--start-maximized"] },
    trace: "on",
    headless: false,
  },

  projects: [
    // ----------------------------
    // Setup project (login_template.ts)
    // ----------------------------
    {
      name: "kbj_full_template_setup",
      use: {
        viewport: { width: 1920, height: 1080 },
      },
      // ให้รัน login_template.ts ตรงนี้
      testMatch: "template/login_template.ts",
      testIgnore: [],   // ปิด ignore default
    },

    // ----------------------------
    // Test Contact Flow
    // ----------------------------
    {
      name: "contact",
      use: {
        ...devices["Desktop Chrome"],
        headless: false,
        storageState: "playwright/.template/kbj_full.json",
      },
      testMatch: '**/*contact*.spec.ts',
      fullyParallel: true,
    },

    // ----------------------------
    // Test Agent Desktop Flow
    // ----------------------------
    {
      name: "agentdesktop",
      testDir: "./tests/module_test/agentdesktop",
      use: {
        ...devices["Desktop Chrome"],
        headless: false,
        storageState: "playwright/.template/kbj_full.json",
      },
      testMatch: '*.spec.ts',
      fullyParallel: true,
    },
  ],
});
