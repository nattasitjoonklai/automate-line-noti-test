import { fa, th } from '@faker-js/faker';
import { Page, Locator, expect } from '@playwright/test';
import { selectDateTime } from './FillForm';
export class Element_Contact {
  readonly page: Page;
  //StartDate EndDate
  readonly input_startdate: Locator;
  readonly input_enddate: Locator;
  // Buttons
  readonly btnCreateContact: Locator;
  readonly btnExport: Locator;
  readonly btnImport: Locator;
  readonly btnDownloadTemplate: Locator;
  readonly btnSearch: Locator;
  readonly btnDelete: Locator;
  readonly btnclear: Locator;
  //Dropdown
  readonly dropdown: Locator;
  readonly multipledropdownlv1: Locator;
  readonly multipledropdownlv2: Locator;
  readonly multipledropdownlv3: Locator;
  readonly multipledropdownlv4: Locator;
  readonly multipledropdownlv5: Locator;
  readonly multipledropdownlv6: Locator;
  //Radio
  readonly btnRadio: Locator;
  // Inputs
  readonly inputStartDate: Locator;
  readonly inputEndDate: Locator;
  readonly inputName: Locator;
  readonly inputLastName: Locator;
  readonly inputPhone: Locator;
  readonly inputEmail: Locator;
  readonly inputText: Locator;
  readonly inputDatemasking: Locator;
  readonly inputDatetime: Locator;
  readonly inputDate: Locator;
  readonly inputTime: Locator;
  //Checkbox
  readonly inputCheckbox: Locator;
  // Address
  readonly addressNo: Locator;
  readonly addressDistrict: Locator;
  readonly addressSubDistrict: Locator;
  readonly addressProvince: Locator;
  readonly addressZipcode: Locator;
  //Segment
  readonly segmment: Locator;
  readonly inputCheckboxTest: Locator;
  readonly fill_auto: Locator;
  //Nodatacell
  readonly noDataCell: Locator;

  // Import Options
  readonly btnImport_Import: Locator;
  readonly btnImport_DownloadTemplate: Locator;

  // Action Menu Items
  readonly btnAction_View: Locator;
  readonly btnAction_Edit: Locator;
  readonly btnAction_Delete: Locator;
  constructor(page: Page) {
    this.page = page;

    //multiple dropdown
    this.multipledropdownlv1 = page.locator('#dyn_JEFOkL')
    this.multipledropdownlv2 = page.locator('#dyn_ds1WmD')
    this.multipledropdownlv3 = page.locator('#dyn_kGCQa0')
    this.multipledropdownlv4 = page.locator('#dyn_Rtp6MP')
    this.multipledropdownlv5 = page.locator('#dyn_BI5q7i')
    this.multipledropdownlv6 = page.locator('#dyn_fKpu0q')

    //Dropdown
    this.dropdown = page.locator('#dyn_dropdownkey')
    // Buttons
    this.btnCreateContact = page.getByRole('button', { name: 'Create Contact' });
    this.btnExport = page.getByRole('button', { name: 'Export' });
    this.btnImport = page.getByRole('button', { name: 'Import' });
    this.btnDownloadTemplate = page.getByRole('button', { name: 'Download Template' }); // Assuming this name, will verify or adjust if test fails
    this.btnSearch = page.getByRole('button', { name: 'Search' }).nth(2);
    this.btnDelete = page.getByRole('button', { name: 'Delete' });
    this.btnclear = page.getByRole('button', { name: 'Clear' }).and(page.locator(':not(.p-datepicker-clear-button)'));
    // Inputs
    this.inputStartDate = page.locator('#start_datetime')
    this.inputEndDate = page.locator('#end_datetime')
    this.inputName = page.locator('#dyn_name')

    // this.inputLastName = page.getByRole('textbox', { name: 'Enter your Email' });
    // this.inputCheckbox = page.getByRole('combobox', { name: 'Select checkbox' })
    this.inputPhone = page.locator('#dyn_phone')
    this.inputEmail = page.locator('#dyn_email')
    this.inputDatemasking = page.locator('#dyn_datamasking')
    this.inputCheckbox = page.locator('#dyn_chkbox')
    this.btnRadio = page.locator('#dyn_radiobtn')
    this.inputText = page.locator('#dyn_txt_input');
    this.inputDatetime = page.locator('#dyn_feu1')
    this.inputDate = page.locator('#dyn_R8i6Yo')
    this.inputTime = page.locator('#dyn_yC3zrN')
    // Address
    this.addressNo = page.locator('#dyn_address\\.address').first().or(page.getByRole('textbox', { name: 'Enter your ที่อยู่/บ้านเลขที่' })).first();
    this.addressDistrict = page.locator('#dyn_address\\.district').first().or(page.getByRole('textbox', { name: 'Enter your อำเภอ / เขต' })).first()
    this.addressSubDistrict = page.locator('#dyn_address\\.subdistrict').first().or(page.getByRole('textbox', { name: 'Enter your ตำบล/แขวง' })).first()
    this.addressProvince = page.locator('#dyn_address\\.province').first().or(page.getByRole('textbox', { name: 'Enter your จังหวัด' })).first()
    this.addressZipcode = page.locator('#dyn_address\\.zipcode').first().or(page.getByRole('textbox', { name: 'Enter your รหัสไปรษณีย์' })).first()
    //Segment
    this.segmment = page.locator('#dyn_name_segment')
    this.inputCheckboxTest = page.locator('#dyn_chk_box')
    //

    this.noDataCell = page.getByRole('cell', { name: 'No Data' })

    // Import Options (assuming they appear after clicking Import)
    this.btnImport_Import = page.getByRole('menuitem', { name: 'Import' });
    this.btnImport_DownloadTemplate = page.getByRole('menuitem', { name: 'Download Template' });

    // Action Menu Items
    this.btnAction_View = page.getByRole('menuitem', { name: 'View' });
    this.btnAction_Edit = page.getByRole('menuitem', { name: 'Edit' });
    this.btnAction_Delete = page.getByRole('menuitem', { name: 'Delete' });

  }

  // Methods
  async ensureSearchPanelOpen() {
    await ensureSearchPanelOpen(this.page);
  }

  async createContact() {
    await this.btnCreateContact.click();

    // Retry logic for flaky page load
    for (let i = 0; i < 3; i++) {
      try {
        await this.inputName.waitFor({ state: 'visible', timeout: 5000 });
        return; // Success
      } catch (e) {
        console.log(`Create page elements missing (Attempt ${i + 1}). Refreshing...`);
        await this.page.reload();
        await this.page.waitForLoadState('domcontentloaded');
      }
    }

    // Final check
    await expect(this.inputName).toBeVisible();
  }

  async search() {
    await this.btnSearch.click();
  }

  async delete() {
    await this.btnDelete.click();
  }
  async goto() {
    await this.page.goto('/contact');
  }
  async export() {
    await this.btnExport.click();
  }
  // Generic search
  async searchBy(fields: { Name?: string; Phone?: string; Email?: string, Address_no?: string, Address_district?: string, Address_subdistrict?: string, Address_province?: string, Address_zipcode?: string, Datamasking?: string, search?: boolean, Segment?: string }) {
    // ✅ ถ้า fields.search === false → ไม่ต้องกดปุ่ม search

    await this.ensureSearchPanelOpen();
    if (fields.Address_no) await this.addressNo.fill(fields.Address_no);
    if (fields.Address_district) await this.addressDistrict.fill(fields.Address_district);
    if (fields.Address_subdistrict) await this.addressSubDistrict.fill(fields.Address_subdistrict);
    if (fields.Address_province) await this.addressProvince.fill(fields.Address_province);
    if (fields.Address_zipcode) await this.addressZipcode.fill(fields.Address_zipcode);
    if (fields.Name) await this.inputName.fill(fields.Name);
    if (fields.Phone) await this.inputPhone.fill(fields.Phone);
    if (fields.Email) await this.inputEmail.fill(fields.Email);
    if (fields.Datamasking) await this.inputDatemasking.fill(fields.Datamasking);
    if (fields.Segment) await this.segmment.fill(fields.Segment);
    // 🔍 ถ้าต้อง search ปกติ ให้กดรอบสอง
    if (fields.search !== false) {
      await this.page.waitForTimeout(3000);
      await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
      await this.page.waitForTimeout(2000);
    }

  }


  async searchBy_Dropdown(fields: { Dropodown?: string, search?: boolean, btn_search?: boolean }) {
    if (fields.btn_search !== false) {
      await this.ensureSearchPanelOpen();
    }
    if (fields.search !== false) {
      await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
    } else {

    }
    if (fields.Dropodown)
      await this.cleardate();
    await this.dropdown.click();
    await this.page.getByRole('option', { name: fields.Dropodown }).click();
    // กด search รอบสอง
    if (fields.search !== false) {
      await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
    } else {

    }
    await this.page.waitForTimeout(3000)
  }

  async searchBy_Checkbox(fields: { Checkbox?: string, search?: boolean, btn_search?: boolean }) {
    if (fields.btn_search !== false) {
      await this.ensureSearchPanelOpen();
    }

    if (fields.Checkbox)
      await this.cleardate();
    await this.inputCheckbox.click();
    await this.page.getByRole('option', { name: fields.Checkbox }).click();
    if (fields.search !== false) {
      await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
    }

    await this.page.waitForTimeout(3000)
  }

  async searchBy_Radiobtn(fields: { Radiobtn?: string, search?: boolean, btn_search?: boolean }) {

    if (fields.btn_search !== false) {
      await this.ensureSearchPanelOpen();
    }

    if (fields.Radiobtn)
      await this.cleardate();
    await this.btnRadio.click();
    await this.page.getByRole('option', { name: fields.Radiobtn }).click();
    if (fields.search !== false) {
      await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
    }
    // กด search รอบสอง

    await this.page.waitForTimeout(3000)
  }

  async searchbyDate(fields: { Datetime?: string, Date?: string, Time?: string, search?: boolean }) {
    await this.ensureSearchPanelOpen();
    if (fields.Date)
      await this.cleardate();
    await this.btnRadio.click();
    await this.page.getByRole('option', { name: fields.Datetime }).click();
    if (fields.Datetime)
      await this.inputDatetime.fill(fields.Datetime);
    if (fields.Date)
      await this.inputDate.fill(fields.Date);
    if (fields.Time)
      await this.inputTime.fill(fields.Time);
    if (fields.search !== false) {
      await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
    }
    // กด search รอบสอง

    await this.page.waitForTimeout(3000)
  }
  async searchByMultipleDropdown(fields: {
    search?: boolean;
    btn_search?: boolean;
    MultipleDropdownlv1?: string;
    MultipleDropdownlv2?: string;
    MultipleDropdownlv3?: string;
    MultipleDropdownlv4?: string;
    MultipleDropdownlv5?: string;
    MultipleDropdownlv6?: string;
  }) {
    // กด search รอบแรกถ้ามี
    if (fields.btn_search !== false) {
      await this.ensureSearchPanelOpen();
      await this.cleardate();
    }

    const dropdownLevels: (keyof typeof fields)[] = [
      "MultipleDropdownlv1",
      "MultipleDropdownlv2",
      "MultipleDropdownlv3",
      "MultipleDropdownlv4",
      "MultipleDropdownlv5",
      "MultipleDropdownlv6",
    ];

    for (let i = 0; i < dropdownLevels.length; i++) {
      const key = dropdownLevels[i];
      const value = fields[key];

      if (!value) continue;

      // ถ้า level ก่อนหน้าไม่มีค่า ให้ข้าม
      if (i > 0 && !fields[dropdownLevels[i - 1]]) {
        console.warn(`Cannot select ${key} because ${dropdownLevels[i - 1]} is not set`);
        continue;
      }

      const dropdownLocator = (this as any)[`multipledropdownlv${i + 1}`];
      console.log(`Selecting ${key}: ${value}`);

      // รอ dropdown ปรากฏ
      await dropdownLocator.waitFor({ state: "visible", timeout: 5000 });
      await dropdownLocator.click();


      // รอ option ปรากฏแบบ retry
      const optionLocator = this.page.getByRole("option", { name: String(value) });
      let optionVisible = false;

      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          await optionLocator.waitFor({ state: "visible", timeout: 1000 });
          optionVisible = true;
          break;
        } catch (e) {
          console.log(`Option ${value} not visible yet, retrying...`);
          await this.page.waitForTimeout(500); // รอสั้น ๆ ก่อน retry
        }
      }

      if (!optionVisible) {
        throw new Error(`Option "${value}" ไม่ปรากฏใน dropdown`);
      }

      await optionLocator.click();
      await this.page.waitForTimeout(1000)
    }

    // กด search รอบสอง
    await this.page.getByRole("button", { name: "Search" }).nth(1).click();
  }

  async expectNoData() {
    await expect(this.noDataCell).toBeVisible();
  }

  async verifyTableHeaders() {
    const headers = [
      '#dyn_header_isSelected',
      '#dyn_header_name',
      '#dyn_header_dropdownkey',
      '#dyn_header_JEFOkL',
      '#dyn_header_ds1WmD',
      '#dyn_header_kGCQa0',
      '#dyn_header_Rtp6MP',
      '#dyn_header_BI5q7i',
      '#dyn_header_fKpu0q',
      '#dyn_header_phone',
      '#dyn_header_email',
      '#dyn_header_datamasking',
      '#dyn_header_chkbox',
      '#dyn_header_radiobtn',
      '#dyn_header_feu1',
      '#dyn_header_R8i6Yo',
      '#dyn_header_yC3zrN',
      '#dyn_header_txt_input',
      '#dyn_header_name_segment',
      '#dyn_header_address',
      '#dyn_header_chk_box',
      '#dyn_header_action'
    ];

    for (const selector of headers) {
      await expect(this.page.locator(selector)).toBeVisible();
    }

    // Ensure Created At and Updated At are NOT checked (or just ignored as per request, but user said "except", so we just don't verify them. 
    // If the requirement meant "ensure they are NOT visible", I would check .not.toBeVisible(), but usually "except" means "don't care" or "skip verification".
    // Given the context of "verify all fields... except", I will just skip them.
  }

  // Fill inputs example
  async fillContactForm(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    addressNo?: string;
    district?: string;
    subDistrict?: string;
    province?: string;
    zipcode?: string;
  }) {
    if (data.firstName) await this.inputName.fill(data.firstName);
    if (data.lastName) await this.inputLastName.fill(data.lastName);
    if (data.phone) await this.inputPhone.fill(data.phone);
    if (data.email) await this.inputEmail.fill(data.email);
    if (data.addressNo) await this.addressNo.fill(data.addressNo);
    if (data.district) await this.addressDistrict.fill(data.district);
    if (data.subDistrict) await this.addressSubDistrict.fill(data.subDistrict);
    if (data.province) await this.addressProvince.fill(data.province);
    if (data.zipcode) await this.addressZipcode.fill(data.zipcode);
  }

  async cleardate() {
    await this.page.getByRole("combobox", { name: "Select Start Datetime" }).click();
    await this.page.getByLabel("Clear").click();
    await this.page.getByRole("combobox", { name: "Select End Datetime" }).click();
    await this.page.getByLabel("Clear").click();
  }
  async search_datetime(fields: { Datetime?: string, Date?: string, Time?: string, search?: boolean, btn_search?: boolean }) {
    if (fields.btn_search !== false) {
      await this.ensureSearchPanelOpen();

    }

    if (fields.Datetime) {

      // คลิก input ก่อน
      await this.inputDatetime.click();
      // เรียก method ของ helper

      await selectDateTime(this.page, fields.Datetime);


    }
    if (fields.Date) {

      // คลิก input ก่อน
      await this.inputDatetime.click();
      // เรียก method ของ helper

      await selectDateTime(this.page, fields.Date);


    }
    if (fields.Time) {

      // คลิก input ก่อน
      await this.inputDatetime.click();
      // เรียก method ของ helper

      await selectDateTime(this.page, fields.Time);




    }
    if (fields.search !== false) {
      await this.cleardata()
      await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
    }
  }
  async cleardata() {

  }


}

export async function ensureSearchPanelOpen(page: Page) {
  const btnSearch = page.getByRole('button', { name: 'Search' }).nth(2);
  const inputName = page.locator('#dyn_name');

  await btnSearch.click();
  try {
    // Check if a standard field like Name is visible
    // If only start/end dates are visible, this will timeout
    await inputName.waitFor({ state: 'visible', timeout: 2000 });
  } catch (e) {
    console.log('Search panel malformed (only dates visible?). Refreshing page and retrying...');
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await btnSearch.click();
    await inputName.waitFor({ state: 'visible', timeout: 5000 });
  }
}
