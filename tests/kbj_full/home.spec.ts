// Maybe didn't use beacuase we have kbj_full.template for do this process
import { test, expect } from "@playwright/test";
import { HomePage, CloseTimeout, UrlTimeout } from "../utils";

test("Select Ticket KBJ Clone, Contact KBJ 3", async ({ page }) => {
  // go to default home page for select the template
  await page.goto(HomePage);
  await expect(page).toHaveURL(HomePage);

  // select template
  // ticket: Ticket KBJ Clone
  // contact: Contact KBJ 3
  await page.getByText("TKTicket KBJ Clone").click();
  await page.getByText("CKContact KBJ 3").click();
  await page.getByText("Save").click();

  // go to template home page
  await page.waitForURL(HomePage, { timeout: UrlTimeout });
  await expect(page).toHaveURL(HomePage);

  // hold process close browser
  await page.waitForTimeout(CloseTimeout);
});
