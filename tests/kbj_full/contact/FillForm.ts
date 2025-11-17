import { el } from "@faker-js/faker";
import { Page } from "@playwright/test";

export type ContactFormFields = {
  Name?: string;
  NationalID?: string;
  CustomerID?: string;
  Email?: string;
  CaseBasic?: string;
  Phone?: string;
  Address_no?: string;
    Address_district?: string;
    Address_subdistrict?: string;
    Address_province?: string;
    Address_zipcode?: string;
    Dropdown_value? :string;
    Dropdown_mutlple_lv1?: string;
    Dropdown_mutlple_lv2?: string;
    Dropdown_mutlple_lv3?: string;
    Dropdown_mutlple_lv4?: string;
    Dropdown_mutlple_lv5?: string;
    Dropdown_mutlple_lv6?: string;
    Datamasking ?: string;
};

// function กรอกข้อมูล auto
export const fieldMap: Record<keyof ContactFormFields, string> = {
  Name: `Enter your Name`,
  NationalID: `Enter your NationalID`,
  CustomerID: `Enter your CustomerID`,
  Email: `Enter your Email`,
  CaseBasic: `Enter your CaseBasic`,
  Phone: `Enter your Phone`,
  Address_no: `Enter your ที่อยู่/บ้านเลขที่`,
  Address_district: `Enter your อำเภอ / เขต`,
  Address_subdistrict: `Enter your ตำบล/แขวง`,
  Address_province: `Enter your จังหวัด`,
  Address_zipcode: `Enter your รหัสไปรษณีย์`,
  Dropdown_value: `#dyn_dropdownkey`,
  Dropdown_mutlple_lv1: `#dyn_JEFOkL`,
  Dropdown_mutlple_lv2: `#dyn_ds1WmD`,
  Dropdown_mutlple_lv3: `#dyn_kGCQa0`,
  Dropdown_mutlple_lv4: `#dyn_Rtp6MP`,
  Dropdown_mutlple_lv5: `#dyn_BI5q7i`,
  Dropdown_mutlple_lv6: `#dyn_fKpu0q`,
  Datamasking : `Enter your Datamasking`,
};

export const FillInputContactForm = async (page: Page, fields: ContactFormFields) => {
  // เลือก dropdown ตามลำดับ
  const dropdownLevels: (keyof ContactFormFields)[] = [
    "Dropdown_mutlple_lv1",
    "Dropdown_mutlple_lv2",
    "Dropdown_mutlple_lv3",
    "Dropdown_mutlple_lv4",
    "Dropdown_mutlple_lv5",
    "Dropdown_mutlple_lv6",
    "Dropdown_value",
  ];

  for (const key of dropdownLevels) {
    const value = fields[key];
    if (!value) continue;

    // ถ้าเป็น Level > 1 ให้เช็คว่ามีค่า Level ก่อนหน้าแล้ว
    const index = dropdownLevels.indexOf(key);
    if (index > 0) {
      const prevKey = dropdownLevels[index - 1];
      if (!fields[prevKey]) {
        console.warn(`Cannot select ${key} because ${prevKey} is not set`);
        continue;
      }
    }

    console.log(`Selecting ${key}: ${value}`);
    await page.waitForTimeout(3000)
    await page.locator(fieldMap[key]).click();
    await page.getByRole("option", { name: value }).click();
  }

  // กรอก textbox / input อื่น ๆ
  for (const key of Object.keys(fields) as (keyof ContactFormFields)[]) {
    const value = fields[key];
    if (!value) continue;
    if (!dropdownLevels.includes(key)) {
      await page.getByRole("textbox", { name: fieldMap[key] }).fill(value);
    }
  }
};

