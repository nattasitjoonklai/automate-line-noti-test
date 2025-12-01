import { Page, APIRequestContext, expect } from "@playwright/test";
import { FillInputContactForm, ContactFormFields } from "./FillForm";
import { r } from "@faker-js/faker/dist/airline-DF6RqYmq";
export type SearchParams = {
  organize_id: string;
  template_id: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortType?: string;
  Email?: string;
  Name?: string;
  Phone?: string;
  Address_no?: string;
  Address_district?: string;
  Address_subdistrict?: string;
  Address_province?: string;
  Address_zipcode?: string;
  Dropdown_value?: string;
  Dropdown_mutlple_lv1?: string;
  Dropdown_mutlple_lv2?: string;
  Dropdown_mutlple_lv3?: string;
  Dropdown_mutlple_lv4?: string;
  Dropdown_mutlple_lv5?: string;
  Dropdown_mutlple_lv6?: string;
  Segment?: string;
  Datamasking?: string;
  Checkbox_TrueFalse?: string;
  Radio?: string;
  Datetime?: string;
  Date?: string;
  Time?: string;
};
let json_data: any = {};
export class ContactAPI {
  static token = "ZbWxQ-E2ha5-UBFpOj9PMBwtQiqEuyOW92F8UChgxaqEcG0M0xRrtZw-qN7hUOVigitD7puMTzHwjYXO2jCxGAh1-5jLrTrj-GqWn2B8btBM9D5A";

  static async fetchContacts(request: APIRequestContext, params: SearchParams) {
    const apiParams: Record<string, string> = {
      organize_id: params.organize_id,
      template_id: params.template_id,
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 15),
      sortField: params.sortField ?? "created_at",
      sortType: params.sortType ?? "desc",
    };

    if (params.Email) apiParams["data.email"] = params.Email;
    if (params.Name) apiParams["data.name"] = params.Name;
    if (params.Phone) apiParams["data.phone"] = params.Phone;
    if (params.Address_no) apiParams["data.address.address"] = params.Address_no;
    if (params.Address_district) apiParams["data.address.district"] = params.Address_district;
    if (params.Address_subdistrict) apiParams["data.address.subdistrict"] = params.Address_subdistrict;
    if (params.Address_province) apiParams["data.address.province"] = params.Address_province;
    if (params.Address_zipcode) apiParams["data.address.zipcode"] = params.Address_zipcode;
    if (params.Dropdown_value) apiParams["data.dropdownkey"] = params.Dropdown_value;
    if (params.Dropdown_mutlple_lv1) apiParams["data.JEFOkL"] = params.Dropdown_mutlple_lv1;
    if (params.Dropdown_mutlple_lv2) apiParams["data.ds1WmD"] = params.Dropdown_mutlple_lv2;
    if (params.Dropdown_mutlple_lv3) apiParams["data.kGCQa0"] = params.Dropdown_mutlple_lv3;
    if (params.Dropdown_mutlple_lv4) apiParams["data.Rtp6MP"] = params.Dropdown_mutlple_lv4;
    if (params.Dropdown_mutlple_lv5) apiParams["data.BI5q7i"] = params.Dropdown_mutlple_lv5;
    if (params.Dropdown_mutlple_lv6) apiParams["data.fKpu0q"] = params.Dropdown_mutlple_lv6;
    if (params.Datamasking) apiParams["data.datamasking"] = params.Datamasking;
    if (params.Checkbox_TrueFalse) apiParams["data.chkbox"] = params.Checkbox_TrueFalse;
    if (params.Radio) apiParams["data.radiobtn"] = params.Radio;
    if (params.Datetime) apiParams["data.feu1"] = params.Datetime;
    if (params.Date) apiParams["data.R8i6Yo"] = params.Date;
    if (params.Time) apiParams["data.yC3zrN"] = params.Time;
    if (params.Segment) apiParams["data.name_segment"] = params.Segment;

    const query = new URLSearchParams(apiParams).toString();


    const apiResponse = await request.get(
      `https://api-dev.cloudcentric.app/api/contacts/filter?${query}`,
      {
        headers: {
          authorization: `Bearer ${ContactAPI.token}`,
          "login-provider": "zitadel",
          "Content-Type": "application/json",
        },
      }
    );

    json_data = await apiResponse.json();



    const raw = json_data?.data?.data ?? [];

    const contacts: ContactFormFields[] = raw.map((item: any) => {


      return {
        Name: item.data.name ?? '',
        Dropdown_value: item.data.dropdownkey ?? '',
        Dropdown_mutlple_lv1: item.data.JEFOkL ?? '',
        Dropdown_mutlple_lv2: item.data.ds1WmD ?? '',
        Dropdown_mutlple_lv3: item.data.kGCQa0 ?? '',
        Dropdown_mutlple_lv4: item.data.Rtp6MP ?? '',
        Dropdown_mutlple_lv5: item.data.BI5q7i ?? '',
        Dropdown_mutlple_lv6: item.data.fKpu0q ?? '',
        Phone: item.data['phone']?.join(', ') ?? '',
        Email: item.data.email ?? '',
        DataMarking: item.data.datamasking ?? '',
        Checkbox_TrueFalse: item.data.chkbox ?? false,
        Radio: item.data.radiobtn ?? '',
        Datetime: item.data.feu1 ?? '',
        Date: item.data.R8i6Yo ?? '',
        Time: item.data.yC3zrN ?? '',
        Address_no: item.data.address?.[0]?.address ?? '',
        Address_district: item.data.address?.[0]?.district ?? '',
        Address_subdistrict: item.data.address?.[0]?.subdistrict ?? '',
        Address_province: item.data.address?.[0]?.province ?? '',
        Address_zipcode: item.data.address?.[0]?.zipcode ?? '',

        Datamasking: item.data.datamasking ?? '',

      };
    });


    return contacts;
  }
  // 🔥 รวมทุกอย่างให้เหลือบรรทัดเดียวใน test
  static async searchAndVerify(page: Page, request: APIRequestContext, form: ContactFormFields) {
    // 1) API call → เอา data จริง
    const contacts = await ContactAPI.fetchContacts(request, {
      organize_id: "64db6878ed14931d4adca29e",
      template_id: "67b42f057d334a46144e6b1b",
      Email: form.Email,
      Name: form.Name,
      Phone: form.Phone,
      Address_no: form.Address_no,
      Address_district: form.Address_district,
      Address_subdistrict: form.Address_subdistrict,
      Address_province: form.Address_province,
      Address_zipcode: form.Address_zipcode,
      Dropdown_value: form.Dropdown_value,
      Segment: form.Segment,
      Dropdown_mutlple_lv1: form.Dropdown_mutlple_lv1,
      Dropdown_mutlple_lv2: form.Dropdown_mutlple_lv2,
      Dropdown_mutlple_lv3: form.Dropdown_mutlple_lv3,
      Dropdown_mutlple_lv4: form.Dropdown_mutlple_lv4,
      Dropdown_mutlple_lv5: form.Dropdown_mutlple_lv5,
      Dropdown_mutlple_lv6: form.Dropdown_mutlple_lv6,
      Datamasking: form.Datamasking,
      Checkbox_TrueFalse: form.Checkbox_TrueFalse,
      Radio: form.Radio,
      Datetime: form.Datetime,
      Date: form.Date,
      Time: form.Time

    });

    // 2) เปิดหน้า
    await page.goto("/contact");
    // 2.1) wait for load
    await page.waitForLoadState("networkidle");
    // 3) เปิด filter
    await page.getByRole("button", { name: "Search" }).nth(2).click();

    // 4) กรอก form
    await FillInputContactForm(page, form);

    // 5) clear date
    await page.getByRole("combobox", { name: "Select Start Datetime" }).click();
    await page.waitForTimeout(2000);
    await page.getByLabel("Clear").click();
    await page.waitForTimeout(5000);
    await page.getByRole("combobox", { name: "Select End Datetime" }).click();
    await page.waitForTimeout(2000);
    await page.getByLabel("Clear").click();
    await page.waitForTimeout(2000);
    // 6) Search
    await page.getByRole('button', { name: 'Search' }).nth(1).click();
    await page.waitForLoadState('networkidle');

    // Wait for table to render (prevent false positive when expecting 0 rows but data is loading)
    await page.waitForTimeout(2000);

    // 1) ดึง rows จาก table
    const rows = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]');

    // Wait for the UI to reflect the API data count
    await expect(rows).toHaveCount(contacts.length);


    const count = await rows.count();


    const tableContacts: any[] = [];

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);

      const contact = {
        Name: await row.locator('#dyn_row_name').innerText(),
        Dropdown: await row.locator('#dyn_row_dropdownkey').innerText(),

        Dropdown_mutlple_lv1: await row.locator('[id^="dyn_row_JEFOkL"]').innerText(),
        Dropdown_mutlple_lv2: await row.locator('[id^="dyn_row_ds1WmD"]').innerText(),
        Dropdown_mutlple_lv3: await row.locator('[id^="dyn_row_kGCQa0"]').innerText(),
        Dropdown_mutlple_lv4: await row.locator('[id^="dyn_row_Rtp6MP"]').innerText(),
        Dropdown_mutlple_lv5: await row.locator('[id^="dyn_row_BI5q7i"]').innerText(),
        Dropdown_mutlple_lv6: await row.locator('[id^="dyn_row_fKpu"]').innerText(),

        Phone: await row.locator('#dyn_row_phone').innerText(),
        Email: await row.locator('#dyn_row_email').innerText(),
        Datamasking: await row.locator('#dyn_row_datamasking').innerText(),
        Checkbox_TrueFalse: await row.locator('#dyn_row_chkbox').innerText(),
        Radiobtn: await row.locator('#dyn_row_radiobtn').innerText(),
        Datetime: await row.locator('#dyn_row_feu1').innerText(),
        Date: await row.locator('#dyn_row_R8i6Yo').innerText(),
        Time: await row.locator('#dyn_row_yC3zrN').innerText(),

        Address: await row.locator('#dyn_row_address').innerText()
      };

      tableContacts.push(contact);
    }

    // -----------------------------------------------------------
    // 2) เทียบข้อมูลจากหน้าเว็บ (tableContacts) กับ API (contacts)
    // -----------------------------------------------------------
    console.log("========== DEBUG: API DATA ==========");
    console.log(JSON.stringify(contacts, null, 2));
    console.log("=====================================");

    console.log("========== DEBUG: UI TABLE DATA ==========");
    console.log(JSON.stringify(tableContacts, null, 2));
    console.log("==========================================");

    console.log(`Found ${tableContacts.length} rows in UI, ${contacts.length} rows from API`);

    // Verify row counts match
    expect(tableContacts.length, `UI row count (${tableContacts.length}) should match API row count (${contacts.length})`).toBe(contacts.length);

    for (const row of tableContacts) {
      console.log("Checking UI Row:", row.Name);

      // Find matching record in API data
      // Using Name, Email, Phone as primary keys for matching, or just Name if others are empty
      const match = contacts.find(apiContact => {
        // Normalize for comparison (trim, lowercase if needed)
        const nameMatch = row.Name.trim() === apiContact.Name.trim();
        // Email/Phone might be empty in UI or API, handle accordingly
        const emailMatch = row.Email.trim() === apiContact.Email.trim();
        // Phone formatting might differ (e.g. spaces), remove non-digits for comparison if needed
        const phoneMatch = row.Phone.replace(/\D/g, '') === apiContact.Phone.replace(/\D/g, '');

        // If we searched by specific field, we expect that to match. 
        // But here we are just finding which API record corresponds to this UI row.
        // Let's assume Name is unique enough or use combination.
        return nameMatch && (row.Email ? emailMatch : true) && (row.Phone ? phoneMatch : true);
      });

      if (match) {
        console.log("✅ Found match in API:", match.Name);
        // Verify other fields if they are present in the row
        // Add assertions for other columns here if needed
        // Example:
        // if (row.Dropdown) expect(row.Dropdown.trim()).toBe(match.Dropdown_value.trim());
      } else {
        console.error("❌ UI Row not found in API response:", row);
        console.log("API Data:", contacts);
      }

      expect(match, `UI Row with Name: ${row.Name} should exist in API response`).toBeDefined();
    }
  }

}

// ตรวจสอบว่าข้อมูลที่สร้าง ตรงกับแถวบนสุดของตารางหรือไม่
export async function verifyTopTableRow(page, expected: { Name?: string, Phone?: string, Email?: string, CheckDelete?: String, CheckView?: string, CheckEdit?: string }) {
  const firstRow = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').first();

  if (expected.CheckView) {

    await page.getByRole('row', { name: expected.CheckView }).locator('#dyn_row_action').click();
    await page.getByRole('menuitem', { name: 'View' }).click();
  }
  if (expected.CheckEdit) {

    await page.getByRole('row', { name: expected.CheckEdit }).locator('#dyn_row_action').click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
  }
  if (expected.CheckDelete) {


    const row = page.locator('#dyn_contactTable tr').filter({ hasText: expected.CheckDelete });
    await row.locator('#dyn_row_isSelected').click();
    await page.getByRole('button', { name: /Delete Contact/ }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    // ตรวจสอบว่า row หายไป
    await expect(page.locator('#dyn_contactTable tr').filter({ hasText: expected.CheckDelete })).toHaveCount(0);
  }
  if (expected.Name) {
    const nameCell = await firstRow.locator('td').nth(1).textContent();
    console.log('แถวบนสุด Name:', nameCell?.trim());
    await expect(nameCell?.trim()).toBe(expected.Name);
  }

  if (expected.Phone) {
    const rows = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]');

    const matchedRow = rows.filter({
      has: page.locator('td').nth(1).filter({ hasText: expected.Name })
    });
    const phoneCell = await matchedRow.locator('td').nth(9).textContent();

    console.log('แถวบนสุด Phone:', phoneCell?.trim());

    await expect(phoneCell?.trim()).toBe(expected.Phone);
  }

  if (expected.Email) {
    const emailCell = await firstRow.locator('#dyn_row_email').textContent();
    console.log('แถวบนสุด Email:', emailCell?.trim());
    await expect(emailCell?.trim()).toBe(expected.Email);
  }
}

export function formatDate(date = new Date()) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${dd}:${mm}:${yyyy}:${hh}:${min}`;
}
