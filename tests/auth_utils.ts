import { Page, expect } from "@playwright/test";
import path from "path";
import { HomePage, LoginPage } from "./utils";

const templateFile = path.join(
    __dirname,
    "../playwright/.template/kbj_full.json",
);

const CRM_USER_TEST = "nattasit@cloudsoft.co.th";
const CRM_PASS_TEST = "P@ssw0rd";

export async function performLogin(page: Page) {
    console.log("Starting performLogin...");
    // login state
    await page.goto(LoginPage);

    try {
        const signInBtn = page.getByRole("button", { name: "Sign In" });
        if (await signInBtn.isVisible({ timeout: 5000 })) {
            await signInBtn.click();
        }
    } catch (e) {
        console.log("Sign In button not found or not clickable, proceeding...");
    }
    await page.waitForTimeout(5000);
    // Check if we need to login
    const loginNameInput = page.getByRole("textbox", { name: "Login Name" });
    if (await loginNameInput.isVisible({ timeout: 5000 })) {
        await loginNameInput.fill(CRM_USER_TEST);
        await page.getByRole("button", { name: "Next" }).click();

        const passwordInput = page.getByRole("textbox", { name: "Password" });
        await passwordInput.waitFor();
        await passwordInput.fill(CRM_PASS_TEST);

        await page.getByRole("button", { name: "Next" }).click();
    } else {
        console.log("Login form not visible, assuming already logged in or redirected...");
    }

    // select  Full_test Ticket Automate template
    await page.waitForURL(HomePage);

    await page.getByRole('tab', { name: 'Full_Test Automate' }).waitFor();
    await page.getByRole('tab', { name: 'Full_Test Automate' }).click();
    // select  Test edit Contact  Automate template
    await page.getByText('Testedit', { exact: true }).waitFor();
    await page.getByText('Testedit', { exact: true }).click();
    await page.getByText("Save").click();

    await page.context().storageState({ path: templateFile });
    console.log("performLogin completed.");
}

export async function performReLogin(page: Page) {
    console.log("Starting performReLogin...");
    // login state
    await page.goto(LoginPage);

    // Re-login flow when session expires but user is remembered
    try {
        const signInBtn = page.getByRole("button", { name: "Sign In" });
        if (await signInBtn.isVisible({ timeout: 5000 })) {
            await signInBtn.click();
        }
    } catch (e) {
        console.log("Sign In button not found in ReLogin, proceeding...");
    }

    // Check if account is remembered or need to enter email
    try {
        await page.getByRole('button', { name: 'Nattasit CloudsoftTest' }).waitFor({ timeout: 5000 });
        await page.getByRole('button', { name: 'Nattasit CloudsoftTest' }).click();
    } catch (e) {
        console.log("Remembered account not found, falling back to full login...");
        await performLogin(page);
        return;
    }

    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor();
    await passwordInput.click(); // Sometimes needed to focus
    await passwordInput.fill(CRM_PASS_TEST);

    await page.getByRole('button', { name: "Next" }).click();
    // await page.waitForTimeout(3000); // Wait for redirect

    // select  Full_test Ticket Automate template
    await page.waitForURL(HomePage);

    await page.getByRole('tab', { name: 'Full_Test Automate' }).waitFor();
    await page.getByRole('tab', { name: 'Full_Test Automate' }).click();
    // select  Test edit Contact  Automate template
    await page.getByText('Testedit', { exact: true }).waitFor();
    await page.getByText('Testedit', { exact: true }).click();
    await page.getByText("Save").click();
    console.log('Re-login completed successfully.');

    await page.context().storageState({ path: templateFile });
}
