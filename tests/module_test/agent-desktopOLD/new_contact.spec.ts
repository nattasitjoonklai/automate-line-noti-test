// import { test, expect, Page } from "@playwright/test";
// import { AgentDesktopPage, CloseTimeout } from "../../utils";
// import { faker } from "@faker-js/faker";

// type ContactFormFields = {
//   Name?: string;
//   NationalID?: string;
//   CustomerID?: string;
//   Email?: string;
//   CaseBasic?: string;
//   Phone?: string;
// };

// const FillInputNewContactForm = async (
//   page: Page,
//   fields: ContactFormFields,
// ) => {
//   const fieldMap: Record<keyof ContactFormFields, string> = {
//     Name: "Name",
//     NationalID: "National ID",
//     CustomerID: "Customer ID",
//     Email: "Email",
//     CaseBasic: "Case Basic",
//     Phone: "Phone",
//   };

//   // loop ผ่านทุก key ใน fields
//   for (const key of Object.keys(fields) as (keyof ContactFormFields)[]) {
//     const value = fields[key];
//     if (value) {
//       await page.getByRole("textbox", { name: fieldMap[key] }).fill(value);
//     }
//   }
// };

// test.afterEach(async ({ page }) => {
//   // Hold page for before close
//   await page.waitForTimeout(CloseTimeout);
// });

// // ------------------ Fail Case ------------------ //
// test("Create Ticket NewContact Fail: Not Fill All", async ({ page }) => {
//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // sace
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is required").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// test("Create Ticket NewContact Fail: Not Fill Name", async ({ page }) => {
//   const form: ContactFormFields = {
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     Phone: faker.helpers.replaceSymbols("08########"),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is required").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// test("Create Ticket NewContact Fail: Not Fill National ID", async ({
//   page,
// }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     Phone: faker.helpers.replaceSymbols("08########"),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is required").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// test("Create Ticket NewContact Fail: Not Fill Customer ID", async ({
//   page,
// }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     Phone: faker.helpers.replaceSymbols("08########"),
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is required").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// test("Create Ticket NewContact Fail: Not Fill Case Basic", async ({ page }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     Phone: faker.helpers.replaceSymbols("08########"),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is required").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// test("Create Ticket NewContact Fail: Not Fill Phone", async ({ page }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is required").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// test("Create Ticket NewContact Fail: Fill Character in Phone", async ({
//   page,
// }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     Phone: "test-phone",
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is not an integer").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// test("Create Ticket NewContact Fail: Add One Phone Not Fill", async ({
//   page,
// }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // add new phone
//   await page.getByRole("button", { name: "Add Phone" }).click();
//   await page.locator("#dyn_phone_0").fill("0928905412");

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is required").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// test("Create Ticket NewContact Fail: Add One Phone Fill Not Integer", async ({
//   page,
// }) => {
//   const form: ContactFormFields = {
//     Name: "John Doe",
//     NationalID: "nat-1007",
//     CustomerID: "cust-1007",
//     CaseBasic: "Not Basic",
//     Email: "john.doe@example.com",
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // add new phone
//   await page.getByRole("button", { name: "Add Phone" }).click();
//   await page
//     .locator("#dyn_phone_0")
//     .fill(faker.helpers.replaceSymbols("08########"));
//   await page.locator("#dyn_phone_0").fill("test-phone-1");

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();
//   expect(page.getByText("Value is not an integer").isVisible());

//   // error message
//   let failStatus = await page.getByRole("status").innerText();
//   expect(failStatus).toContain(
//     "Field is missing\nกรุณากรอกข้อมูลผู้ติดต่อให้ครบถ้วน",
//   );
// });

// // ------------------ Success Case ------------------ //
// test("Create Ticket NewContact Success", async ({ page }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     Phone: faker.helpers.replaceSymbols("08########"),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill ticket form input
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();

//   // Confirm Popup
//   await page.getByRole("button", { name: "Create" }).click();
//   let successStatus = page
//     .getByRole("status")
//     .filter({ hasText: "Create Contact Success" });
//   successStatus.isVisible;
// });

// test("Create Ticket NewContact Success: Not Fill Email", async ({ page }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     Phone: faker.helpers.replaceSymbols("08########"),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();

//   // Confirm Popup and show success message
//   await page.getByRole("button", { name: "Create" }).click();
//   let successStatus = page
//     .getByRole("status")
//     .filter({ hasText: "Create Contact Success" });
//   successStatus.isVisible;
// });

// test("Create Ticket NewContact Success: Add One Phone", async ({ page }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // add new phone
//   await page.getByRole("button", { name: "Add Phone" }).click();
//   await page
//     .locator("#dyn_phone_0")
//     .fill(faker.helpers.replaceSymbols("09########"));
//   await page
//     .locator("#dyn_phone_1")
//     .fill(faker.helpers.replaceSymbols("09########"));

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();

//   // Confirm Popup and show success message
//   await page.getByRole("button", { name: "Create" }).click();
//   let successStatus = page
//     .getByRole("status")
//     .filter({ hasText: "Create Contact Success" });
//   successStatus.isVisible;
// });

// // ------------------ Success But Not Make Sens ------------------ //
// test("Create Ticket NewContact Success: Invalid Phone Number Has Nore Than 10 Digits", async ({
//   page,
// }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     Phone: faker.helpers.replaceSymbols("08########1234567890"),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill ticket form input
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();

//   // Confirm Popup
//   await page.getByRole("button", { name: "Create" }).click();
//   let successStatus = page
//     .getByRole("status")
//     .filter({ hasText: "Create Contact Success" });
//   successStatus.isVisible;
// });

// test("Create Ticket NewContact Success: Add One Phone Fill Phone More Than 10 Digits", async ({
//   page,
// }) => {
//   const form: ContactFormFields = {
//     Name: faker.person.fullName(),
//     Email: faker.internet.email({
//       firstName: faker.person.fullName().split(" ")[0],
//     }),
//     CustomerID: `cust-${faker.number.int({ min: 1000, max: 9999 })}`,
//     NationalID: `nat-${faker.number.int({ min: 1000, max: 9999 })}`,
//     CaseBasic: faker.lorem.words(4),
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // add new phone
//   await page.getByRole("button", { name: "Add Phone" }).click();
//   await page
//     .locator("#dyn_phone_0")
//     .fill(faker.helpers.replaceSymbols("06########1234567890"));
//   await page
//     .locator("#dyn_phone_1")
//     .fill(faker.helpers.replaceSymbols("06########1234567890"));

//   // fill input field and save
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();

//   // Confirm Popup and show success message
//   await page.getByRole("button", { name: "Create" }).click();
//   let successStatus = page
//     .getByRole("status")
//     .filter({ hasText: "Create Contact Success" });
//   successStatus.isVisible;
// });

// test("Create Ticket NewContact Success: Name Boom DB", async ({ page }) => {
//   const form: ContactFormFields = {
//     Name: `John

//     Doe`,
//     NationalID: "nat-1007",
//     CustomerID: "cust-1007",
//     CaseBasic: "Not Basic",
//     Email: "john.doe@example.com",
//     Phone: "12345678901234567890",
//   };

//   // go to Agent-Desktop Page
//   await page.goto(AgentDesktopPage);

//   // select create btn
//   await page.getByRole("button", { name: "Create Ticket" }).click();
//   await page.getByRole("menuitem", { name: "New Contact" }).click();

//   // fill ticket form input
//   await FillInputNewContactForm(page, form);
//   await page.getByRole("button", { name: "Save" }).click();

//   // Confirm Popup
//   await page.getByRole("button", { name: "Create" }).click();
//   let successStatus = page
//     .getByRole("status")
//     .filter({ hasText: "Create Contact Success" });
//   successStatus.isVisible;
// });
