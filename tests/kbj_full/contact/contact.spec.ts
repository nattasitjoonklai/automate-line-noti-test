import { test, expect, Page } from "@playwright/test";
import { ContactPage, CloseTimeout } from "../../utils";

type ContactFormFields = {
  StartDate?: string;
  EndDate?: string;
  Name?: string;
  NationalID?: string;
  CustomerID?: string;
  Email?: string;
  CaseBasic?: string;
  Phone?: string;
};

const FillInputContactForm = async (page: Page, fields: ContactFormFields) => {
  const fieldMap: Record<keyof ContactFormFields, string> = {
    StartDate: "StartDate",
    EndDate: "EndDate",
    Name: "Name",
    NationalID: "National ID",
    CustomerID: "Customer ID",
    Email: "Email",
    CaseBasic: "Case Basic",
    Phone: "Phone",
  };

  for (const key of Object.keys(fields) as (keyof ContactFormFields)[]) {
    const value = fields[key];
    if (value) {
      await page.getByRole("textbox", { name: fieldMap[key] }).fill(value);
    }
  }
};

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(CloseTimeout);
});

test("Search", async ({ page }) => {
  const form: ContactFormFields = {
    StartDate: "2022-01-01",
    EndDate: "2022-01-02",
    Name: "test",
    Email: "test",
    CustomerID: "cust-1",
    NationalID: "nat-1",
    Phone: "0987654321",
    CaseBasic: "case-basic",
  };

  // go to Contact page
  await page.goto(ContactPage);

  // select search
  const search = page.getByRole("textbox", { name: "Search" });
  expect(search.isVisible());

  await FillInputContactForm(page, form);
});
