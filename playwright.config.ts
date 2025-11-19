import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// โหลด environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

const Parallel = false;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  
  use: {
    video: "on" , //"retain-on-failure",
    baseURL: process.env.CRM_BASE_URL,
    launchOptions: {
      args: ["--start-maximized"],
    },
    trace: "on-first-retry",
     headless: false,          
  },

  projects: [
    // ----------------------------
    // Setup project
    // ----------------------------
    {
      name: "kbj_full_template_setup",
      use: {
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/*.template.ts',
    },

    // ----------------------------
    // Test Login Flow
    // ----------------------------
    // {
    //   name: "login",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     storageState: undefined,
    //   },
    //   testMatch: '**/*login*.spec.ts',
    //   fullyParallel: Parallel,
    // },

    // ----------------------------
    // Test New Contact Flow
    // ----------------------------
    // {
    //   name: "new_contact",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     storageState: "playwright/.template/kbj_full.json",
    //   },
    //   testMatch: '**/*new_contact*.spec.ts',
    //   fullyParallel: Parallel,
    // },

    // ----------------------------
    // Test Exist Contact Flow
    // ----------------------------
    // {
    //   name: "exist_contact",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     storageState: "playwright/.template/kbj_full.json",
    //   },
    //   testMatch: '**/*exist_contact*.spec.ts',
    //   fullyParallel: Parallel,
    // },

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
  ],
});
