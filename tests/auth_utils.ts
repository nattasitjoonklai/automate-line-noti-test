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
    // login state
    await page.goto(LoginPage);

    await page.getByRole("button", { name: "Sign In" }).click();
    // await page.waitForTimeout(3000);
    const loginNameInput = page.getByRole("textbox", { name: "Login Name" });
    await loginNameInput.waitFor();
    await loginNameInput.fill(CRM_USER_TEST);

    // await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "Next" }).click();

    // await page.waitForTimeout(3000);
    const passwordInput = page.getByRole("textbox", { name: "Password" });
    await passwordInput.waitFor();
    await passwordInput.fill(CRM_PASS_TEST);

    // await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "Next" }).click();
    // await page.waitForTimeout(3000);

    // select  Full_test Ticket Automate template
    await page.waitForURL(HomePage);

    await page.getByRole('tab', { name: 'Full_Test Automate' }).waitFor();
    await page.getByRole('tab', { name: 'Full_Test Automate' }).click();
    // select  Test edit Contact  Automate template
    await page.getByText('Testedit', { exact: true }).waitFor();
    await page.getByText('Testedit', { exact: true }).click();
    await page.getByText("Save").click();

    await page.context().storageState({ path: templateFile });

}

export async function performReLogin(page: Page) {
    // Re-login flow when session expires but user is remembered
    await page.getByRole("button", { name: "Sign In" }).click();

    // Check if account is remembered or need to enter email
    try {
        await page.getByRole('button', { name: 'Nattasit CloudsoftTest' }).waitFor({ timeout: 5000 });
        await page.getByRole('button', { name: 'Nattasit CloudsoftTest' }).click();
    } catch (e) {
        // Fallback to full login if not remembered
        const loginNameInput = page.getByRole("textbox", { name: "Login Name" });
        if (await loginNameInput.isVisible()) {
            await loginNameInput.fill(CRM_USER_TEST);
            await page.getByRole("button", { name: "Next" }).click();
        }
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

    await page.context().storageState({ path: templateFile });
}
