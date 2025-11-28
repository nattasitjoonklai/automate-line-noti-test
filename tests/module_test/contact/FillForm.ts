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
  Dropdown_value?: string;
  Dropdown_mutlple_lv1?: string;
  Segment?: string;
  Dropdown_mutlple_lv2?: string;
  Dropdown_mutlple_lv3?: string;
  Dropdown_mutlple_lv4?: string;
  Dropdown_mutlple_lv5?: string;
  Dropdown_mutlple_lv6?: string;
  Datamasking?: string;
  Text_input?: string;
  Checkbox_TrueFalse?: string;
  Radio?: string;
  Datetime?: string;
  Date?: string;
  Time?: string;
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
  Datamasking: `Enter your Data Masking`,
  Text_input: `#dyn_txt_input`,
  Checkbox_TrueFalse: '#dyn_chkbox',
  Radio: '#dyn_radiobtn',
  Datetime: `#dyn_feu1`,
  Date: `#dyn_R8i6Yo`,
  Time: `#dyn_yC3zrN`,
  Segment: `#dyn_name_segment`
};

export const FillInputContactForm = async (page: Page, fields: ContactFormFields) => {
  // เลือก dropdown ตามลำดับ
  // Chain for multiple dropdown levels
  const multiDropdownLevels: (keyof ContactFormFields)[] = [
    "Dropdown_mutlple_lv1",
    "Dropdown_mutlple_lv2",
    "Dropdown_mutlple_lv3",
    "Dropdown_mutlple_lv4",
    "Dropdown_mutlple_lv5",
    "Dropdown_mutlple_lv6",
  ];

  for (const key of multiDropdownLevels) {
    const value = fields[key];
    if (!value) continue;

    // Check dependency
    const index = multiDropdownLevels.indexOf(key);
    if (index > 0) {
      const prevKey = multiDropdownLevels[index - 1];
      if (!fields[prevKey]) {
        console.warn(`Cannot select ${key} because ${prevKey} is not set`);
        continue;
      }
    }

    console.log(`Selecting ${key}: ${value}`);
    await page.waitForTimeout(1000)
    await page.locator(fieldMap[key]).click();

    // Wait for options to be visible
    await page.getByRole("option", { name: value }).waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole("option", { name: value }).click();

  }

  // Independent Dropdowns/Selects
  const independentSelects: (keyof ContactFormFields)[] = [
    "Dropdown_value",
    "Checkbox_TrueFalse",
    "Radio"
  ];

  for (const key of independentSelects) {
    const value = fields[key];
    if (!value) continue;

    console.log(`Selecting ${key}: ${value}`);
    // Check if it's a radio or checkbox which might need different handling if they are not standard dropdowns
    // But fieldMap maps them to IDs. If they are PrimeVue dropdowns/selects, click + option works.
    // If Radio is actual radio buttons, we need check().
    // fieldMap['Radio'] = '#dyn_radiobtn'. If it's a dropdown (as per HTML snippet earlier: <div id="dyn_radiobtn" class="p-select ...">), it's a dropdown.
    // fieldMap['Checkbox_TrueFalse'] = '#dyn_chkbox'. Also p-select.

    await page.locator(fieldMap[key]).click();
    await page.waitForTimeout(1000)
    await page.getByRole("option", { name: value }).click();
    await page.waitForTimeout(1000)
  }

  // กรอก textbox / input อื่น ๆ
  for (const key of Object.keys(fields) as (keyof ContactFormFields)[]) {
    const value = fields[key];
    if (!value) continue;
    if (key === "Datetime") {
      console.log(`Filling DATE: ${value}`);
      await page.locator(fieldMap[key]).locator('input').click();
      // await page.locator(fieldMap[key]).locator('input').fill(value);
      // await page.locator(fieldMap[key]).locator('input').press('Enter');
      await selectDateTime(page, value);

      continue;
    }
    if (key === "Date") {
      console.log(`Filling DATE: ${value}`);
      await page.locator(fieldMap[key]).locator('input').click();
      // await page.locator(fieldMap[key]).locator('input').fill(value);
      // await page.locator(fieldMap[key]).locator('input').press('Enter');
      await selectDateTime(page, value);


      continue;
    }
    if (key === "Time") {
      console.log(`Filling DATE: ${value}`);
      await page.locator(fieldMap[key]).locator('input').click();
      await page.locator(fieldMap[key]).locator('input').fill(value);
      await page.locator(fieldMap[key]).locator('input').press('Enter');
      // await selectDateTime(page, value);


      continue;
    }
    if (!multiDropdownLevels.includes(key) && !independentSelects.includes(key)) {
      const selector = fieldMap[key];
      if (selector.startsWith('#')) {
        await page.locator(selector).fill(value);
      } else {
        await page.getByRole("textbox", { name: selector }).fill(value);
      }
    }


  }
};

export async function selectDateTime(page: Page, dateTimeStr?: string) {
  if (!dateTimeStr) return;

  let year: number | null = null;
  let month: number | null = null;
  let day: number | null = null;
  let hour: number | null = null;
  let minute: number | null = null;

  // ตรวจสอบว่าเป็น "YYYY-MM-DD HH:MM", "YYYY-MM-DD" หรือ "HH:MM"
  if (dateTimeStr.includes('-')) {
    // มีวัน
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [y, m, d] = datePart.split('-').map(Number);
    year = y; month = m; day = d;

    if (timePart) {
      [hour, minute] = timePart.split(':').map(Number);
    }
  } else if (dateTimeStr.includes(':')) {
    // มีเวลาอย่างเดียว
    [hour, minute] = dateTimeStr.split(':').map(Number);
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthOrder: Record<string, number> = {
    "January": 1, "February": 2, "March": 3, "April": 4,
    "May": 5, "June": 6, "July": 7, "August": 8,
    "September": 9, "October": 10, "November": 11, "December": 12,
  };

  // ถ้ามีวัน ให้เลือกปี/เดือน/วัน
  if (year && month && day) {
    const monthName = monthNames[month - 1];
    const nextMonthBtn = page.locator('button.p-datepicker-next-button');
    const prevMonthBtn = page.locator('button.p-datepicker-prev-button');
    const yearLabel = page.locator('button.p-datepicker-select-year');
    const monthLabel = page.locator('button.p-datepicker-select-month');
    await page.waitForTimeout(500);
    while (true) {
      const currentYear = parseInt(await yearLabel.textContent() || "0");
      const currentMonth = (await monthLabel.textContent() || "").trim();
      await page.waitForTimeout(500);
      if (currentYear === year && currentMonth === monthName) break;

      if (currentYear > year || (currentYear === year && monthOrder[currentMonth] > monthOrder[monthName])) {
        await prevMonthBtn.click();
      } else {
        await nextMonthBtn.click();
      }
      await page.waitForTimeout(500);
    }

    const dayBtn = page.locator(`.p-datepicker-day:not(.p-disabled) >> text="${day}"`);
    await dayBtn.first().click();
  }

  // ถ้ามีเวลา ให้เลือกชั่วโมง/นาที
  if (hour !== null && minute !== null) {
    const hourUp = page.locator('button[aria-label="Next Hour"]');
    const hourDown = page.locator('button[aria-label="Previous Hour"]');
    const hourDisplay = page.locator('span[data-pc-section="hour"]');

    while (true) {
      const curText = await hourDisplay.textContent();
      const cur = curText ? parseInt(curText.trim()) : 0;
      if (cur === hour) break;
      if (cur < hour) await hourUp.click();
      else await hourDown.click();
      await page.waitForTimeout(80);
    }

    const minUp = page.locator('button[aria-label="Next Minute"]');
    const minDown = page.locator('button[aria-label="Previous Minute"]');
    const minDisplay = page.locator('span[data-pc-section="minute"]');

    while (true) {
      const curText = await minDisplay.textContent();
      const cur = curText ? parseInt(curText.trim()) : 0;
      if (cur === minute) break;
      if (cur < minute) await minUp.click();
      else await minDown.click();
      await page.waitForTimeout(80);
    }
  }
}


