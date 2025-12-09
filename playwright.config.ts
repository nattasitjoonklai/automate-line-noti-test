import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",

  // รันทีละ 1 เท่านั้น (สำคัญมากสำหรับโหมดเปิดหน้าจอ)
  workers: 1,
  fullyParallel: false,
  retries: 0,

  // เพิ่ม Timeout เผื่อกรณี Webhook ตอบกลับช้า หรือรอ UI Render
  timeout: 120 * 1000,
  expect: {
    timeout: 30 * 1000,
  },

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // เปิดหน้าต่าง Browser ขึ้นมาจริงๆ
    headless: false,

    // เก็บ Video/Trace ไว้ดูเฉพาะตอนพัง (เพื่อประหยัดที่)
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',

    baseURL: process.env.CRM_BASE_URL,

    // ตั้งค่า Viewport เป็น null เพื่อให้ใช้ขนาดตาม window size ของ browser
    viewport: null,

    launchOptions: {
      // ใส่ slowMo นิดหน่อย (ครึ่งวินาที) ช่วยลดโอกาสเทสพังเพราะหน้าเว็บโหลดไม่ทันในโหมดเปิดจอ
      // ถ้าช้าไป สามารถลบบรรทัดนี้ออกได้ครับ
      slowMo: 500,

      args: [
        "--start-maximized", // เปิดจอใหญ่สุด
        "--no-sandbox",
        "--disable-dev-shm-usage", // กันเมมเต็ม
        // ตัด args ที่ปิด GPU ออก เพราะโหมดเปิดจอควรให้การ์ดจอช่วย render จะลื่นกว่าใช้ CPU ล้วน
      ]
    },
  },

  projects: [
    {
      name: "kbj_full_template_setup",
      testMatch: "template/login_template.ts",
    },
    {
      name: "contact",
      // dependencies: ['kbj_full_template_setup'],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.template/kbj_full.json",
      },
      testMatch: '**/*contact*.spec.ts',
    },
    {
      name: "agentdesktop",
      // testDir: "./tests/module_test/agentdesktop",
      // dependencies: ['kbj_full_template_setup'],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.template/kbj_full.json",
      },
      testMatch: 'module_test/agentdesktop/*.spec.ts',
    },
  ],
});