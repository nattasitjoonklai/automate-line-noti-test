import { Page, APIRequestContext, expect } from "@playwright/test";
import { FillInputContactForm, ContactFormFields } from "./FillForm";
import { ensureSearchPanelOpen } from "./Elemenet_Contact";
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
  // ดึง token จาก localStorage
  static async getToken(page: Page): Promise<string> {
    const token = await page.evaluate(() => {
      // Try direct access first
      const directToken = localStorage.getItem('access_token');
      if (directToken) return directToken;

      // Look for OIDC user key
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('oidc.user:')) {
          const val = localStorage.getItem(key);
          if (val) {
            try {
              const parsed = JSON.parse(val);
              if (parsed.access_token) {
                return parsed.access_token;
              }
            } catch (e) {
              // ignore parse error
            }
          }
        }
      }
      return null;
    });

    if (!token) {
      throw new Error('Access token not found in localStorage');
    }

    return token;
  }

  static async fetchContacts(page: Page, request: APIRequestContext, params: SearchParams) {
    // ดึง token จาก localStorage
    const token = await this.getToken(page);
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


    try {
      const apiResponse = await request.get(
        `https://api-dev.cloudcentric.app/api/contacts/filter?${query}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
            "login-provider": "zitadel",
            "Content-Type": "application/json",
          },
        }
      );

      if (apiResponse.status() === 500) {
        console.log("⚠️ API Error 500. Attempting to re-login...");
        await import("../../auth_utils").then(async (module) => {
          await module.performLogin(page);
        });

        // Retry the fetch after login
        const newToken = await this.getToken(page);
        const retryResponse = await request.get(
          `https://api-dev.cloudcentric.app/api/contacts/filter?${query}`,
          {
            headers: {
              authorization: `Bearer ${newToken}`,
              "login-provider": "zitadel",
              "Content-Type": "application/json",
            },
          }
        );
        json_data = await retryResponse.json();
      } else {
        json_data = await apiResponse.json();
      }

      // Check for OIDC error
      if (json_data?.error === "invalid_request" && json_data?.error_description === "Errors.OIDCSession.RefreshTokenInvalid") {
        console.log("⚠️ OIDC Refresh Token Invalid. Attempting to re-login...");
        await import("../../auth_utils").then(async (module) => {
          await module.performLogin(page);
        });

        // Retry the fetch after login
        const newToken = await this.getToken(page);
        const retryResponse = await request.get(
          `https://api-dev.cloudcentric.app/api/contacts/filter?${query}`,
          {
            headers: {
              authorization: `Bearer ${newToken}`,
              "login-provider": "zitadel",
              "Content-Type": "application/json",
            },
          }
        );
        json_data = await retryResponse.json();
      }

    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }

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
    // 2) เปิดหน้า
    await page.goto("/contact");
    // 2.1) wait for load
    await expect(page.locator('#dyn_contactTable')).toBeVisible();

    // 1) API call → เอา data จริง
    const contacts = await ContactAPI.fetchContacts(page, request, {
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
    // 3) เปิด filter
    await ensureSearchPanelOpen(page);
    // 4) กรอก form
    await FillInputContactForm(page, form);

    // 5) clear date
    // 5) clear date
    await page.getByRole("combobox", { name: "Select Start Datetime" }).click();
    await page.getByLabel("Clear").click();
    await page.getByRole("combobox", { name: "Select End Datetime" }).click();
    await page.getByLabel("Clear").click();
    await page.waitForTimeout(2000)
    // 6) Search
    await page.getByRole('button', { name: 'Search' }).nth(1).click();

    // await page.waitForLoadState('networkidle');

    // Wait for table to render (prevent false positive when expecting 0 rows but data is loading)
    // Wait for table to render (prevent false positive when expecting 0 rows but data is loading)
    // await page.waitForTimeout(2000);

    // 1) ดึง rows จาก table
    const rows = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]');
    await page.waitForTimeout(5000);
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

      // Verify fields based on search form data
      if (form.Name) {
        console.log(`Verifying Name: UI=${row.Name} | Search=${form.Name}`);
        expect(row.Name.trim()).toContain(form.Name.trim());
      }
      if (form.Dropdown_value) {
        console.log(`Verifying Dropdown: UI=${row.Dropdown} | Search=${form.Dropdown_value}`);
        expect(row.Dropdown.trim()).toBe(form.Dropdown_value.trim());
      }
      if (form.Dropdown_mutlple_lv1) {
        console.log(`Verifying Dropdown_mutlple_lv1: UI=${row.Dropdown_mutlple_lv1} | Search=${form.Dropdown_mutlple_lv1}`);
        expect(row.Dropdown_mutlple_lv1.trim()).toBe(form.Dropdown_mutlple_lv1.trim());
      }
      if (form.Dropdown_mutlple_lv2) {
        console.log(`Verifying Dropdown_mutlple_lv2: UI=${row.Dropdown_mutlple_lv2} | Search=${form.Dropdown_mutlple_lv2}`);
        expect(row.Dropdown_mutlple_lv2.trim()).toBe(form.Dropdown_mutlple_lv2.trim());
      }
      if (form.Dropdown_mutlple_lv3) {
        console.log(`Verifying Dropdown_mutlple_lv3: UI=${row.Dropdown_mutlple_lv3} | Search=${form.Dropdown_mutlple_lv3}`);
        expect(row.Dropdown_mutlple_lv3.trim()).toBe(form.Dropdown_mutlple_lv3.trim());
      }
      if (form.Dropdown_mutlple_lv4) {
        console.log(`Verifying Dropdown_mutlple_lv4: UI=${row.Dropdown_mutlple_lv4} | Search=${form.Dropdown_mutlple_lv4}`);
        expect(row.Dropdown_mutlple_lv4.trim()).toBe(form.Dropdown_mutlple_lv4.trim());
      }
      if (form.Dropdown_mutlple_lv5) {
        console.log(`Verifying Dropdown_mutlple_lv5: UI=${row.Dropdown_mutlple_lv5} | Search=${form.Dropdown_mutlple_lv5}`);
        expect(row.Dropdown_mutlple_lv5.trim()).toBe(form.Dropdown_mutlple_lv5.trim());
      }
      if (form.Dropdown_mutlple_lv6) {
        console.log(`Verifying Dropdown_mutlple_lv6: UI=${row.Dropdown_mutlple_lv6} | Search=${form.Dropdown_mutlple_lv6}`);
        expect(row.Dropdown_mutlple_lv6.trim()).toBe(form.Dropdown_mutlple_lv6.trim());
      }

      if (form.Phone) {
        const uiPhone = row.Phone.replace(/\D/g, '');
        const searchPhone = form.Phone.replace(/\D/g, '');
        console.log(`Verifying Phone: UI=${uiPhone} | Search=${searchPhone}`);
        expect(uiPhone).toContain(searchPhone);
      }
      if (form.Email) {
        console.log(`Verifying Email: UI=${row.Email} | Search=${form.Email}`);
        expect(row.Email.trim()).toBe(form.Email.trim());
      }
      if (form.Datamasking) {
        console.log(`Verifying Datamasking: UI=${row.Datamasking} | Search=${form.Datamasking}`);
        // Check last 5 characters as requested for masked data
        const suffix = form.Datamasking.slice(-5);
        expect(row.Datamasking.trim()).toContain(suffix);
      }
      if (form.Checkbox_TrueFalse !== undefined) {
        console.log(`Verifying Checkbox: UI=${row.Checkbox_TrueFalse} | Search=${form.Checkbox_TrueFalse}`);
        expect(String(row.Checkbox_TrueFalse).toLowerCase()).toBe(String(form.Checkbox_TrueFalse).toLowerCase());
      }
      if (form.Radio) {
        console.log(`Verifying Radio: UI=${row.Radiobtn} | Search=${form.Radio}`);
        expect(row.Radiobtn.trim()).toBe(form.Radio.trim());
      }
      if (form.Datetime) {
        console.log(`Verifying Datetime: UI=${row.Datetime} | Search=${form.Datetime}`);
        expect(row.Datetime.trim()).toBe(form.Datetime.trim());
      }
      if (form.Date) {
        console.log(`Verifying Date: UI=${row.Date} | Search=${form.Date}`);
        expect(row.Date.trim()).toBe(form.Date.trim());
      }
      if (form.Time) {
        console.log(`Verifying Time: UI=${row.Time} | Search=${form.Time}`);
        expect(row.Time.trim()).toBe(form.Time.trim());
      }

      // Address Verification
      if (form.Address_no) {
        console.log(`Verifying Address contains Address_no: ${form.Address_no}`);
        expect(row.Address).toContain(form.Address_no);
      }
      if (form.Address_district) {
        console.log(`Verifying Address contains Address_district: ${form.Address_district}`);
        expect(row.Address).toContain(form.Address_district);
      }
      if (form.Address_subdistrict) {
        console.log(`Verifying Address contains Address_subdistrict: ${form.Address_subdistrict}`);
        expect(row.Address).toContain(form.Address_subdistrict);
      }
      if (form.Address_province) {
        console.log(`Verifying Address contains Address_province: ${form.Address_province}`);
        expect(row.Address).toContain(form.Address_province);
      }
      if (form.Address_zipcode) {
        console.log(`Verifying Address contains Address_zipcode: ${form.Address_zipcode}`);
        expect(row.Address).toContain(form.Address_zipcode);
      }
    }

  }

}







// ตรวจสอบว่าข้อมูลที่สร้าง ตรงกับแถวบนสุดของตารางหรือไม่
export async function verifyTopTableRow(page: Page, expected: { Name?: string, Phone?: string, Email?: string, CheckEdit?: string, CheckView?: string, StrictTopRow?: boolean }) {
  // CheckEdit and CheckView logic remains the same
  if (expected.CheckEdit) {
    await page.getByRole('row', { name: expected.CheckEdit }).locator('#dyn_row_action').click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    return;
  }

  if (expected.CheckView) {
    await page.getByRole('row', { name: expected.CheckView }).locator('#dyn_row_action').click();
    await page.getByRole('menuitem', { name: 'View' }).click();
    return;
  }

  const rows = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]');
  await expect(rows.first()).toBeVisible();

  let targetRow = rows.first();

  // If StrictTopRow is true, we strictly check the first row.
  // Otherwise, if Name is provided, we try to find the specific row.
  if (!expected.StrictTopRow && expected.Name) {
    const matchingRow = rows.filter({ has: page.locator('td').nth(1).filter({ hasText: expected.Name }) });
    if (await matchingRow.count() > 0) {
      targetRow = matchingRow.first();
      // console.log(`Found row matching Name: ${expected.Name}`);
    } else {
      console.warn(`Row with Name "${expected.Name}" not found. Defaulting to first row.`);
    }
  }

  if (expected.Name) {
    const nameCell = targetRow.locator('td').nth(1);
    await expect(nameCell).toHaveText(expected.Name);
  }

  if (expected.Phone) {
    const phoneCell = targetRow.locator('td').nth(9);
    await expect(phoneCell).toHaveText(expected.Phone);
  }

  if (expected.Email) {
    const emailCell = targetRow.locator('#dyn_row_email');
    await expect(emailCell).toHaveText(expected.Email);
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

export async function uploadFileWithLimitCheck(page: Page, filePath: string) {
  // Check current file count
  const currentFiles = page.locator('.filepond--item');
  await page.waitForTimeout(5000); // Reduced from 5000
  const initialFileCount = await currentFiles.count();
  console.log(`Initial file count: ${initialFileCount}`);

  let expectedCountBeforeUpload = initialFileCount;
  let removedFileName: string | undefined = undefined;

  if (initialFileCount >= 10) {
    console.log('File limit reached (10 files). Removing one file before upload...');

    // Identify the file to be removed (first file)
    const firstItem = currentFiles.first();
    removedFileName = await firstItem.locator('.filepond--file-info-main').textContent().then(t => t?.trim());
    console.log(`Removing file: ${removedFileName}`);

    // Remove the first file
    await page.locator('.filepond--action-remove-item').first().click();

    const popup_remove = page.getByLabel('Remove', { exact: true });
    await expect(popup_remove).toBeVisible();
    await popup_remove.click();

    // Wait for file to be removed (count should decrease)
    await expect(currentFiles).toHaveCount(initialFileCount - 1);
    console.log('File removed successfully. Count decreased by 1.');
    expectedCountBeforeUpload = initialFileCount - 1;
  } else {
    console.log('File limit not reached. Proceeding with upload.');
  }

  await page.setInputFiles('input[type="file"]', [filePath]);

  // Wait for the file count to increase (this confirms upload)
  const expectedFinalCount = expectedCountBeforeUpload + 1;
  await expect(currentFiles).toHaveCount(expectedFinalCount);
  console.log(`File count increased to: ${expectedFinalCount}`);

  // Wait for upload to potentially finish (FilePond might be processing)
  await page.waitForTimeout(3000);

  // Verify the file is present in the list after update
  const uploadedFileNames = await page.locator('.filepond--file-info-main').allTextContents();
  console.log('Uploaded files found:', uploadedFileNames);

  const fileName = filePath.split(/[/\\]/).pop(); // Simple check to get basename
  if (fileName) {
    expect(uploadedFileNames).toContain(fileName);
    console.log(`Verified that '${fileName}' exists in the file list.`);
  }

  // Debug if empty
  if (uploadedFileNames.length === 0) {
    const firstItem = page.locator('.filepond--item').first();
    if (await firstItem.isVisible()) {
      console.log('First item HTML:', await firstItem.innerHTML());
    } else {
      console.log('No filepond items visible.');
    }
  }

  return { fileName, finalCount: expectedFinalCount, removedFileName };
}








