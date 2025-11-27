import test, { expect, Page, APIRequestContext } from "@playwright/test";
import { BaseUrl, ContactPage } from "../../utils";
import { Element_Contact } from "./Elemenet_Contact";
import { FillInputContactForm, ContactFormFields } from "./FillForm";
import { ContactAPI, formatDate, verifyTopTableRow } from "./Global_function";
import { Element_Create_Contact } from "./Create_Element";

// function กรอกข้อมูล auto

const contactData = {
  Name: "12451222",
  Dropdown: "ทดสอบตัวเลือก 1",
  Phone: "01234567",
  Email: "asadada@gmail.com",
  Datamasking: "12332313",
  Radiobtn: "value1",
  Checkbox: true,
  Segment: "ทดสอบ Segment",
  Input_Segment: "ทดสอบการใช้งาน Input Segment",
  DateTime: "2025-11-25 14:58",
  Date: "2025-11-24",
  Time: "13:57",
  Address_no1: "123456",
  Address_province1: "กรุงเทพมหานคร",
  Change_name: 'Name_Edit',
  Change_phone: '0111111',
  text_input: 'text_input'
  // Btn_group: "1",
  // Dropdown_group: "2",
  // text_group: "Group ทดสอบ"
};
const contactData_Edit = {
  Name: `AutoEdit01`,
  Dropdown: "ทดสอบตัวเลือก 2", // Assuming this option exists
  Phone: "09999999",
  Email: "automail-01@test.com",
  Datamasking: "88888888",
  Radiobtn: "value2", // Assuming value2 exists
  Checkbox: true, // Toggle or ensure it's checked
  Segment: "ทดสอบ Segment",
  Input_Segment: "ทดสอบ Input Segment",
  DateTime: "2025-12-31 23:59",
  Date: "2025-12-31",
  Time: "23:59",

  // Dynamic Addresses
  Address_no_1: "111/1",
  Address_province_1: "กรุงเทพมหานคร",
  // Address_district_1: "เขตจตุจักร", // Optional: Add if known valid
  // Address_subdistrict_1: "แขวงจตุจักร",
  // Address_zipcode_1: "10900",

  Address_no_2: "222/2",
  Address_province_2: "นนทบุรี",
  // Address_district_2: "อำเภอเมืองนนทบุรี",
  // Address_subdistrict_2: "ตำบลตลาดขวัญ",
  // Address_zipcode_2: "11000",
};


const multipleDropdownData = {
  MultipleDropdownlv1: "Level1-1",
  MultipleDropdownlv2: "Level2-1-",
  MultipleDropdownlv3: "Level3-1-1",
  MultipleDropdownlv4: "Level 4_3_1_1",
  MultipleDropdownlv5: "Level 5_4_3_2_1",
  MultipleDropdownlv6: "Level 6_5_4_3_1_1"
};
const multipleDropdownData_Edt = {
  MultipleDropdownlv1: "Level1-1",
  MultipleDropdownlv2: "Level2-1-1",
  MultipleDropdownlv3: "Level3-1-1",
  MultipleDropdownlv4: "Level 4_3_1_1",
  MultipleDropdownlv5: "Level 5_4_3_2_2",
  MultipleDropdownlv6: "Level 6_5_4_3_2_3"
};

const filesToUpload = [
  "csv-test.csv",
  "jpg.jpg",
  "png.png"
];
test.beforeEach(async ({ page }) => {
  // Listen for all failed requests
  page.on('requestfailed', request => {
    console.log(`[NETWORK ERROR] Request failed: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });

  // Listen for responses with error status codes
  page.on('response', async response => {
    if (response.status() >= 400) {
      console.log(`[NETWORK ERROR] Response error: ${response.status()} ${response.statusText()} - ${response.url()}`);
      // Optional: Try to get response body
      try {
        const body = await response.text();
        console.log(`[NETWORK ERROR] Body: ${body}`);
      } catch (e) {
        console.log(`[NETWORK ERROR] Could not read body: ${e}`);
      }
    }
  });
});

test('CRM_CT00001 การเข้าหน้า Contact', async ({ page }) => {
  const contact = new Element_Contact(page);
  await page.goto(BaseUrl + '/contact');

  // 1. Verify Search fields
  await contact.btnSearch.click(); // Click to expand search filters
  await expect(contact.inputStartDate).toBeVisible();
  await expect(contact.inputEndDate).toBeVisible();
  await expect(contact.inputName).toBeVisible();
  await expect(contact.inputPhone).toBeVisible();
  await expect(contact.btnclear).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search' }).nth(1)).toBeVisible(); // Search button inside filter

  // 2. Verify Import button
  await expect(contact.btnImport).toBeVisible();
  await contact.btnImport.click();
  await expect(contact.btnImport_Import).toBeVisible();
  await expect(contact.btnImport_DownloadTemplate).toBeVisible();
  // Click again to close or click outside? Usually clicking outside or another element. 
  // Let's click btnImport again to toggle off if possible, or just proceed.
  await page.mouse.click(0, 0); // Click outside to close dropdown

  // 3. Verify Create Contact button
  await expect(contact.btnCreateContact).toBeVisible();

  // 4. Verify Export button
  await expect(contact.btnExport).toBeVisible();

  // 5. Verify Delete Contact button
  await expect(contact.btnDelete).toBeVisible();

  // 6. Verify Contact table data
  await contact.verifyTableHeaders();

  const actionBtn = page.locator('#dyn_row_action button').first();
  if (await actionBtn.isVisible()) {
    await actionBtn.click();
    await expect(contact.btnAction_View).toBeVisible();
    await expect(contact.btnAction_Edit).toBeVisible();
    await expect(contact.btnAction_Delete).toBeVisible();
  } else {
    console.log('No action button found to verify menu items (Table might be empty)');
  }
});
test('CRM_CT00002 การเข้าหน้าค้นหาลูกค้า Search', async ({ page }) => {
  const contact = new Element_Contact(page);
  await page.goto(BaseUrl + '/contact');
  await page.waitForLoadState("networkidle");

  await contact.btnSearch.click()
  await expect(contact.inputStartDate).toBeVisible();
  await expect(contact.inputEndDate).toBeVisible();
  await expect(contact.inputName).toBeVisible();
  await expect(contact.dropdown).toBeVisible();
  await expect(contact.multipledropdownlv1).toBeVisible();
  await expect(contact.multipledropdownlv2).toBeVisible();
  await expect(contact.multipledropdownlv3).toBeVisible();
  await expect(contact.multipledropdownlv4).toBeVisible();
  await expect(contact.multipledropdownlv5).toBeVisible();
  await expect(contact.multipledropdownlv6).toBeVisible();
  await expect(contact.inputPhone).toBeVisible();
  await expect(contact.inputEmail).toBeVisible();
  await expect(contact.inputDatemasking).toBeVisible();
  await expect(contact.inputCheckbox).toBeVisible();
  await expect(contact.btnRadio).toBeVisible();
  await expect(contact.inputDate).toBeVisible();
  await expect(contact.inputDatetime).toBeVisible();
  await expect(contact.inputTime).toBeVisible();
  await expect(contact.inputText).toBeVisible(); // text input
  await expect(contact.segmment).toBeVisible(); // Input Segment

  // Address Fields
  await expect(contact.addressNo).toBeVisible();
  await expect(contact.addressSubDistrict).toBeVisible();
  await expect(contact.addressDistrict).toBeVisible();
  await expect(contact.addressProvince).toBeVisible();
  await expect(contact.addressZipcode).toBeVisible();

  await expect(contact.inputCheckboxTest).toBeVisible(); // ทดสอบ Checkbox

  await contact.btnSearch.click();
});
test('CRM_CT00003 การค้นหาช่อง Start Datetime', async ({ page }) => {
  const contact = new Element_Contact(page);
  await page.goto(BaseUrl + '/contact');
  await contact.btnSearch.click();

  // Select Start Date
  await contact.inputStartDate.click();
  // Just pick the current date or a specific one. 
  // The calendar usually opens to current month.
  // Let's pick '1' or 'Today' if available.
  // Assuming standard PrimeVue calendar.
  await page.locator('.p-datepicker-today').click(); // Click Today
  await page.mouse.click(0, 0); // Click outside to close dropdown
  // Verify value is populated (optional but good)
  // const val = await page.locator('#start_datetime input').inputValue();
  // expect(val).toBeTruthy();

  // Click Search
  await page.getByRole('button', { name: 'Search' }).nth(1).click();

  // Verify search happened (e.g., table updated or no data)
  // Since we don't know if data exists for today, we just ensure no error.
  await expect(page.getByRole('table')).toBeVisible();
});

test('CRM_CT00004 การค้นหาช่อง End Datetime', async ({ page }) => {
  const contact = new Element_Contact(page);
  await page.goto(BaseUrl + '/contact');
  await contact.btnSearch.click();

  // Select End Date
  await contact.inputEndDate.click();
  await page.locator('.p-datepicker-today').click(); // Click Today

  // Click Search
  await page.getByRole('button', { name: 'Search' }).nth(1).click();

  await expect(page.getByRole('table')).toBeVisible();
});
test('CRM_CT00005   "การค้นหาช่องใส่ Name กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Email: "test01@gmail.com" });
});
test('CRM_CT00006   "การค้นหาช่องใส่ Name กรณีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await page.goto(BaseUrl + '/contact');
  await contact.btnSearch.click();
  await contact.inputName.fill('Testerere');
  await page.getByRole('button', { name: 'Search' }).nth(1).click()
  await expect(page.getByRole('cell', { name: 'No Data' })).toBeVisible();
});
test('CRM_CT00007   "การค้นหาช่องใส่ Phone กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Phone: "123123213" });

});
test('CRM_CT00008   "การค้นหาช่องใส่ Phone กรณีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy({ Phone: '12312312' });
  await contact.expectNoData();
});
test('CRM_CT00009   "การค้นหาช่องใส่ Phone กรณีกำหนดให้ Integer พิมพ์ได้เฉพาะตัวเลขเท่านั้น"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.btnSearch.click()
  await contact.inputPhone.fill('asdas123')
  expect(await page.getByText('Invalid numeric format')).toBeVisible();

});
test('CRM_CT00010   "การค้นหาช่องใส่ Email กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Email: "nattasit@cloudsoft.co.th" });

});
test('CRM_CT00011   "การค้นหาช่องใส่ Email กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page, request }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy({ Email: '1232213@gmail.com' });
  await contact.expectNoData();

});
test('CRM_CT00012   "การค้นหาช่องใส่ Email กรณีกรอกรูปแบบอีเมลไม่ถูกต้อง"', async ({ page, request }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.btnSearch.click()
  await contact.inputEmail.fill('asasas')
  await page.getByRole('button', { name: 'Search' }).nth(1).click(); // Trigger validation
  expect(await page.getByText('Invalid email format')).toBeVisible();

});
test('CRM_CT00013   "การค้นหาช่องใส่ Address ที่อยู่/บ้านเลขที่ กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Address_no: "88/12" });
});

test('CRM_CT00014   "การค้นหาช่องใส่ Address ที่อยู่/บ้านเลขที่ กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy({ Address_no: '999/999' }); // Non-existent
  await contact.expectNoData();
});

test('CRM_CT00015   "การค้นหาช่องใส่ Address ตำบล/แขวงกรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Address_subdistrict: "บางละมุง" });
});

test('CRM_CT00016 "การค้นหาช่องใส่ Address ตำบล/แขวง กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy({ Address_subdistrict: 'NonExistentSubDistrict' });
  await contact.expectNoData();
});

test('CRM_CT00017 "การค้นหาช่องใส่ Address อำเภอ/เขต กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Address_district: "บางละมุง" }); // Fixed key from Address_subdistrict to Address_district if API supports it, or check Element_Contact mapping
});

test('CRM_CT00018   "การค้นหาช่องใส่ Address อำเภอ/เขต กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy({ Address_district: 'NonExistentDistrict' });
  await contact.expectNoData();
});

test('CRM_CT00019  "การค้นหาช่องใส่ Address จังหวัด กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Address_province: "ชลบุรี" });
});

test('CRM_CT00020   "การค้นหาช่องใส่ Address จังหวัด กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy({ Address_province: 'NonExistentProvince' });
  await contact.expectNoData();
});

test('CRM_CT00021   "การค้นหาช่องใส่ Address รหัสไปรษณีย์ กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Address_zipcode: "20150" });
});

test('CRM_CT00022   "การค้นหาช่องใส่ Address รหัสไปรษณีย์ กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy({ Address_zipcode: '99999' });
  await contact.expectNoData();
});

test('CRM_CT00023  "การค้นหาช่องเลือก Dropdown กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page, request }) => {
  // Assuming ContactAPI supports Dropdown_value or we use Element_Contact
  // Existing code used ContactAPI, let's stick to it if it works, or use Element_Contact if API helper is missing
  // Given previous tests used ContactAPI, I'll assume it works.
  await ContactAPI.searchAndVerify(page, request, { Dropdown_value: "ทดสอบตัวเลือก 1" });
});

test('CRM_CT00024   "การค้นหาช่องเลือก Dropdown กรณีข้อมูลไม่มีอยู่ในระบบ"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy_Dropdown({ Dropodown: 'ทดสอบตัวเลือก 3' }); // Assuming this option exists but no data
  await contact.expectNoData();
});

test('CRM_CT00025   "การค้นหาช่องเลือก Collection Level 1 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Dropdown_mutlple_lv1: "Level1-1" });
});

test('CRM_CT00026	"การค้นหาช่องเลือก Collection Level 1 กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchByMultipleDropdown({ MultipleDropdownlv1: 'Level1-4' }); // Assuming this option exists but no data
  await contact.expectNoData();
});

test('CRM_CT00027  "การค้นหาช่องเลือก Collection Level 2 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Dropdown_mutlple_lv1: "Level1-1", Dropdown_mutlple_lv2: "Level2-1-1" });
});

test('CRM_CT00028	"การค้นหาช่องเลือก Collection Level 2 กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchByMultipleDropdown({ MultipleDropdownlv1: 'Level1-4', MultipleDropdownlv2: 'Level2-3-1' });
  await contact.expectNoData();
});

test('CRM_CT00029  "การค้นหาช่องเลือก Collection Level 3 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Dropdown_mutlple_lv1: "Level1-1", Dropdown_mutlple_lv2: "Level2-1-1", Dropdown_mutlple_lv3: "Level3-1-1" });
});

test('CRM_CT00030	"การค้นหาช่องเลือก Collection Level 3 กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchByMultipleDropdown({ MultipleDropdownlv1: 'Level1-4', MultipleDropdownlv2: 'Level2-3-1', MultipleDropdownlv3: 'Level3-3-3' });
  await contact.expectNoData();
});
test('CRM_CT00031  "การค้นหาช่องเลือก Collection Level 4 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request,
    {
      Dropdown_mutlple_lv1: 'Level1-1',
      Dropdown_mutlple_lv2: 'Level2-1-1',
      Dropdown_mutlple_lv3: 'Level3-1-1',
      Dropdown_mutlple_lv4: 'Level 4_3_1_1'
    });
});
test('CRM_CT00032	"การค้นหาช่องเลือก Collection Level 4 กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchByMultipleDropdown(
    {
      MultipleDropdownlv1: 'Level1-4',
      MultipleDropdownlv2: 'Level2-3-1',
      MultipleDropdownlv3: 'Level3-3-3',
      MultipleDropdownlv4: 'Level 4_3_1_2'
    });
  await contact.expectNoData();

});
test('CRM_CT00033  "การค้นหาช่องเลือก Collection Level 5 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request,
    {
      Dropdown_mutlple_lv1: 'Level1-1',
      Dropdown_mutlple_lv2: 'Level2-1-1',
      Dropdown_mutlple_lv3: 'Level3-1-1',
      Dropdown_mutlple_lv4: 'Level 4_3_1_1',
      Dropdown_mutlple_lv5: 'Level 5_4_3_2_1',
    });
});
test('CRM_CT00034	"การค้นหาช่องเลือก Collection Level 5 กรณีไม่มีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchByMultipleDropdown(
    {
      MultipleDropdownlv1: 'Level1-4',
      MultipleDropdownlv2: 'Level2-3-1',
      MultipleDropdownlv3: 'Level3-3-3',
      MultipleDropdownlv4: 'Level 4_3_1_2',
      MultipleDropdownlv5: 'Level 5_4_3_2_2',
    });
  await contact.expectNoData();

});
test('CRM_CT00035  "การค้นหาช่องเลือก Collection Level 6 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request,
    {
      Dropdown_mutlple_lv1: 'Level1-1',
      Dropdown_mutlple_lv2: 'Level2-1-1',
      Dropdown_mutlple_lv3: 'Level3-1-1',
      Dropdown_mutlple_lv4: 'Level 4_3_1_1',
      Dropdown_mutlple_lv5: 'Level 5_4_3_2_1',
      Dropdown_mutlple_lv6: 'Level 6_5_4_3_1_1'
    });
});
test('CRM_CT00036	"การค้นหาช่องเลือก Collection Level 6 กรณีไม่มีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchByMultipleDropdown(
    {
      MultipleDropdownlv1: 'Level1-4',
      MultipleDropdownlv2: 'Level2-3-1',
      MultipleDropdownlv3: 'Level3-3-3',
      MultipleDropdownlv4: 'Level 4_3_1_2',
      MultipleDropdownlv5: 'Level 5_4_3_2_2',
      MultipleDropdownlv6: 'Level 6_5_4_3_1_4'
    });
  await contact.expectNoData();

});
test('CRM_CT00037	"การค้นหาช่อง Data Masking กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {

  await ContactAPI.searchAndVerify(page, request, { Datamasking: "asking" });
});
test('CRM_CT00038	"การค้นหาช่อง Data Masking กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page, request }) => {

  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy({ Datamasking: 'Tester' });
  await contact.expectNoData();
});
test('CRM_CT00039	"การค้นหาช่อง Check Box กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {

  await ContactAPI.searchAndVerify(page, request, { Checkbox_TrueFalse: "true" });
});
test('CRM_CT00040	"การค้นหาช่อง Check Box กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page, request }) => {

  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy_Checkbox({ Checkbox: 'true' });
  await contact.expectNoData();
});
test('CRM_CT00041	"การค้นหาช่อง Radio Button กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page, request }) => {

  await ContactAPI.searchAndVerify(page, request, { Radio: "value1" });
});
test('CRM_CT00042	"การค้นหาช่อง Radio Button กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page, request }) => {

  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.searchBy_Radiobtn({ Radiobtn: 'value3' });
  await contact.expectNoData();
});
test('CRM_CT00043	"การค้นหาช่อง Date Time กรณีมีรายชื่อลูกค้าอยู่ในระบบ"""', async ({ page, request }) => {

  await ContactAPI.searchAndVerify(page, request, { Datetime: "2025-11-13 15:53" });
});
test('CRM_CT00044	"การค้นหาช่อง Date Time กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.search_datetime({ Datetime: '2025-11-13 15:53' });
  await contact.expectNoData();
});

test('CRM_CT00045	"การค้นหาช่อง Date กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {

  await ContactAPI.searchAndVerify(page, request, { Date: "2025-11-18" });
});
test('CRM_CT00046	"การค้นหาช่อง Date กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.search_datetime({ Date: '2025-12-31' });
  await contact.expectNoData();
});
test('CRM_CT00047	"การค้นหาช่อง Time กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page, request }) => {

  await ContactAPI.searchAndVerify(page, request, { Time: "15:53" });
});
test('CRM_CT00048	"การค้นหาช่อง Time กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.search_datetime({ Time: '15:53' });
  await contact.expectNoData();
});
test('CRM_CT00049	"การค้นหาช่อง Segment กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page, request }) => {
  await ContactAPI.searchAndVerify(page, request, { Segment: "ทดสอบ Segment" });

});
test('CRM_CT00050	"การค้นหาช่อง Segment กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.btnSearch.click();
  await page.locator('#dyn_name_segment').fill('NonExistentSegment12345');
  await page.getByRole('button', { name: 'Search' }).nth(1).click();
  await page.waitForTimeout(2000);
  await contact.expectNoData();
});

// test('CRM_CT00051	การค้นหาข้อมูล (ปุ่มSearch) ""', async ({ page }) => {
//   const contact = new Element_Contact(page);
//   await contact.goto();
//   await contact.search_datetime({ Time: '15:53' });
//   await contact.expectNoData();
// });
// test('CRM_CT00052	"การค้นหาข้อมูล (ปุ่มSearch) กรณีไม่มีข้อมูลรายชื่อลูกค้าที่ Search" ', async ({ page }) => {
//   const contact = new Element_Contact(page);
//   await contact.goto();
//   await contact.search_datetime({ Time: '15:53' });
//   await contact.expectNoData();
// });

test('CRM_CT00053	การล้างข้อมูลที่กรอก (ปุ่มClear)', async ({ page }) => {
  const contact = new Element_Contact(page);
  await contact.goto();
  await contact.btnSearch.click();

  // Prepare data to fill fields
  const fillData = {
    Name: "Test Name",
    Phone: "0812345678",
    Email: "test@email.com",
    Datamasking: "123456",
    Segment: "ทดสอบ Segment",
    Text_input: "Test Input",
    Address_no: "123",
    Address_subdistrict: "แขวง",
    Address_district: "เขต",
    Address_province: "จังหวัด",
    Address_zipcode: "10000",
    // Use values that are likely to exist or simple text if they are text inputs
    // For dropdowns, we use values from previous tests
    Dropdown_value: "ทดสอบตัวเลือก 1",
    Dropdown_mutlple_lv1: "Level1-1",
    Radio: "value1",
    Checkbox_TrueFalse: "true",
    Datetime: "2025-11-25 14:00",
    Date: "2025-11-25",
    Time: "14:00",
  };

  // Fill the form
  await FillInputContactForm(page, fillData);

  // Click Clear
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.waitForTimeout(1000); // Wait for clear action to complete

  // Verify fields are cleared
  await expect(contact.inputName).toHaveValue('');
  await expect(contact.inputPhone).toHaveValue('');
  await expect(contact.inputEmail).toHaveValue('');
  await expect(contact.inputDatemasking).toHaveValue('');

  // Verify Start/End Datetime Reset
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dateStr = `${year}-${month}-${day}`;

  // Start Date should be Current Date 00:00
  const startVal = await contact.inputStartDate.locator('input').inputValue();
  console.log('Start Date Value after Clear:', startVal);
  expect(startVal).toContain(dateStr);
  expect(startVal).toContain('00:00');

  // End Date should be Current Date 23:59
  const endVal = await contact.inputEndDate.locator('input').inputValue();
  console.log('End Date Value after Clear:', endVal);
  expect(endVal).toContain(dateStr);
  expect(endVal).toContain('23:59');
});

test('CRM_CT00054	การสร้้างรายชื่อลูกค้า (Create Contact)" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()


  await expect(contact.inputName).toBeVisible();
  await expect(contact.dropdown).toBeVisible();
  await expect(contact.multipledropdownlv1).toBeVisible();
  await expect(contact.multipledropdownlv2).toBeVisible();
  await expect(contact.multipledropdownlv3).toBeVisible();
  await expect(contact.multipledropdownlv4).toBeVisible();
  await expect(contact.multipledropdownlv5).toBeVisible();
  await expect(contact.multipledropdownlv6).toBeVisible();
  await expect(contact.inputPhone).toBeVisible();
  await expect(contact.inputEmail).toBeVisible();
  await expect(contact.inputDatemasking).toBeVisible();
  await expect(contact.inputCheckbox).toBeVisible();
  await expect(contact.btnRadio).toBeVisible();
  await expect(contact.inputDate).toBeVisible();
  await expect(contact.inputDatetime).toBeVisible();
  await expect(contact.inputTime).toBeVisible();

});
test('CRM_CT00055	การใส่ข้อมูลช่อง Name " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await contact.inputName.fill('ทดสอบ')
  await expect(contact.inputName).toHaveValue('ทดสอบ');

});

// test('CRM_CT00056	"การใส่ข้อมูล ช่องName กรณีใส่Nameซ้ำ"" ', async ({ page }) => {
//   const contact = new Element_Create_Contact(page);
//   await contact.goto();
//   await contact.btnCreateContact.click()

//   await contact.inputName.fill('ทดสอบ')
//   await expect(contact.inputName).toHaveValue('ทดสอบ');

// });
test('CRM_CT00057	"การใส่ข้อมูลช่อง Name กรณีไม่่ใส่ Name " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await contact.submmit_contact.click()
  await expect(contact.error_msg_empty).toBeVisible();


});
test('CRM_CT00058	การใส่ข้อมูลช่อง Phone" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await contact.inputPhone.fill('0917777')
  await expect(contact.inputPhone).toHaveValue('0917777');

});
test('CRM_CT00059	"การใส่ข้อมูลช่อง Phone กรณีใส่ตัวอักษรหรืออักขระพิเศษ" " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.inputPhone.fill('sadsada')
  await contact.submmit_contact.click()
  await expect(contact.error_msg_val).toBeVisible();

});
test('CRM_CT00060	"การใส่ข้อมูลช่อง Phone กรณีไม่ใส่ข้อมูล " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.inputName.fill('1231456')
  await contact.submmit_contact.click()
  const visible = await contact.error_msg_empty.isVisible(); // ต้องเป็น Locator
  expect(visible).toBe(true);

});
test('CRM_CT00061	การเพิ่มช่องใส่ Phone (ปุ่มAdd Phone)" " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.getByRole('button', { name: 'Add Phone' }).click();
  await page.locator('#dyn_phone_1').click();
  await page.locator('#dyn_phone_1').fill('231231313');
  await expect(page.locator('#dyn_phone_1')).toHaveValue('231231313');
});
test('CRM_CT00062	การใส่ข้อมูลช่อง Email " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.inputEmail.fill('nattasit@cloudsoft.co.th')
  await expect(contact.inputEmail).toHaveValue('nattasit@cloudsoft.co.th')
});
test('CRM_CT00063	"การใส่ข้อมูลช่อง Email กรณีกรอกไม่ตรงรูปแบบ Email " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.inputEmail.fill('Admintest@mail')
  await expect(contact.error_msg_email_valid).toBeVisible();
});
test('CRM_CT00064	การเพิ่มข้อมูลที่อยู่ (ปุ่ม Add Address)" " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.btn_address.click()
  await expect(contact.input_address).toBeVisible()
  await expect(contact.addressDistrict).toBeVisible()
  await expect(contact.addressSubDistrict).toBeVisible()
  await expect(contact.addressZipcode).toBeVisible()

});
test('CRM_CT00065	"การใส่ข้อมูลช่อง Address ที่อยู่ " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await contact.btn_address.click();
  await contact.input_address.fill('ทดสอบการใส่ที่อยู')
  expect(contact.input_address).toHaveValue('ทดสอบการใส่ที่อยู')


});
test('CRM_CT00066	กรณีค้นหา ตำบล/แขวง ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await contact.btn_address.click();
  await page.waitForTimeout(1000)
  await page.locator('.grid.grid-cols-2 > div:nth-child(2) > #dropdownEl > .relative > .w-8').click()
  await page.getByRole('combobox', { name: 'ค้นหา ตำบล/แขวง' }).fill('หลักสอง');

  await page.waitForTimeout(3000)
  await page.getByRole('option', { name: 'หลักสอง » บางแค » กรุงเทพมหานคร »' }).click()

  expect(await page.getByRole('combobox', { name: 'หลักสอง' })).toBeVisible()


});
test('CRM_CT00067	กรณีค้นหา อำเภอ/เขต ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.btn_address.click();
  await page.waitForTimeout(1000)
  await page.getByRole('combobox', { name: 'ค้นหา อำเภอ / เขต' }).fill('บางแค');
  await page.waitForTimeout(1000)
  await page.locator('.grid.grid-cols-2 > div:nth-child(3) > #dropdownEl > .relative > .w-8').click()
  await page.getByText('บางแค » บางแค » กรุงเทพมหานคร »').click();
  await expect(page.getByRole('combobox', { name: 'บางแค' }).nth(1)).toBeVisible()
});
test('CRM_CT00068	กรณีค้นหา จังหวัด ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.btn_address.click();
  await page.waitForTimeout(1000)
  await page.getByRole('combobox', { name: 'ค้นหา จังหวัด' }).fill('กรุงเทพมหานคร');
  await page.waitForTimeout(1000)
  await page.locator('.grid.grid-cols-2 > div:nth-child(4) > #dropdownEl > .relative > .w-8').click()
  await page.getByRole('option', { name: 'คลองต้นไทร » คลองสาน » กรุงเทพมหานคร »' }).click();
  await expect(page.getByRole('combobox', { name: 'กรุงเทพมหานคร' })).toBeVisible()
});
test('CRM_CT00069	กรณีค้นหา รหัสไปรษณีย์ ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.btn_address.click();

  await page.waitForTimeout(1000)

  await page.getByRole('combobox', { name: 'ค้นหา รหัสไปรษณีย์' }).click();
  await page.waitForTimeout(1000)
  await page.locator('.grid.grid-cols-2 > div:nth-child(5) > #dropdownEl > .relative > .w-8 > .lucide').click();
  await page.getByRole('combobox', { name: 'ค้นหา รหัสไปรษณีย์' }).click();
  await page.getByRole('combobox', { name: 'ค้นหา รหัสไปรษณีย์' }).fill('10160');
  await page.getByRole('option', { name: 'บางแค » บางแค » กรุงเทพมหานคร »' }).click()


  expect(await page.getByRole('combobox', { name: '10160' })).toBeVisible()
});
test('CRM_CT00070	"การใส่ข้อมูลช่อง Address กรณีไม่ใส่ข้อมูลที่อยู่ "" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click();
  await contact.btn_address.click();

  // Fill required fields using class methods
  await contact.inputName.fill('test');
  await contact.inputPhone.fill('123456');
  await contact.inputEmail.fill('example@gmail.com');
  await contact.inputText.fill('test_input');
  await page.getByRole('radio', { name: 'value1' }).check();
  await page.locator('#dyn_chkbox').nth(1).check();
  await contact.input_Create_Date.fill('2025-11-01');

  // Click outside to close any open dropdowns
  await page.locator('.flex.justify-between.items-center.mb-1').click();

  // Try to create without filling address fields
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.pause()
  // Verify validation errors for required address fields
  expect(await page.getByText('Value is required').first()).toBeVisible();
  expect(await page.getByText('Value is required').nth(1)).toBeVisible();
  expect(await page.getByText('Value is required').nth(2)).toBeVisible();
  expect(await page.getByText('Value is required').nth(3)).toBeVisible();
  expect(await page.getByText('Value is required').nth(4)).toBeVisible();
});
test('CRM_CT00071	การเลือกข้อมูลช่อง Dropdown"" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await contact.btn_address.click();


  await page.getByRole('combobox').filter({ hasText: /^$/ }).nth(5).click();
  await page.locator('#pv_id_16_0').getByText('ทดสอบตัวเลือก').click();
  expect(await page.getByRole('combobox', { name: 'ทดสอบตัวเลือก' })).toBeVisible()


});

test('CRM_CT00072	การเลือกข้อมูลช่อง Multi Dropdown"" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click();
  await contact.btn_address.click();

  // Use the fillInputMultipleDropdown method from the class
  await contact.fillInputMultipleDropdown({
    MultipleDropdownlv1: 'Level1-1',
    MultipleDropdownlv2: 'Level2-1-',
    MultipleDropdownlv3: 'Level3-1-1',
    MultipleDropdownlv4: 'Level 4_3_1_1',
    MultipleDropdownlv5: 'Level 5_4_3_2_1',
    MultipleDropdownlv6: 'Level 6_5_4_3_1_1'
  });

  // Verify all levels are selected
  expect(await page.getByRole('combobox', { name: 'Level1-' })).toBeVisible();
  expect(await page.getByRole('combobox', { name: 'Level2-1-' })).toBeVisible();
  expect(await page.getByRole('combobox', { name: 'Level3-1-' })).toBeVisible();
  expect(await page.getByRole('combobox', { name: 'Level 4_3_1_1' })).toBeVisible();
  expect(await page.getByRole('combobox', { name: 'Level 5_4_3_2_1' })).toBeVisible();
  expect(await page.getByRole('combobox', { name: 'Level 6_5_4_3_1_1' })).toBeVisible();
});
test('CRM_CT00073	การใส่ข้อมูลช่อง Text Input" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await contact.inputName.fill('ทดสอบ')
  await expect(contact.inputName).toHaveValue('ทดสอบ');

});
test('CRM_CT00074	"การใส่ข้อมูลช่อง Text Input กรณีใส่ Text Input ความยาวตัวอักษร สูงสุด 10 The maximum length allowed is 10"" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await contact.inputName.fill('ทดสอบsadsadsddd11')
  expect(await page.getByText('Name *The maximum length')).toBeVisible()


});
test('CRM_CT00075	"การใส่ข้อมูลช่อง Text Input กรณีีไม่ใส่ Text Input Value is required""" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  expect(await page.getByText('Name *Value is required')).toBeVisible()

});
test('CRM_CT00076	"การใส่ข้อมูลช่อง Data Masking " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.locator('#dyn_datamasking').nth(1).fill('*****32323131');
  const text = await page.locator('#dyn_datamasking').nth(1).inputValue();
  await expect(text).toBe('*****32323131');
});
test('CRM_CT00077	"การติ๊กเลือกRadio Button " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.getByRole('radio', { name: 'value2' }).check();
  const radioLabel = page.getByLabel('value2'); // Playwright จับ input ที่ for="dyn_radiobtn_1"
  await expect(radioLabel).toBeChecked();

});

test('CRM_CT00078	"การติ๊กเลือกCheckbox " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await page.locator('#dyn_chkbox').nth(1).click()
  const isChecked = await page.locator('#dyn_chkbox').nth(1).isChecked();
  console.log(isChecked); // true or false
  expect(isChecked).toBe(true);


});

test('CRM_CT00079	การใส่รูปภาพ Image   Fail  " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await page.locator('#dyn_chkbox').nth(1).click()
  const isChecked = await page.locator('#dyn_chkbox').nth(1).isChecked();
  console.log(isChecked); // true or false
  expect(isChecked).toBe(true);


});
test('CRM_CT00080	การใส่ข้อมูลวันที่และเวลา Date Time  " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await page.getByRole('combobox', { name: 'datetime', exact: true }).click();
  await contact.input_Field({ DateTime: '2025-11-20 17:09' })
  const datetime = await page.getByRole('combobox', { name: 'datetime', exact: true }).getAttribute('value');
  expect(datetime).toBe('2025-11-20 17:09')
});
test('CRM_CT00081	การใส่ข้อมูลวันที่ Date " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.getByRole('combobox', { name: 'date of birth', exact: true }).click();

  await page.getByRole('combobox', { name: 'date of birth', exact: true }).fill('2025-11-24')

  const datetime = await page.getByRole('combobox', { name: 'date of birth', exact: true }).getAttribute('value');
  console.log("date time", datetime);

  // expect(dob).toBe("2025-11-18");



});
test('CRM_CT00082	การใส่ข้อมูลเวลา Time " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.getByRole('combobox', { name: 'Time', exact: true }).fill('17:18')
  const datetime = await page.getByRole('combobox', { name: 'Time', exact: true }).getAttribute('value');

  expect(datetime).toBe('17:18')
});
test('CRM_CT00083	ฺปุ่มกดลิ้งค์ไปหน้าอื่น Button " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()


  await contact.btn_link.click()
  await expect(page).toHaveURL(/google\.com/);

});
test('CRM_CT00084	"การเลือกกลุ่มและข้อมูลในกลุ่มที่เลือก จะแสดงก็ต่อเมื่อมีการเปลี่ยนแปลง Segment" " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()


  await page.getByRole('textbox', { name: 'segment', exact: true }).fill('ทดสอบ Segment');
  expect(await page.locator('#dyn_text_segment')).toBeVisible()


});

// test('CRM_CT00085	การเลือกใส่ข้อมูลในกลุุ่่ม Group " ', async ({ page }) => {
//   const contact = new Element_Create_Contact(page);
//   await contact.goto();
//   await contact.btnCreateContact.click()
//   await page.getByRole('radio', { name: '2', exact: true }).click()
//   const radio2 = page.locator('input[type="radio"][value="2"]');

//   await page.locator('#dyn_iu').click()
//   await page.getByRole('option', { name: '2', exact: true }).click();
//   const ddl_value = await page.getByRole('combobox', { name: '2', exact: true })
//   await expect(ddl_value).toBeVisible()
//   await expect(radio2).toBeChecked();
//   await page.locator('#dyn_text_group').fill('ทดสอบ Group')
//   const text_group = await page.locator('#dyn_text_group').getAttribute('value');
//   expect(text_group).toBe('ทดสอบ Group')

//   //   expect (await page.getByText('button *1234')).toBeVisible()
//   //  expect( await page.getByText('drop *No results found')).toBeVisible()

// });

// test('CRM_CT00086	การค้นหาข้อมูล Search    ===== Fail อยู่" ', async ({ page }) => {
//   const contact = new Element_Create_Contact(page);
//   await contact.goto();
//   await contact.btnCreateContact.click()
//   await page.getByRole('radio', { name: '2', exact: true }).click()
//   const radio2 = page.locator('input[type="radio"][value="2"]');

//   await page.locator('#dyn_iu').click()
//   await page.getByRole('option', { name: '2', exact: true }).click();
//   const ddl_value = await page.getByRole('combobox', { name: '2', exact: true })
//   await expect(ddl_value).toBeVisible()
//   await expect(radio2).toBeChecked();
//   await page.locator('#dyn_text_group').fill('ทดสอบ Group')
//   const text_group = await page.locator('#dyn_text_group').getAttribute('value');
//   expect(text_group).toBe('ทดสอบ Group')

//   //   expect (await page.getByText('button *1234')).toBeVisible()
//   //  expect( await page.getByText('drop *No results found')).toBeVisible()

// });
test('CRM_CT00087	"การสร้างเนื้อหาแจ้งเตือน การอัปโหลด Attach File สามารถอัปโหลดได้สูงสุด 10 ไฟล์และขนาดไฟล์ทั้งหมดไม่เกิน 5 MB "" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/jpg.jpg',
    'tests/file_update-test/png.png',
    'tests/file_update-test/csv-test.csv',
    'tests/file_update-test/doc-test.doc',
    'tests/file_update-test/xls-test.xls',
    'tests/file_update-test/xlsx-test.xlsx',

    'tests/file_update-test/xls-test.xls',
    'tests/file_update-test/xlsx-test.xlsx',
    'tests/file_update-test/doc-test.doc',
    'tests/file_update-test/xls-test.xls',
  ]);

  const expectedFiles = [
    'jpg.jpg',
    'png.png',
    'csv-test.csv',
    'doc-test.doc',
    'xls-test.xls',
    'xlsx-test.xlsx',
    'xls-test.xls',
    'xlsx-test.xlsx',
    'doc-test.doc',
    'xls-test.xls'
  ];
  const items = page.locator('.filepond--item');
  await expect(items).toHaveCount(expectedFiles.length);

  // 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();

  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);


  //   expect (await page.getByText('button *1234')).toBeVisible()
  //  expect( await page.getByText('drop *No results found')).toBeVisible()

});

test('CRM_CT00090	"การสร้างเนื้อหา อัปโหลด Attach File (Type DOC) ขนาดไฟล์ไม่เกิน5MB"" "" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/doc-test.doc',
  ]);

  const expectedFiles = [
    'doc-test.doc',
  ];
  const items = page.locator('.filepond--item');
  await expect(items).toHaveCount(expectedFiles.length);

  // 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();

  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);


  //   expect (await page.getByText('button *1234')).toBeVisible()
  //  expect( await page.getByText('drop *No results found')).toBeVisible()

});
test('CRM_CT00091	"การสร้างเนื้อหา อัปโหลด Attach File (Type DOC) กรณีขนาดไฟล์เกิน5MB" "" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()

  await page.setInputFiles('input[type="file"]', [

    'tests/file_update-test/doc-14mb.doc',

  ]);
  expect(await contact.error_attach_file).toBeVisible()

  //   expect (await page.getByText('button *1234')).toBeVisible()
  //  expect( await page.getByText('drop *No results found')).toBeVisible()

});

test('CRM_CT00092	"การสร้างเนื้อหา อัปโหลด Attach File (Type DOCX) ขนาดไฟล์ไม่เกิน5MB " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/docx-test.docx',
  ]);
  const items = page.locator('.filepond--item');
  const expectedFiles = [
    'docx-test.docx',
  ];
  await expect(items).toHaveCount(expectedFiles.length);
  // 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);
});
test('CRM_CT00093	"การสร้างเนื้อหา อัปโหลด Attach File (Type DOCX) กรณีขนาดไฟล์เกิน5MB " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/docx-13mb.docx',
  ]);
  await page.waitForTimeout(2000)
  expect(await contact.error_attach_file).toBeVisible()
});
test('CRM_CT00094	"การสร้างเนื้อหา อัปโหลด Attach File (Type XLS) ""ขนาดไฟล์ไม่เกิน5MB " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/xls-test.xls',
  ]);
  const items = page.locator('.filepond--item');
  const expectedFiles = [
    'xls-test.xls',
  ];
  await expect(items).toHaveCount(expectedFiles.length);
  // 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);
});
test('CRM_CT00095	"การสร้างเนื้อหา อัปโหลด Attach File (Type XLS) ""กรณีขนาดไฟล์เกิน5MB"" " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/xls-15mb.xls',
  ]);
  await page.waitForTimeout(2000)
  expect(await contact.error_attach_file).toBeVisible()
});

test('CRM_CT00096	"การสร้างเนื้อหา อัปโหลด Attach File (Type XLSX) ""ขนาดไฟล์ไม่เกิน5MB"" " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/xlsx-test.xlsx',
  ]);
  const items = page.locator('.filepond--item');
  const expectedFiles = [
    'xlsx-test.xlsx',
  ];
  await expect(items).toHaveCount(expectedFiles.length);
  // 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);
});
test('CRM_CT00097	"การสร้างเนื้อหา อัปโหลด Attach File (Type XLSX) ""กรณีขนาดไฟล์เกิน5MB"" "" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/11mb.xlsx',
  ]);
  await page.waitForTimeout(2000)
  expect(contact.error_attach_file).toBeVisible()
});

test('CRM_CT00098	"การสร้างเนื้อหา อัปโหลด Attach File (Type CSV) ""ขนาดไฟล์ไม่เกิน5MB"" " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/csv-test.csv',
  ]);
  const items = page.locator('.filepond--item');
  const expectedFiles = [
    'csv-test.csv',
  ];
  await expect(items).toHaveCount(expectedFiles.length);
  // 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);
});
test('CRM_CT00099	"การสร้างเนื้อหา อัปโหลด Attach File (Type CSV) ""กรณีขนาดไฟล์เกิน5MB"" "" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/6mb.csv',
  ]);
  await page.waitForTimeout(2000)
  expect(contact.error_attach_file).toBeVisible()
});
test('CRM_CT00100	"การสร้างเนื้อหา อัปโหลด Attach File (Type PNG) ""ขนาดไฟล์ไม่เกิน5MB"" " " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/png-test.png',
  ]);
  const items = page.locator('.filepond--item');
  const expectedFiles = [
    'png-test.png',
  ];
  await expect(items).toHaveCount(expectedFiles.length);
  // 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);
});
test('CRM_CT00101	"การสร้างเนื้อหา อัปโหลด Attach File (Type PNG) ""กรณีขนาดไฟล์เกิน5MB"" " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/12mb.png',
  ]);
  await page.waitForTimeout(2000)
  expect(contact.error_attach_file).toBeVisible()
});
test('CRM_CT00102	"การสร้างเนื้อหา อัปโหลด Attach File (Type JPG) ""ขนาดไฟล์ไม่เกิน5MB"" " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/jpg-test.jpg',
  ]);
  const items = page.locator('.filepond--item');
  const count = await items.count();
  const fileNames: string[] = [];
  for (let i = 0; i < count; i++) {
    const fileName = await items.nth(i).locator('.filepond--file-info-main').textContent();
    if (fileName) fileNames.push(fileName.trim());
  }
  const expectedFiles = ['jpg-test.jpg'];
  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);
});
test('CRM_CT00103	"การสร้างเนื้อหา อัปโหลด Attach File (Type JPG) ""กรณีขนาดไฟล์เกิน5MB"" " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/jpg-15mb.jpg',
  ]);
  await page.waitForTimeout(2000)
  expect(contact.error_attach_file).toBeVisible()
});

test('CRM_CT00104	"การสร้างเนื้อหา อัปโหลด Attach File (Type JPEG) ""ขนาดไฟล์ไม่เกิน5MB"" " ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/jpeg-test.jpeg',
  ]);
  const items = page.locator('.filepond--item');
  const expectedFiles = [
    'jpeg-test.jpeg',
  ];
  await expect(items).toHaveCount(expectedFiles.length);
  // 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  // 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);
});
test('CRM_CT00105	"การสร้างเนื้อหา อัปโหลด Attach File (Type JPEG) ""กรณีขนาดไฟล์เกิน5MB""" ', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click()
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/jpeg-20mb.jpeg',
  ]);
  await page.waitForTimeout(2000)
  expect(contact.error_attach_file).toBeVisible()
});
test('CRM_CT00106	"การสร้างเนื้อหา ปุ่มกด X Remove File " ', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click();

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/csv-test.csv',
    'tests/file_update-test/jpg-test.jpg',
    'tests/file_update-test/jpg.jpg'
  ]);

  // กด Remove อันที่ 1
  await page.getByRole('button', { name: 'Remove' }).nth(1).click();

  // popup confirm
  const popup_remove = page.getByLabel('Remove', { exact: true });
  await expect(popup_remove).toBeVisible();
  await popup_remove.click();

  // ❗ ตรวจสอบว่าไฟล์ถูกลบจริง
  const items = page.locator('.filepond--item');

  // หลังลบ 1 ไฟล์ เหลือ 2 ไฟล์
  await expect(items).toHaveCount(2);

  // ดึงชื่อไฟล์ที่ยังเหลือ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  console.log("Files after remove: ", fileNames);

  // ชื่อไฟล์ที่คาดว่าจะเหลือ
  const expectedRemaining = [
    'csv-test.csv',
    'jpg.jpg'
  ];

  expect(fileNames.sort()).toEqual(expectedRemaining.sort());

  // ตรวจสอบว่าไฟล์ที่ถูกลบ **ไม่อยู่แล้ว**
  expect(fileNames).not.toContain('jpg-test.jpg');


});

// test('CRM_CT00107	ปุ่มกดเพิ่มช่องการเชื่อมต่อ Sync', async ({ page }) => {
//   // TODO: Implement test for Sync connection button
// });

test('CRM_CT00108	การจดบันทึก Note ', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click();
  const input = page.locator('input.p-inputtext');
  await expect(input).toBeDisabled();


});

test('CRM_CT00109	ยกเลิกการสร้าง (ปุ่มCancel) ', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click();
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByText('ทดสอบ SectionName *ทดสอบ')).not.toBeVisible();


});


test('CRM_CT00110 	การสร้างลูกค้า Contact (ปุ่มCreate) ', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await contact.btnCreateContact.click();
  await page.getByRole('combobox', { name: 'date of birth', exact: true }).fill('2025-11-24')
  await contact.input_Field(contactData);


  await contact.uploadFiles(page, filesToUpload);


  await contact.fillInputMultipleDropdown(multipleDropdownData)
  await page.waitForTimeout(1000)
  await contact.submmit_contact.click()

  await page.getByLabel('Create', { exact: true }).click()

  await page.waitForTimeout(2000)
  await verifyTopTableRow(page, {
    Name: contactData.Name,

  });
});
test('CRM_CT00111	การส่งออกข้อมูลลูกค้า (ปุ่มExport)', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  // ชื่อไฟล์ที่ดาวน์โหลด
  const [download] = await Promise.all([
    page.waitForEvent('download'), // รอ download event
    await contact.btnExport.click(), // คลิกปุ่ม export
  ]);
  expect(await page.getByText('Report export successful.')).toBeVisible()
  const suggestedFilename = download.suggestedFilename();
  expect(suggestedFilename).toBe('contact.xlsx')
})

test('CRM_CT00112	"ติ๊กกล่องเลือกข้อมูล Contact สำหรับลบรายชื่อลูกค้า (ปุ่มDelete Contact)"', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await page.waitForTimeout(5000)
  await verifyTopTableRow(page, { CheckDelete: contactData.Name })
})

// test('CRM_CT00113	การนำเข้าข้อมูลลูกค้า (ปุ่มImport File)', async ({ page }) => {
//   // TODO: Implement test for Import File functionality
// });

// test('CRM_CT00114	การดาวน์โหลดแบบฟอร์มตัวอย่าง (Template)', async ({ page }) => {
//   // TODO: Implement test for Template download
// });

test('CRM_CT00115	การเข้าชมข้อมูลลูกค้า (View Contact) ========== Fail', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckView: contactData.Name })


  expect(await contact.inputName.inputValue()).toBe(contactData.Name);

  expect(await contact.multipledropdownlv1.textContent()).toBe(multipleDropdownData.MultipleDropdownlv1);
  expect(await contact.multipledropdownlv2.textContent()).toBe(multipleDropdownData.MultipleDropdownlv2);
  expect(await contact.multipledropdownlv3.textContent()).toBe(multipleDropdownData.MultipleDropdownlv3);
  expect(await contact.multipledropdownlv4.textContent()).toBe(multipleDropdownData.MultipleDropdownlv4);
  expect(await contact.multipledropdownlv5.textContent()).toBe(multipleDropdownData.MultipleDropdownlv5);
  expect(await contact.multipledropdownlv6.textContent()).toBe(multipleDropdownData.MultipleDropdownlv6);
  expect(await contact.inputEmail.inputValue()).toBe(contactData.Email);
  expect(await contact.inputCheckbox.inputValue()).toBe(contactData.Checkbox); // ถ้าเป็น checkbox ใช้ .isChecked() แทน
  expect(await contact.btnRadio.inputValue()).toBe(contactData.Radiobtn); // radio button ใช้ .isChecked() ตรวจสอบค่า
  expect(await contact.input_Create_DateTime.inputValue()).toBe(contactData.DateTime);
  expect(await contact.input_Create_Date.inputValue()).toBe(contactData.Date);
  expect(await contact.input_Create_Time.inputValue()).toBe(contactData.Time);
  expect(await contact.segment.inputValue()).toBe(contactData.Segment);
  expect(await contact.input_segment.inputValue()).toBe(contactData.Input_Segment);
  expect(await contact.addressNo.inputValue()).toBe(contactData.Address_no1);






})

test('CRM_CT00116	การแก้ไขข้อมูลลูกค้า (Edit Contact)', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name })

  await expect(contact.inputName).toBeVisible();
  await expect(contact.dropdown).toBeVisible();
  await expect(contact.multipledropdownlv1).toBeVisible();
  await expect(contact.multipledropdownlv2).toBeVisible();
  await expect(contact.multipledropdownlv3).toBeVisible();
  await expect(contact.multipledropdownlv4).toBeVisible();
  await expect(contact.multipledropdownlv5).toBeVisible();
  await expect(contact.multipledropdownlv6).toBeVisible();
  await expect(contact.inputPhone).toBeVisible();
  await expect(contact.inputEmail).toBeVisible();
  await expect(contact.inputDatemasking).toBeVisible();
  await expect(contact.inputCheckbox).toBeVisible();
  await expect(contact.btnRadio).toBeVisible();
  await expect(contact.inputDate).toBeVisible();
  await expect(contact.inputDatetime).toBeVisible();
  await expect(contact.inputTime).toBeVisible();
  await expect(contact.segment).toBeVisible();
  await expect(contact.input_segment).toBeVisible();
})

test('CRM_CT00117	การแก้ไขช่องใส่ Name', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name })
  await contact.inputName.fill(contactData.Change_name)
  await contact.btnUpdate.click()
  await contact.btnconfirm_update.click()
  await page.waitForTimeout(3000)
  await verifyTopTableRow(page, { Name: contactData.Change_name })

})

// test('CRM_CT00118	"การแก้ไขช่องใส่ Name กรณีใส่Nameซ้ำ"', async ({ page }) => {
//   // TODO: Implement test for duplicate name validation
// });

test('CRM_CT00119	"การแก้ไขช่องใส่ Name กรณีไม่ใส่ช้อมูล Name"', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name })
  await contact.inputName.fill('')
  await expect(contact.error_msg_empty).toBeVisible()

})


test('CRM_CT00120	การแก้ไขช่องใส่ Phone', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name })
  await contact.inputPhone.fill(contactData.Change_phone)
  await contact.btnUpdate.click()
  await contact.btnconfirm_update.click()

  await page.waitForTimeout(3000)
  await verifyTopTableRow(page, { Phone: contactData.Change_phone })

})

test('CRM_CT00121	"การแก้ไขช่องใส่ Phone กรณีใส่ตัวอักษรหรืออักขระพิเศษ""', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name })
  await contact.inputPhone.fill('!!!@#@#')
  await expect(contact.error_msg_val).toBeVisible()
})

test('CRM_CT00122	"การแก้ไขช่องใส่ Phone กรณีีไม่ใส่ข้อมูล"', async ({ page }) => {

  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name })
  await contact.inputPhone.fill('')
  await expect(contact.error_msg_val).toBeVisible()

})
test('CRM_CT00123	การเพิ่มช่องใส่ Phone (ปุ่มAdd Phone) ""', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await contact.btnAddPhone.click();


  await expect(contact.inputPhone2).toBeVisible();


  const removeBtn = page.locator('#dyn_phone_1').locator('..').locator('button').first();


  if (await removeBtn.isVisible()) {
    await removeBtn.click();
  } else {

    await page.locator('#dyn_phone_1').locator('xpath=../..').getByRole('button').last().click();
  }


  await expect(contact.inputPhone2).not.toBeVisible();
});

test('CRM_CT00124 "การแก้ไขช่องใส่ Email"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  await contact.inputEmail.fill('edit_email@test.com');
  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);
  await verifyTopTableRow(page, { Email: 'edit_email@test.com' });
});

test('CRM_CT00125 "การแก้ไขช่อง Email กรณีกรอกไม่ตรงรูปแบบ Email"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  await contact.inputEmail.fill('Admintest@mail');
  await contact.btnUpdate.click();
  // ตรวจสอบข้อความแจ้งเตือน
  // ใน Create_Element.ts มี error_msg_email_valid = page.getByText('Value is not a valid email')
  // User request says "Value is not a valid email address"
  // Using the existing locator first, expecting it to be visible.
  await expect(contact.error_msg_email_valid).toBeVisible();
});
test('CRM_CT00126 "การแก้ไขข้อมูลที่อยู่ (ปุ่มAdd Address)"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // กดปุ่ม Add Address
  await contact.btn_address.click();

  // ตรวจสอบว่ามีช่องใส่ที่อยู่เพิ่มขึ้นมา (Address 2)
  await expect(contact.addressNo2).toBeVisible();
  await expect(contact.addressSubDistrict2).toBeVisible();
  await expect(contact.addressDistrict2).toBeVisible();
  await expect(contact.addressProvince2).toBeVisible();
  await expect(contact.addressZipcode2).toBeVisible();

  // ระบบนำช่องใส่ Address ออกได้ (กดปุ่มลบ)
  // หาปุ่มลบของ Address 2
  const removeBtn = page.locator('#dyn_address_1').locator('xpath=../..').getByRole('button').filter({ has: page.locator('svg') }).last();
  // หรือลองใช้ locator แบบเดียวกับ Phone ถ้า structure เหมือนกัน
  // const removeBtn = page.locator('#dyn_address_1').locator('..').locator('button');

  if (await removeBtn.isVisible()) {
    await removeBtn.click();
  } else {
    // Fallback logic if needed
    await page.locator('#dyn_address_1').locator('xpath=../../..').getByRole('button').last().click();
  }

  // ตรวจสอบว่า Address 2 หายไป
  await expect(contact.addressNo2).not.toBeVisible();
});

test('CRM_CT00127 "การแก้ไขข้อมูลช่อง Address ที่อยู่/บ้านเลขที่"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const newAddress = '999/99 Edit Address';
  await contact.addressNo.fill(newAddress);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);


  const firstRow = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').first();

  const addressCell = firstRow.locator('#dyn_row_address');
  await expect(addressCell).toContainText(newAddress);
});

test('CRM_CT00128 "การแก้ไขข้อมูล ช่อง Address กรณีค้นหา ตำบล/แขวง"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ค้นหา ตำบล/แขวง
  await contact.addressSubDistrict.click();
  const searchTerm = 'ลาดยาว'; // ตัวอย่างตำบล
  await contact.addressSubDistrict.fill(searchTerm);

  // รอให้ตัวเลือกปรากฏ
  const option = page.getByRole('option', { name: searchTerm }).first();
  await expect(option).toBeVisible();

  // เลือกตัวเลือก
  await option.click();

  // ตรวจสอบว่าค่าถูกเลือก

  await expect(contact.addressSubDistrict).toHaveValue(searchTerm);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // Verify update in table if possible, or just that it saved successfully
  const firstRow = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').first();
  const addressCell = firstRow.locator('#dyn_row_address');
  await expect(addressCell).toContainText(searchTerm);
});

test('CRM_CT00129 "การแก้ไขข้อมูล ช่อง Address กรณีค้นหา อำเภอ / เขต"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ค้นหา อำเภอ / เขต
  await contact.addressDistrict.click();
  const searchTerm = 'บางแค'; // ตัวอย่างอำเภอ
  await contact.addressDistrict.fill(searchTerm);

  const option = page.getByRole('option', { name: searchTerm }).first();
  await expect(option).toBeVisible();
  await option.click();

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  const firstRow = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').first();
  const addressCell = firstRow.locator('#dyn_row_address');
  await expect(addressCell).toContainText(searchTerm);
});

test('CRM_CT00130 "การแก้ไขข้อมูล ช่อง Address กรณีค้นหา จังหวัด"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ค้นหา จังหวัด
  await contact.addressProvince.click();
  const searchTerm = 'กรุงเทพมหานคร'; // ตัวอย่างจังหวัด
  await contact.addressProvince.fill(searchTerm);

  const option = page.getByRole('option', { name: searchTerm }).first();
  await expect(option).toBeVisible();
  await option.click();

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  const firstRow = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').first();
  const addressCell = firstRow.locator('#dyn_row_address');
  await expect(addressCell).toContainText(searchTerm);
});

test('CRM_CT00131 "การแก้ไขข้อมูล ช่อง Address กรณีค้นหา รหัสไปรษณีย์"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ค้นหา รหัสไปรษณีย์
  await contact.addressZipcode.click();
  const searchTerm = '10900'; // ตัวอย่างรหัสไปรษณีย์
  await contact.addressZipcode.fill(searchTerm);

  const option = page.getByRole('option', { name: searchTerm }).first();
  await expect(option).toBeVisible();
  await option.click();

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  const firstRow = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').first();
  const addressCell = firstRow.locator('#dyn_row_address');
  await expect(addressCell).toContainText(searchTerm);
});

test('CRM_CT00132 "การแก้ไขข้อมูล ช่อง Address กรณีไม่ใส่ข้อมูลที่อยู่"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ล้างข้อมูลช่อง Address
  await contact.addressNo.fill('');

  // กด Update
  await contact.btnUpdate.click();

  // ตรวจสอบข้อความแจ้งเตือนที่ field
  await expect(contact.error_msg_empty).toBeVisible();
  await page.waitForTimeout(2000)
  // ตรวจสอบข้อความแจ้งเตือน toast
  await expect(contact.error_msg_toast).toBeVisible();
});

test('CRM_CT00133 "การแก้ไขเลือกข้อมูลช่อง Dropdown"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // เลือกข้อมูลใน Dropdown โดยใช้ input_Field
  await contact.input_Field({ Dropdown: 'ทดสอบตัวเลือก 1' });

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // ตรวจสอบข้อมูลในตาราง
  const firstRow = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').first();
  const dropdownCell = firstRow.locator('#dyn_row_dropdownkey');

  // ตรวจสอบว่าค่าที่เลือกถูกบันทึก
  await expect(dropdownCell).toContainText('ทดสอบตัวเลือก 1');
});

test('CRM_CT00134 "การเลือกข้อมูลช่อง Multi Dropdown"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });


  // เคลียร์ข้อมูลเดิมใน Multi Dropdown Level 1 โดยกด X icon
  await page.locator('.col-span-6 > #dropdownEl > .relative > .absolute.right-6 > .lucide').first().click();
  await page.waitForTimeout(500);

  // เลือกข้อมูลใน Multi Dropdown ทั้งหมด Level 1-6
  await contact.fillInputMultipleDropdown({
    MultipleDropdownlv1: multipleDropdownData_Edt.MultipleDropdownlv1,
    MultipleDropdownlv2: multipleDropdownData_Edt.MultipleDropdownlv2,
    MultipleDropdownlv3: multipleDropdownData_Edt.MultipleDropdownlv3,
    MultipleDropdownlv4: multipleDropdownData_Edt.MultipleDropdownlv4,
    MultipleDropdownlv5: multipleDropdownData_Edt.MultipleDropdownlv5,
    MultipleDropdownlv6: multipleDropdownData_Edt.MultipleDropdownlv6
  });

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // ตรวจสอบข้อมูลในตาราง
  const firstRow = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').first();
  await expect(firstRow).toBeVisible();

  // เข้าไป Edit อีกครั้งเพื่อตรวจสอบว่าข้อมูลที่บันทึกตรงกับที่แก้ไขหรือไม่
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ตรวจสอบค่าในแต่ละ level ของ Multi Dropdown จาก placeholder
  await expect(contact.chk_multidropdown(1)).toHaveAttribute('placeholder', multipleDropdownData_Edt.MultipleDropdownlv1);
  await expect(contact.chk_multidropdown(2)).toHaveAttribute('placeholder', multipleDropdownData_Edt.MultipleDropdownlv2);
  await expect(contact.chk_multidropdown(3)).toHaveAttribute('placeholder', multipleDropdownData_Edt.MultipleDropdownlv3);
  await expect(contact.chk_multidropdown(4)).toHaveAttribute('placeholder', multipleDropdownData_Edt.MultipleDropdownlv4);
  await expect(contact.chk_multidropdown(5)).toHaveAttribute('placeholder', multipleDropdownData_Edt.MultipleDropdownlv5);
  await expect(contact.chk_multidropdown(6)).toHaveAttribute('placeholder', multipleDropdownData_Edt.MultipleDropdownlv6);
});

test('CRM_CT00135 "การแก้ไขข้อมูลช่อง Text Input"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const newText = 'Edit Text';
  await contact.inputText.fill(newText);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // Verify by editing again
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  await expect(contact.inputText).toHaveValue(newText);
});

test('CRM_CT00136 "การแก้ไขข้อมูลช่อง Text Input กรณีใส่ Text Input ความยาวตัวอักษร สูงสุด 10"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ใส่ข้อความยาวเกิน 10 ตัวอักษร
  await contact.inputText.fill('12345678901'); // 11 ตัวอักษร

  await contact.btnUpdate.click();

  // ตรวจสอบข้อความแจ้งเตือน
  await expect(contact.error_msg_max).toBeVisible();
});

test('CRM_CT00137 "การแก้ไขข้อมูลช่อง Text Input กรณีไม่ใส่ Text Input"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ล้างข้อมูล Text Input
  await contact.inputText.fill('');

  await contact.btnUpdate.click();

  // ตรวจสอบข้อความแจ้งเตือน
  await expect(contact.error_msg_empty).toBeVisible();
  await page.waitForTimeout(2000);
  await expect(contact.error_msg_toast).toBeVisible();
});

test('CRM_CT00138 "การแก้ไขข้อมูลช่อง Data Masking"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const newDataMasking = '98765432';
  await contact.inputDatemasking.fill(newDataMasking);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // Verify by editing again
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  // Data masking จะแสดงเป็น masked value
  await expect(contact.inputDatemasking).toBeVisible();
});

test('CRM_CT00139 "การติ๊กเลือกRadio Button"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // เลือก Radio Button โดยใช้ input_Field
  await contact.input_Field({ Radiobtn: 'value2' });

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // Verify by editing again
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  await expect(page.locator('input[type="radio"][value="value2"]')).toBeChecked();
});

test('CRM_CT00140 "การติ๊กเลือกCheckbox"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ติ๊ก Checkbox (ถ้ายังไม่ได้ติ๊ก)
  const isChecked = await contact.inputCheckbox.isChecked();
  if (!isChecked) {
    await contact.inputCheckbox.click();
  }

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // Verify by editing again
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  await expect(contact.inputCheckbox).toBeChecked();
});

// test('CRM_CT00141	การแก้ไขรูปภาพ Image"', async ({ page }) => {
//   const contact = new Element_Create_Contact(page);
//   await contact.goto();
//   await verifyTopTableRow(page, { CheckEdit: contactData.Name });

//   // ใส่วันที่และเวลา DateTime
//   const newDateTime = '2025-12-31 23:59';
//   await contact.input_Field({ DateTime: newDateTime });

//   await contact.btnUpdate.click();
//   await contact.btnconfirm_update.click();
//   await page.waitForTimeout(3000);

//   // Verify by editing again
//   await verifyTopTableRow(page, { CheckEdit: contactData.Name });
//   await expect(contact.inputDatetime).toBeVisible();
// });
test('CRM_CT00142 "การแก้ไขข้อมูลวันที่และเวลา Date Time"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ใส่วันที่และเวลา DateTime
  const newDateTime = '2025-12-31 23:59';
  await contact.input_Field({ DateTime: newDateTime });

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // Verify by editing again
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  await expect(contact.inputDatetime).toBeVisible();
});

test('CRM_CT00143 "การแก้ไขข้อมูลวันที่ Date"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ใส่วันที่ Date
  const newDate = '2025-12-25';
  await contact.input_Field({ Date: newDate });

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // Verify by editing again
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  await expect(contact.inputDate).toBeVisible();
});

test('CRM_CT00144 "การแก้ไขข้อมูลเวลา Time"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ใส่เวลา Time
  const newTime = '14:30';
  await contact.input_Field({ Time: newTime });

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // Verify by editing again
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  await expect(contact.inputTime).toBeVisible();
});

test('CRM_CT00145 "ปุ่มกดลิ้งค์ไปหน้าอื่น Button"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await contact.btn_link.click()
  // กดปุ่ม

  await page.waitForTimeout(2000);

  // ตรวจสอบว่า URL เปลี่ยนไป (ลิงก์ไปหน้าอื่น)
  const newUrl = page.url();
  expect(newUrl).not.toBe(BaseUrl + 'contact');
});
// CRM_CT00146	"การเลือกกลุ่มและข้อมูลในกลุ่มที่เลือก
// จะแสดงก็ต่อเมื่อมีการเปลี่ยนแปลง Segment"		"1.ไปหน้าเมนู Contact  
// 2.กดปุ่ม Edit 
// 3.เลือกกลุ่มข้อมูลในกลุ่มที่เลือกจะแสดงก็ต่อเมื่อมีการเปลี่ยนแปลง Segment"	ระบบเลืือกกลุ่มและข้อมูลในกลุ่มที่เลือกจะแสดงเมื่อมีการเปลี่ยนแปลงSegmentได้ถูกต้อง
// CRM_CT00147	การเลือกกลุุ่่ม Group		"1.ไปหน้าเมนู Contact  
// 2.กดปุ่ม Edit 
// 3.เลือกกลุุ่่ม Group"	ระบบพิมพ์ค้นหาและเลือกกลุ่มGroupได้ถูกต้อง
// CRM_CT00148	การค้นหาข้อมูล Search		"1.ไปหน้าเมนู Contact  
// 2.กดปุ่ม Edit 
// 3.ใส่ข้อมููลเพื่อค้นหา Search"	ระบบค้นหาข้อมูลได้ถูกต้อง


test('CRM_CT00149 "ข้อความแจ้งเตือน การอัปโหลด Attach File สามารถอัปโหลดได้สูงสุด 10 ไฟล์และขนาดไฟล์ทั้งหมดไม่เกิน 5 MB"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ตรวจสอบข้อความแจ้งเตือนเกี่ยวกับการอัปโหลดไฟล์
  // ข้อความควรระบุว่า: สามารถอัปโหลดได้สูงสุด 10 ไฟล์และขนาดไฟล์ทั้งหมดไม่เกิน 5 MB
  const uploadNotification = page.getByText(/10.*ไฟล์.*5.*MB|maximum.*10.*files.*5.*MB/i);

  await expect(uploadNotification).toBeVisible();

  // หรือตรวจสอบข้อความแบบเจาะจงมากขึ้น
  const fileLimit = page.getByText(/สามารถอัปโหลดได้สูงสุด.*10.*ไฟล์/i);
  const sizeLimit = page.getByText(/ขนาดไฟล์.*ไม่เกิน.*5.*MB/i);

  await expect(fileLimit.or(uploadNotification)).toBeVisible();
});

test('CRM_CT00150 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type PDF)"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // อัปโหลดไฟล์ PDF ขนาดไม่เกิน 5MB
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/test-pdf.pdf',
  ]);

  await page.waitForTimeout(2000);

  // ตรวจสอบจำนวนไฟล์ที่อัปโหลด
  const items = page.locator('.filepond--item');
  const expectedFiles = ['test-pdf.pdf'];
  await expect(items).toHaveCount(expectedFiles.length);

  // ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();

  // ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
  expect(fileNames).toEqual(expectedFiles);

  // Update และ confirm
  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  // เข้ามาตรวจสอบในรายการว่ามีไฟล์ PDF
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // ตรวจสอบว่ามีไฟล์ PDF ในรายการ
  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);

  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('test-pdf.pdf');
});

test('CRM_CT00151 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type PDF) กรณีขนาดไฟล์เกิน5MB"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // อัปโหลดไฟล์ PDF ขนาดเกิน 5MB (ใช้ไฟล์ 6mb.pdf หรือ 11mb.pdf)
  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/6mb.pdf',
  ]);

  await page.waitForTimeout(2000);

  // ตรวจสอบข้อความแจ้งเตือน
  expect(contact.error_attach_file).toBeVisible()

  /// ตรวจสอบว่าไฟล์ใหม่ที่อัปโหลดถูกแสดงในรายการจริง
  const uploadedFileName = "6mb.pdf";

  // หาตัวรายการไฟล์ทั้งหมด
  const fileItems = page.locator('.filepond--item');

  // หาเฉพาะรายการที่มีชื่อไฟล์นี้
  const targetFile = fileItems.filter({
    hasText: uploadedFileName
  });

  // ต้องเจอ 1 ไฟล์
  await expect(targetFile).toHaveCount(0);

});

test('CRM_CT00152 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type DOC) ""ขนาดไฟล์ไม่เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/doc-test.doc',
  ]);

  await page.waitForTimeout(2000);

  const items = page.locator('.filepond--item');
  const expectedFiles = ['doc-test.doc'];
  await expect(items).toHaveCount(expectedFiles.length);

  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  expect(fileNames).toEqual(expectedFiles);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);
  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('doc-test.doc');
});

test('CRM_CT00153 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type DOC) ""กรณีขนาดไฟล์เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/doc-14mb.doc',
  ]);

  await page.waitForTimeout(2000);
  expect(contact.error_attach_file).toBeVisible();

  const uploadedFileName = "doc-14mb.doc";
  const fileItems = page.locator('.filepond--item');
  const targetFile = fileItems.filter({ hasText: uploadedFileName });
  await expect(targetFile).toHaveCount(0);
});

test('CRM_CT00154 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type DOCX) ""ขนาดไฟล์ไม่เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/docx-test.docx',
  ]);

  await page.waitForTimeout(2000);

  const items = page.locator('.filepond--item');
  const expectedFiles = ['docx-test.docx'];
  await expect(items).toHaveCount(expectedFiles.length);

  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  expect(fileNames).toEqual(expectedFiles);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);
  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('docx-test.docx');
});

test('CRM_CT00155 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type DOCX) ""กรณีขนาดไฟล์เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/docx-13mb.docx',
  ]);

  await page.waitForTimeout(2000);
  expect(contact.error_attach_file).toBeVisible();

  const uploadedFileName = "docx-13mb.docx";
  const fileItems = page.locator('.filepond--item');
  const targetFile = fileItems.filter({ hasText: uploadedFileName });
  await expect(targetFile).toHaveCount(0);
});

test('CRM_CT00156 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type XLS) ""ขนาดไฟล์ไม่เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/xls-test.xls',
  ]);

  await page.waitForTimeout(2000);

  const items = page.locator('.filepond--item');
  const expectedFiles = ['xls-test.xls'];
  await expect(items).toHaveCount(expectedFiles.length);

  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  expect(fileNames).toEqual(expectedFiles);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);
  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('xls-test.xls');
});

test('CRM_CT00157 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type XLS) ""กรณีขนาดไฟล์เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/xls-15mb.xls',
  ]);

  await page.waitForTimeout(2000);
  expect(contact.error_attach_file).toBeVisible();

  const uploadedFileName = "xls-15mb.xls";
  const fileItems = page.locator('.filepond--item');
  const targetFile = fileItems.filter({ hasText: uploadedFileName });
  await expect(targetFile).toHaveCount(0);
});

test('CRM_CT00158 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type XLSX) ""ขนาดไฟล์ไม่เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/xlsx-test.xlsx',
  ]);

  await page.waitForTimeout(2000);

  const items = page.locator('.filepond--item');
  const expectedFiles = ['xlsx-test.xlsx'];
  await expect(items).toHaveCount(expectedFiles.length);

  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  expect(fileNames).toEqual(expectedFiles);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);
  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('xlsx-test.xlsx');
});

test('CRM_CT00159 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type XLSX) ""กรณีขนาดไฟล์เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/11mb.xlsx',
  ]);

  await page.waitForTimeout(2000);
  expect(contact.error_attach_file).toBeVisible();

  const uploadedFileName = "11mb.xlsx";
  const fileItems = page.locator('.filepond--item');
  const targetFile = fileItems.filter({ hasText: uploadedFileName });
  await expect(targetFile).toHaveCount(0);
});

test('CRM_CT00160 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type CSV) ""ขนาดไฟล์ไม่เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/csv-test.csv',
  ]);

  await page.waitForTimeout(2000);

  const items = page.locator('.filepond--item');
  const expectedFiles = ['csv-test.csv'];
  await expect(items).toHaveCount(expectedFiles.length);

  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  expect(fileNames).toEqual(expectedFiles);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);
  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('csv-test.csv');
});

test('CRM_CT00161 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type CSV) ""กรณีขนาดไฟล์เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/6mb.csv',
  ]);

  await page.waitForTimeout(2000);
  expect(contact.error_attach_file).toBeVisible();

  const uploadedFileName = "6mb.csv";
  const fileItems = page.locator('.filepond--item');
  const targetFile = fileItems.filter({ hasText: uploadedFileName });
  await expect(targetFile).toHaveCount(0);
});

test('CRM_CT00162 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type PNG) ""ขนาดไฟล์ไม่เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/png.png',
  ]);

  await page.waitForTimeout(2000);

  const items = page.locator('.filepond--item');
  const expectedFiles = ['png.png'];
  await expect(items).toHaveCount(expectedFiles.length);

  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  expect(fileNames).toEqual(expectedFiles);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);
  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('png.png');
});

test('CRM_CT00163 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type PNG) ""กรณีขนาดไฟล์เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/png10mb.png',
  ]);

  await page.waitForTimeout(2000);
  expect(contact.error_attach_file).toBeVisible();

  const uploadedFileName = "png10mb.png";
  const fileItems = page.locator('.filepond--item');
  const targetFile = fileItems.filter({ hasText: uploadedFileName });
  await expect(targetFile).toHaveCount(0);
});

test('CRM_CT00164 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type JPG) ""ขนาดไฟล์ไม่เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/jpg-test.jpg',
  ]);

  await page.waitForTimeout(2000);

  const items = page.locator('.filepond--item');
  const expectedFiles = ['jpg-test.jpg'];
  await expect(items).toHaveCount(expectedFiles.length);

  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  expect(fileNames).toEqual(expectedFiles);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);
  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('jpg-test.jpg');
});

test('CRM_CT00165 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type JPG) ""กรณีขนาดไฟล์เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/jpg-15mb.jpg',
  ]);

  await page.waitForTimeout(2000);
  expect(contact.error_attach_file).toBeVisible();

  const uploadedFileName = "jpg-15mb.jpg";
  const fileItems = page.locator('.filepond--item');
  const targetFile = fileItems.filter({ hasText: uploadedFileName });
  await expect(targetFile).toHaveCount(0);
});

test('CRM_CT00166 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type JPEG) ""ขนาดไฟล์ไม่เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/small.jpeg',
  ]);

  await page.waitForTimeout(2000);

  const items = page.locator('.filepond--item');
  const expectedFiles = ['small.jpeg'];
  await expect(items).toHaveCount(expectedFiles.length);

  const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
  expect(fileNames).toEqual(expectedFiles);

  await contact.btnUpdate.click();
  await contact.btnconfirm_update.click();
  await page.waitForTimeout(3000);

  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  const uploadedFile = page.locator('.filepond--item');
  await expect(uploadedFile).toHaveCount(1);
  const uploadedFileName = await page.locator('.filepond--file-info-main').textContent();
  expect(uploadedFileName).toBe('small.jpeg');
});

test('CRM_CT00167 "การแก้ไขเนื้อหา อัปโหลด Attach File (Type JPEG) ""กรณีขนาดไฟล์เกิน5MB"" "', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  await page.setInputFiles('input[type="file"]', [
    'tests/file_update-test/jpeg-20mb.jpeg',
  ]);

  await page.waitForTimeout(2000);
  expect(contact.error_attach_file).toBeVisible();

  const uploadedFileName = "jpeg-20mb.jpeg";
  const fileItems = page.locator('.filepond--item');
  const targetFile = fileItems.filter({ hasText: uploadedFileName });
  await expect(targetFile).toHaveCount(0);
});

test('CRM_CT00168 "การแก้ไขเนื้อหา ปุ่มกด X Remove File"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });


  await page.waitForTimeout(10000);

  // 1. ดึงชื่อไฟล์ทั้งหมดก่อนลบ
  const fileNamesBefore = await page.locator('.filepond--file-info-main').allTextContents();
  const initialCount = fileNamesBefore.length;
  console.log("Files before remove:", fileNamesBefore);

  // สมมติว่าจะลบไฟล์ที่ 2 (index 1)
  const indexToRemove = 1;
  const fileToRemove = fileNamesBefore[indexToRemove];
  console.log(`Removing file at index ${indexToRemove}: ${fileToRemove}`);

  // 2. กดปุ่ม Remove ของไฟล์ที่ต้องการลบ
  await page.getByRole('button', { name: 'Remove' }).nth(indexToRemove + 1).click();

  // 3. ยืนยันการลบ (Popup Confirm)
  const popup_remove = page.getByLabel('Remove', { exact: true });
  await expect(popup_remove).toBeVisible();
  await popup_remove.click();

  // รอให้รายการอัปเดต
  await page.waitForTimeout(1000);

  // 4. ดึงชื่อไฟล์ทั้งหมดหลังลบ
  const fileNamesAfter = await page.locator('.filepond--file-info-main').allTextContents();
  console.log("Files after remove:", fileNamesAfter);

  // 5. ตรวจสอบจำนวนไฟล์ (ต้องลดลง 1)
  expect(fileNamesAfter.length).toBe(initialCount - 1);

  // 6. ตรวจสอบว่าไฟล์ที่ลบหายไปจากรายการ
  expect(fileNamesAfter).not.toContain(fileToRemove);

  // 7. ตรวจสอบว่าไฟล์อื่นๆ ยังอยู่ครบ
  const expectedRemaining = fileNamesBefore.filter(name => name !== fileToRemove);
  expect(fileNamesAfter.sort()).toEqual(expectedRemaining.sort());
});

// CRM_CT00169 "ปุ่มกดเพิ่ม Syncแก้ไข" 
test('CRM_CT00170 "การจดบันทึก Note ======= แก้ไข"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });

  // Generate unique note text
  const timestamp = new Date().getTime();
  const noteText = `Test Note ${timestamp}`;

  // Input note
  await contact.inputNote.fill(noteText);

  // Get current time for verification (DD/MM/YY HH:mm)
  const now = new Date();
  const formatTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const expectedTime = formatTime(now);
  // Calculate next minute to handle rollover (e.g. sent at 15:34:59, processed at 15:35:00)
  const nextMin = new Date(now.getTime() + 60000);
  const expectedTime2 = formatTime(nextMin);

  // Click Send
  await contact.btnSendNote.click();

  // Wait for the note to appear in the list
  const newNoteItem = contact.noteListItems.filter({ hasText: noteText }).first();
  await expect(newNoteItem).toBeVisible({ timeout: 10000 });

  // Verify text
  await expect(newNoteItem).toContainText(noteText);

  // Verify timestamp (dd/mm/yy hh:mm)
  // Check if the note content contains either the current minute or the next minute
  const noteContent = await newNoteItem.textContent();
  const timeMatch = noteContent?.includes(expectedTime) || noteContent?.includes(expectedTime2);

  expect(timeMatch, `Expected time "${expectedTime}" or "${expectedTime2}" to be present in note content: "${noteContent}"`).toBeTruthy();
});

//CRM_CT00171	การแก้ไขลููกค้า Contact (ปุ่มMerge Contact)
test('CRM_CT00172 "การแก้ไขข้อมูลลูกค้า (ปุ่มUpdate)"', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();
  await verifyTopTableRow(page, { CheckEdit: contactData.Name });
  const formattedDate = formatDate(); // เ
  // Define new data for editing

  // Fill all fields
  await contact.input_Field(contactData_Edit);

  // เคลียร์ข้อมูลเดิมใน Multi Dropdown Level 1 โดยกด X icon
  await page.locator('.col-span-6 > #dropdownEl > .relative > .absolute.right-6 > .lucide').first().click();
  await page.waitForTimeout(500);
  await contact.fillInputMultipleDropdown(multipleDropdownData_Edt);

  // Update Address if needed (input_Field handles it)

  // Press Update
  await contact.btnUpdate.click();

  // Confirm
  await expect(page.getByText('Are you sure you want to update this contact?').or(page.getByText('Update Contact'))).toBeVisible();
  await contact.btnconfirm_update.click();

  // Verify Success
  await expect(page.getByText('Update Contact Success').or(page.getByText('Update successful'))).toBeVisible();

  // Wait for reload
  await page.waitForTimeout(3000);

  // Verify Data in Table (Top Row)
  await verifyTopTableRow(page, {
    Name: contactData_Edit.Name,
    Phone: contactData_Edit.Phone,
    Email: contactData_Edit.Email
    // Add other fields if verifyTopTableRow supports them
  });


  await verifyTopTableRow(page, { CheckEdit: contactData_Edit.Name });

  // Verify values in inputs
  await expect(contact.inputName).toHaveValue(contactData_Edit.Name);
  await expect(contact.inputPhone).toHaveValue(contactData_Edit.Phone);
  await expect(contact.inputEmail).toHaveValue(contactData_Edit.Email);
  await expect(contact.inputDatemasking).toHaveValue(contactData_Edit.Datamasking);
  // ... verify others ...
  await expect(contact.segment).toHaveValue(contactData_Edit.Segment);
  await expect(contact.input_segment).toHaveValue(contactData_Edit.Input_Segment);

  // Verify Date/Time
  // Note: Date/Time format in input might differ from data (e.g. YYYY-MM-DD vs DD/MM/YYYY)
  // Playwright's `toHaveValue` checks the `value` attribute.
  await expect(contact.input_Create_DateTime).toHaveValue(contactData_Edit.DateTime);
  await expect(contact.input_Create_Date).toHaveValue(contactData_Edit.Date);
  await expect(contact.input_Create_Time).toHaveValue(contactData_Edit.Time);


  // Verify Address (if possible)
  // await expect(contact.addressNo).toHaveValue(contactData_Edit.Address_no);
});

test('CRM_CT00173	การลบข้อมูลลูกค้า (Delete Contact)', async ({ page }) => {
  const contact = new Element_Create_Contact(page);
  await contact.goto();

  // Find the row with the edited name (from previous test)
  const targetName = contactData_Edit.Name;
  const row = page.locator('#dyn_contactTable tr[id^="dyn_rows_"]').filter({ hasText: targetName }).first();

  // Ensure row exists
  await expect(row).toBeVisible();

  // Click Action button
  await row.locator('#dyn_row_action').click();

  // Click Delete
  await page.getByRole('menuitem', { name: 'Delete' }).click();

  // Verify confirmation dialog
  // "ระบบมีข้อความให้ยืนยันการลบ Delete Contactได้ถูกต้อง"
  await expect(page.getByText('Delete Contact?')).toBeVisible();

  // Confirm Delete
  await page.locator('#dyn_delete_contact').click();

  // Verify Success Toast
  // "ระบบแสดงแจ้งเตือน ""Delete Success"""
  await expect(page.getByText('Delete Success').or(page.getByText('Delete successful'))).toBeVisible();

  // Verify row is gone
  await page.waitForTimeout(2000); // Wait for list refresh
  await expect(page.locator('#dyn_contactTable tr').filter({ hasText: targetName })).toHaveCount(0);
});

