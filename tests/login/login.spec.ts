import { test, expect } from "@playwright/test";
import {
  UserCRM,
  PassCRM,
  LoginPage,
  UrlTimeout,
  CloseTimeout,
  HomePage,
} from "../utils";

const CRM_LOGIN_URL = "https://auth.cloudsoft.co.th/ui/login/loginname";

// Template check
test("Correct Template", async ({ page }) => {
  await page.goto(LoginPage);
  const title = await page.title();
  expect(title).toBe("Clound Centric");

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in with Zitadel" }),
  ).toBeVisible();

  // hold process Close Browser
  await page.waitForTimeout(CloseTimeout);
});

// --------------------- Flow Check ---------------------
test("Login Fail Wrong Username or Password", async ({ page }) => {
  await page.goto(LoginPage);
  await page.getByRole("button", { name: "Sign in with Zitadel" }).click();

  await page.waitForURL(/auth\.cloudsoft\.co\.th/, {
    timeout: UrlTimeout,
  });

  // verify url
  const url = new URL(page.url());
  expect(url.hostname).toBe("auth.cloudsoft.co.th");
  expect(url.pathname).toBe("/ui/login/login");
  expect(url.searchParams.has("authRequestID")).toBeTruthy();

  // Login State
  // first login page: fill 'username'
  await page.getByRole("textbox", { name: "Login Name" }).fill(UserCRM);
  await page.getByRole("button", { name: "Next" }).click();

  // second login page: fill 'password'
  await page.waitForURL(CRM_LOGIN_URL, { timeout: UrlTimeout });
  await page.getByRole("textbox", { name: "Password" }).fill("password");
  await page.getByRole("button", { name: "Next" }).click();

  // error message
  expect(page.getByText("Username or Passowrd is invalid").isVisible());

  // hold process close browser
  await page.waitForTimeout(CloseTimeout);
});

test("Login Success", async ({ page }) => {
  await page.goto(LoginPage);
  await page.getByRole("button", { name: "Sign in with Zitadel" }).click();

  await page.waitForURL(/auth\.cloudsoft\.co\.th/, {
    timeout: UrlTimeout,
  });

  // verify url
  const url = new URL(page.url());
  expect(url.hostname).toBe("auth.cloudsoft.co.th");
  expect(url.pathname).toBe("/ui/login/login");
  expect(url.searchParams.has("authRequestID")).toBeTruthy();

  // Login State
  // first login page: fill 'username'
  await page.getByRole("textbox", { name: "Login Name" }).fill(UserCRM);
  await page.getByRole("button", { name: "Next" }).click();

  // second login page: fill 'password'
  await page.waitForURL(CRM_LOGIN_URL, { timeout: UrlTimeout });
  await page.getByRole("textbox", { name: "Password" }).fill(PassCRM);
  await page.getByRole("button", { name: "Next" }).click();

  // go to home page
  await page.waitForURL(HomePage, { timeout: UrlTimeout });
  expect(page.url()).toBe(HomePage);

  // hold process close browser
  await page.waitForTimeout(CloseTimeout);
});

// User locked case invalid 5 times
// test("Login Fail Locked", async ({ page }) => {
//   await page.goto(LoginPage);
//   await page.getByRole("button", { name: "Sign in with Zitadel" }).click();

//   await page.waitForURL(/auth\.cloudsoft\.co\.th/, {
//     timeout: TimeOut,
//   });

//   const url = new URL(page.url());
//   expect(url.hostname).toBe("auth.cloudsoft.co.th");
//   expect(url.pathname).toBe("/ui/login/login");
//   expect(url.searchParams.has("authRequestID")).toBeTruthy();

//   await page.getByRole("textbox", { name: "Login Name" }).fill(UserCRM);
//   await page.getByRole("button", { name: "Next" }).click();

//   await page.waitForURL(CRM_LOGIN_URL, { timeout: TimeOut });
//   await page.getByText("User is locked").isVisible();
// });
