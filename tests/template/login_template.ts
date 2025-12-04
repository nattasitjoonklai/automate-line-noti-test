import { test as setup, expect } from "@playwright/test";
import path from "path";
import { HomePage, LoginPage } from "../utils";
import { performLogin } from "../auth_utils";

const templateFile = path.join(
  __dirname,
  "../../playwright/.template/kbj_full.json",
);

const CRM_USER_TEST = "nattasit@cloudsoft.co.th";
const CRM_PASS_TEST = "P@ssw0rd";

setup("login_session", async ({ page }) => {
  await performLogin(page);
});
