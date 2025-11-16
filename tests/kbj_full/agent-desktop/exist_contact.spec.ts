import { test, expect } from "@playwright/test";
import { AgentDesktopPage, CloseTimeout, Files } from "../../utils";

test.afterEach(async ({ page }) => {
  // Hold page for before close
  await page.waitForTimeout(CloseTimeout);
});

test("Create Ticket Existing Contact Fail: Search Not Found", async ({
  page,
}) => {
  // go to Agent Desktop page
  await page.goto(AgentDesktopPage);

  // select create ticket: existing contact
  await page.getByRole("button", { name: "Create Ticket" }).click();
  await page.getByRole("menuitem", { name: "Existing contact" }).click();

  const search = page.getByRole("textbox", { name: "Search" });
  expect(search.isVisible());

  await search.fill("abcdefghjkl");
  await page.locator("#btn-search-contact").click();
  await expect(page.getByText(/Select/)).toHaveCount(0);
  await page.keyboard.press("Escape");

  await expect(
    page.getByRole("status").filter({ hasText: "Loaded" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "No Contactไม่พบข้อมูลที่ค้นหา" }),
  ).toBeVisible();
});

test("Create Ticket Existing Contact Fail: Search Found But Save Failed", async ({
  page,
}) => {
  // go to Agent Desktop page
  await page.goto(AgentDesktopPage);

  // select create ticket: existing contact
  await page.getByRole("button", { name: "Create Ticket" }).click();
  await page.getByRole("menuitem", { name: "Existing contact" }).click();

  await expect(page.getByRole("textbox", { name: "Search" })).toBeVisible();
  const search = page.getByRole("textbox", { name: "Search" });

  await search.fill("test");
  await page.locator("#btn-search-contact").click();
  await expect(page.locator("#btn-select-contact-0")).toBeVisible();
  await page.locator("#btn-select-contact-0").click();

  // save btn
  await page.getByRole("button", { name: "Save" }).click();

  // error message
  await expect(
    page.getByRole("status").filter({ hasText: "Field is missing" }),
  ).toBeVisible();
});

test("Create Ticket Existing Contact Success: Search Found", async ({
  page,
}) => {
  // go to Agent Desktop page
  await page.goto(AgentDesktopPage);

  // select create ticket: existing contact
  await page.getByRole("button", { name: "Create Ticket" }).click();
  await page.getByRole("menuitem", { name: "Existing contact" }).click();

  await expect(page.getByRole("textbox", { name: "Search" })).toBeVisible();
  const search = page.getByRole("textbox", { name: "Search" });

  await search.fill("test");
  await page.locator("#btn-search-contact").click();
  await expect(page.locator("#btn-select-contact-0")).toBeVisible();
  await page.locator("#btn-select-contact-0").click();
});

test("Create Ticket Existing Contact Success: Search Found And Save Successfully", async ({
  page,
}) => {
  // go to Agent Desktop page
  await page.goto(AgentDesktopPage);

  // select create ticket: existing contact
  await page.getByRole("button", { name: "Create Ticket" }).click();
  await page.getByRole("menuitem", { name: "Existing contact" }).click();

  await expect(page.getByRole("textbox", { name: "Search" })).toBeVisible();
  const search = page.getByRole("textbox", { name: "Search" });

  // search existing contact
  await search.fill("test");
  await page.locator("#btn-search-contact").click();
  await expect(page.locator("#btn-select-contact-0")).toBeVisible();
  await page.locator("#btn-select-contact-0").click();

  // fill
  await page.locator("#dyn_layer_1").getByRole("combobox").click();
  await page.getByRole("option", { name: "Test Lv.1", exact: true }).click();

  // save btn
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Save" }).click();

  // popup confirm modal
  await page.getByRole("button", { name: "Create", exact: true }).click();

  // loading animation
  await expect(
    page.getByRole("status").filter({ hasText: "Creating..." }),
  ).toBeVisible();

  // show success status
  await page.waitForURL(AgentDesktopPage);
  await expect(
    page.getByRole("status").filter({ hasText: "Create Ticket Success" }),
  ).toBeVisible();
});

// ----------------------- Upload File -----------------------
// test("Create Ticket Existing Contact Success: Fail, Invalid file size more than 5 mb", async ({
//   page,
// }) => {
//   // go to agent desktop page
//   await page.goto(AgentDesktopPage);

//   // select create ticket: existing contact
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "Existing contact" }).click();

//   await expect(page.getByRole("textbox", { name: "Search" })).toBeVisible();
//   const search = page.getByRole("textbox", { name: "Search" });

//   // search existing contact
//   await search.fill("test");
//   await page.locator("#btn-search-contact").click();
//   await expect(page.locator("#btn-select-contact-0")).toBeVisible();
//   await page.locator("#btn-select-contact-0").click();

//   // fill
//   await page.locator("#dyn_layer_1").getByRole("combobox").click();
//   await page.getByRole("option", { name: "Test Lv.1", exact: true }).click();
//   let file = page.locator(`input[type="file"]`);
//   await file.setInputFiles(Files.Higher);
//   await expect(
//     page.getByRole("status").filter({ hasText: "File too large" }),
//   ).toBeVisible();
// });
