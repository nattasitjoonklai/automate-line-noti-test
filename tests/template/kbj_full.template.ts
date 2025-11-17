import { test as setup, expect } from "@playwright/test";
import path from "path";
import { HomePage, LoginPage } from "../utils";

const templateFile = path.join(
  __dirname,
  "../../playwright/.template/kbj_full.json",
);

const CRM_USER_TEST = "nattasit@cloudsoft.co.th";
const CRM_PASS_TEST = "P@ssw0rd";

setup("kbj_full_template_setup", async ({ page }) => {
  // login state
  await page.goto(LoginPage);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("textbox", { name: "Login Name" }).fill(CRM_USER_TEST);
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(CRM_PASS_TEST);
  await page.getByRole("button", { name: "Next" }).click();

 // select kbj full template
  await page.waitForURL(HomePage);
  
  await page.getByText('full_test', { exact: true }).click();
  await page.getByText('Testedit', { exact: true }).click();
  await page.getByText("Save").click();
  await page.context().storageState({ path: templateFile });
});
