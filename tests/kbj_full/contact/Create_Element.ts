import { fa, th } from '@faker-js/faker';
import { Page, Locator, expect } from '@playwright/test';
import { selectDateTime } from './FillForm';
import path from 'path';
import fs from 'fs';
export class Element_Create_Contact {
  readonly page: Page;
  //StartDate EndDate
  readonly input_startdate: Locator;
  readonly input_enddate: Locator;
  //Input Group
  readonly input_group_btn: Locator;

  // Buttons
  readonly btnCreateContact: Locator;
  readonly btnExport: Locator;
  readonly btnSearch: Locator;
  readonly btnDelete: Locator;
  readonly btnclear: Locator;
  readonly btnUpdate: Locator;
  readonly btnconfirm_update: Locator;
  readonly btn_link: Locator;
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
  readonly inputPhone2: Locator;
  readonly btnAddPhone: Locator;
  readonly inputEmail: Locator;
  readonly inputText: Locator;
  readonly inputDatemasking: Locator;
  readonly inputDatetime: Locator;
  readonly inputDate: Locator;
  readonly inputTime: Locator;
  readonly input_Create_Date: Locator;
  readonly input_Create_DateTime: Locator;
  readonly input_Create_Time: Locator;

  readonly input_Search_inputName: Locator;
  //Checkbox
  readonly inputCheckbox: Locator;
  // Address
  readonly addressNo: Locator;
  readonly addressDistrict: Locator;
  readonly addressSubDistrict: Locator;
  readonly addressProvince: Locator;
  readonly addressZipcode: Locator;
  readonly submmit_contact: Locator;
  readonly Create_address_addressDistrict: Locator;
  readonly addressNo2: Locator;
  readonly addressDistrict2: Locator;
  readonly addressSubDistrict2: Locator;
  readonly addressProvince2: Locator;
  readonly addressZipcode2: Locator;

  //Segment
  readonly segment: Locator;
  readonly input_segment: Locator;
  readonly fill_auto: Locator;

  readonly error_msg_empty: Locator;
  readonly error_msg_val: Locator;
  readonly error_msg_email_valid: Locator;
  readonly error_msg_toast: Locator;
  readonly error_msg_max: Locator;
  readonly error_attach_file: Locator;
  readonly inputDate_Create: Locator;
  readonly input_address: Locator;
  readonly btn_address: Locator;
  //Nodatacell
  readonly noDataCell: Locator;
  // Note
  readonly inputNote: Locator;
  readonly btnSendNote: Locator;
  readonly noteListItems: Locator;
  constructor(page: Page) {
    this.page = page;
    this.btn_address = page.getByRole('button', { name: 'Add Address' })
    this.input_address = page.locator('#dyn_address_0');
    this.submmit_contact = page.getByRole('button', { name: 'Create', exact: true })
    this.error_msg_empty = page.getByText('Value is required')
    this.error_msg_val = page.getByText('Value is not an integer')
    this.error_msg_email_valid = page.getByText('Value is not a valid email')
    this.error_msg_toast = page.getByText('Field is missing');
    this.error_msg_max = page.getByText('The maximum length allowed is 10')
    this.error_attach_file = page.getByText('ขนาดไฟล์ไม่เกิน 5 MB')


    this.btn_link = page.getByRole('button', { name: 'btntest' })

    //multiple dropdown
    this.multipledropdownlv1 = page.locator('#dyn_JEFOkL').nth(1)
    this.multipledropdownlv2 = page.locator('#dyn_ds1WmD').nth(1)
    this.multipledropdownlv3 = page.locator('#dyn_kGCQa0').nth(1)
    this.multipledropdownlv4 = page.locator('#dyn_Rtp6MP').nth(1)
    this.multipledropdownlv5 = page.locator('#dyn_BI5q7i').nth(1)
    this.multipledropdownlv6 = page.locator('#dyn_fKpu0q').nth(1)

    //Dropdown
    this.dropdown = page.locator('#dyn_dropdownkey').nth(1)
    // Buttons
    this.btnCreateContact = page.getByRole('button', { name: 'Create Contact' });
    this.btnExport = page.getByRole('button', { name: 'Export' });
    this.btnSearch = page.getByRole('button', { name: 'Search' }).nth(2);
    this.btnDelete = page.getByRole('button', { name: 'Delete' });
    this.btnclear = page.getByRole('button', { name: 'Clear' })
    this.btnUpdate = page.getByRole('button', { name: 'Update' })
    this.btnconfirm_update = page.getByLabel('Update', { exact: true })
    // Inputs
    this.inputStartDate = page.locator('#start_datetime')
    this.inputEndDate = page.locator('#end_datetime')
    this.inputName = page.locator('#dyn_name').nth(1)

    // this.inputLastName = page.getByRole('textbox', { name: 'Enter your Email' });
    // this.inputCheckbox = page.getByRole('combobox', { name: 'Select checkbox' })
    this.inputPhone = page.locator('#dyn_phone_0')
    this.inputPhone2 = page.locator('#dyn_phone_1')
    this.btnAddPhone = page.getByRole('button', { name: 'Add Phone' });
    this.inputEmail = page.locator('#dyn_email').nth(1)
    this.inputDatemasking = page.locator('#dyn_datamasking').nth(1)
    this.inputCheckbox = page.locator('#dyn_chkbox').nth(1)
    this.btnRadio = page.locator('#dyn_radiobtn')
    this.input_Search_inputName = page.getByRole('textbox', { name: 'Enter your text input' })
    this.inputText = page.getByPlaceholder('textinput')
    this.inputDatetime = page.locator('#dyn_feu1').nth(1)
    this.inputDate = page.locator('#dyn_R8i6Yo').nth(1)
    this.inputTime = page.locator('#dyn_yC3zrN').nth(1)
    this.input_Create_Date = page.getByRole('combobox', { name: 'date of birth', exact: true })
    this.input_Create_DateTime = page.getByRole('combobox', { name: 'datetime', exact: true })
    this.input_Create_Time = page.getByRole('combobox', { name: 'Time', exact: true })

    // Address
    this.addressNo = page.locator('#dyn_address.address').nth(1).or(page.getByRole('textbox', { name: 'Enter your ที่อยู่/บ้านเลขที่' })).nth(1).or(page.locator('#dyn_address_0'))
    this.addressDistrict = page.locator('#dyn_address.address').nth(1).or(page.getByRole('textbox', { name: 'Enter your อำเภอ / เขต' })).nth(1).or(page.locator('#dyn_district_0 input'))
    this.addressSubDistrict = page.locator('#dyn_address.subdistrict').nth(1).or(page.getByRole('textbox', { name: 'Enter your ตำบล/แขวง' })).nth(1).or(page.locator('#dyn_subdistrict_0 input'));
    this.addressProvince = page.locator('#dyn_address.province').nth(1).or(page.getByRole('textbox', { name: 'Enter your จังหวัด' })).nth(1).or(page.locator('#dyn_province_0 input'))
    this.addressZipcode = page.locator('#dyn_address.zipcode').nth(1).or(page.getByRole('textbox', { name: 'Enter your รหัสไปรษณีย์' })).nth(1).or(page.locator('#dyn_zipcode_0 input'))
    this.Create_address_addressDistrict = page.getByRole('combobox', { name: 'ค้นหา จังหวัด' })

    // Address 2 (for Add Address test)
    this.addressNo2 = page.locator('#dyn_address_1');
    this.addressDistrict2 = page.locator('#dyn_district_1').getByRole('combobox');
    this.addressSubDistrict2 = page.locator('#dyn_subdistrict_1').getByRole('combobox');
    this.addressProvince2 = page.locator('#dyn_province_1').getByRole('combobox');
    this.addressZipcode2 = page.locator('#dyn_zipcode_1').getByRole('combobox');
    //Segment
    this.segment = page.locator('#dyn_name_segment').nth(1)
    this.input_segment = page.locator('#dyn_text_segment')
    //

    this.noDataCell = page.getByRole('cell', { name: 'No Data' })

    // Note
    this.inputNote = page.getByPlaceholder('note');
    this.btnSendNote = this.inputNote.locator('..').locator('button');
    this.noteListItems = page.locator('.max-h-\\[30vh\\] > div');

  }

  // Methods
  async createTicket() {
    await this.btnCreateContact.click();
    await expect(this.page.getByText('New Ticket')).toBeVisible();
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
  async input_Field(fields: {
    Name?: string; Phone?: string; Email?: string,
    Address_no?: string, Address_district?: string,
    Address_subdistrict?: string, Address_province?: string,
    Address_zipcode?: string, Datamasking?: string,
    search?: boolean, Dropdown?: string,
    Radiobtn?: string, Checkbox?: boolean,
    Segment?: string, Input_Segment?: string,
    DateTime?: string, Date?: string,
    Time?: string, District?: string,
    Sub_district?: string, Province?: string,
    Zipcode?: string, Btn_group?: string,
    Dropdown_group?: string, text_group?: string;
    text_input?: string;
    [key: string]: any;
  }) {

    // ✅ ถ้า fields.search === false → ไม่ต้องกดปุ่ม search




    const hasValue = (v) => v !== undefined && v !== null && v !== "";

    if (hasValue(fields.Name)) await this.inputName.fill(fields.Name);
    if (hasValue(fields.Phone)) await this.inputPhone.fill(fields.Phone);
    if (hasValue(fields.Email)) await this.inputEmail.fill(fields.Email);
    if (hasValue(fields.Datamasking)) await this.inputDatemasking.fill(fields.Datamasking);
    if (hasValue(fields.DateTime)) await this.input_Create_DateTime.fill(fields.DateTime);
    if (hasValue(fields.Date)) await this.input_Create_Date.fill(fields.Date);
    if (hasValue(fields.Time)) await this.input_Create_Time.fill(fields.Time);
    if (hasValue(fields.text_input)) await this.inputText.fill(fields.text_input);

    // if (hasValue(fields.Address_no)) {
    //   await this.btn_address.click();
    //   await this.addressNo.fill(fields.Address_no);
    // }

    // if (hasValue(fields.Address_subdistrict)) {
    //   await this.addressSubDistrict.click();
    //   await this.addressSubDistrict.fill(fields.Address_subdistrict);
    //   await this.page.locator('li.p-listbox-option').first().click();
    // }

    // if (hasValue(fields.Address_district)) {
    //   await this.addressDistrict.click();
    //   await this.addressDistrict.fill(fields.Address_district);
    //   await this.page.locator('li.p-listbox-option').first().click();
    // }

    // if (hasValue(fields.Address_province)) {
    //   await this.addressProvince.click();
    //   await this.addressProvince.fill(fields.Address_province);
    //   await this.page.locator('li.p-listbox-option').first().click();
    // }

    // if (hasValue(fields.Address_zipcode)) {
    //   await this.addressZipcode.click();
    //   await this.addressZipcode.fill(fields.Address_zipcode);
    //   await this.page.locator('li.p-listbox-option').first().click();
    // }

    if (hasValue(fields.Btn_group)) {
      await this.page.locator(`input[type="radio"][name="dynamic"][value="${fields.Btn_group}"]`).check();
    }

    if (hasValue(fields.Dropdown)) {
      await this.dropdown.click();
      await this.page.getByRole('option', { name: fields.Dropdown }).click();
    }
    if (hasValue(fields.Segment)) {
      await this.segment.fill(fields.Segment)
    }
    if (hasValue(fields.Input_Segment)) {
      await this.input_segment.fill(fields.Input_Segment)
    }

    if (hasValue(fields.Radiobtn)) {
      await this.page.locator(`input[type="radio"][value="${fields.Radiobtn}"]`).check();
    }
    if (hasValue(fields.Radiobtn)) {
      await this.page.locator(`input[type="radio"][value="${fields.Radiobtn}"]`).check();
    }

    if (hasValue(fields.Dropdown_group)) {
      await this.page.locator('#dyn_iu').click();
      await this.page.getByRole('option', { name: fields.Dropdown_group, exact: true }).click();
    }

    if (hasValue(fields.text_group)) {
      await this.page.locator('#dyn_text_group').fill(fields.text_group);
    }

    const isChecked = await this.inputCheckbox.isChecked();
    if (fields.Checkbox && !isChecked) {
      // ต้องติ๊ก แต่ตอนนี้ยังไม่ติ๊ก → ติ๊กให้
      await this.inputCheckbox.check();
    }

    if (!fields.Checkbox && isChecked) {
      // ไม่ควรติ๊ก แต่ตอนนี้ติ๊กอยู่ → เอาติ๊กออก
      await this.inputCheckbox.uncheck();
    }

    // Dynamic Address Handling (Address_no_1, Address_no_2, ...)
    for (let i = 1; i <= 10; i++) {
      const noKey = `Address_no_${i}`;
      const districtKey = `Address_district_${i}`;
      const subKey = `Address_subdistrict_${i}`;
      const provKey = `Address_province_${i}`;
      const zipKey = `Address_zipcode_${i}`;

      if (hasValue(fields[noKey]) || hasValue(fields[districtKey]) || hasValue(fields[provKey]) || hasValue(fields[subKey]) || hasValue(fields[zipKey])) {
        const index = i - 1;

        // Ensure address row exists
        // Check count of existing address rows to decide if we need to add
        const addressInputs = this.page.locator('input[id^="dyn_address_"]');
        const currentCount = await addressInputs.count();

        if (index >= currentCount) {


          // Only click if we really need a new row
          await this.btn_address.click();
          await this.page.waitForTimeout(500);
        }

        // Double check visibility just in case
        const addressRowInput = this.page.locator(`#dyn_address_${index}`);
        if (!(await addressRowInput.isVisible())) {
          // If still not visible, maybe click again or wait?
          // Should be handled by the count check above.
        }

        // Fill Address No
        if (hasValue(fields[noKey])) {
          await this.page.locator(`#dyn_address_${index}`).fill(fields[noKey]);
        }

        // Fill SubDistrict
        if (hasValue(fields[subKey])) {
          const subLocator = this.page.locator(`#dyn_subdistrict_${index}`).getByRole('combobox');
          await subLocator.click();
          await subLocator.fill(fields[subKey]);
          await this.page.locator('li.p-listbox-option').first().click();
        }

        // Fill District
        if (hasValue(fields[districtKey])) {
          const distLocator = this.page.locator(`#dyn_district_${index}`).getByRole('combobox');
          await distLocator.click();
          await distLocator.fill(fields[districtKey]);
          await this.page.locator('li.p-listbox-option').first().click();
        }

        // Fill Province
        if (hasValue(fields[provKey])) {
          const provLocator = this.page.locator(`#dyn_province_${index}`).getByRole('combobox');
          await provLocator.click();
          await provLocator.fill(fields[provKey]);
          await this.page.locator('li.p-listbox-option').first().click();
        }

        // Fill Zipcode
        if (hasValue(fields[zipKey])) {
          const zipLocator = this.page.locator(`#dyn_zipcode_${index}`).getByRole('combobox');
          await zipLocator.click();
          await zipLocator.fill(fields[zipKey]);
          await this.page.locator('li.p-listbox-option').first().click();
        }
      }
    }

    await this.page.waitForTimeout(3000);
  }




  async fillInputMultipleDropdown(fields: {
    search?: boolean;
    btn_search?: boolean;
    MultipleDropdownlv1?: string;
    MultipleDropdownlv2?: string;
    MultipleDropdownlv3?: string;
    MultipleDropdownlv4?: string;
    MultipleDropdownlv5?: string;
    MultipleDropdownlv6?: string;
  }) {

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


  }
  async uploadFiles(page: Page, fileNames: string[]) {
    const basePath = path.resolve('tests/file_update-test');

    // map ให้เป็น path file จริง
    const filesToUpload = fileNames.map(file => path.join(basePath, file));

    // ตรวจสอบว่าไฟล์มีจริง
    filesToUpload.forEach(filePath => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`❌ File not found: ${filePath}`);
      }
    });

    // อัปโหลดไฟล์
    await page.setInputFiles('input[type="file"]', filesToUpload);
  }

  // Method สำหรับ Search Element
  async search_element(fields: {
    Start_datetime?: string;
    End_datetime?: string;
    Name?: string;
    Dropdown?: string;
    MultipleDropdownlv1?: string;
    MultipleDropdownlv2?: string;
    MultipleDropdownlv3?: string;
    MultipleDropdownlv4?: string;
    MultipleDropdownlv5?: string;
    MultipleDropdownlv6?: string;
    Phone?: string;
    Email?: string;
    Datamasking?: string;
    Checkbox?: string;
    Radiobtn?: string;
    Datetime?: string;
    Date?: string;
    Time?: string;
    Text_input?: string;
    Segment?: string;
    Address_no?: string;
    Address_subdistrict?: string;
    Address_district?: string;
    Address_province?: string;
    Address_zipcode?: string;
  }) {
    const hasValue = (val: any) => val !== undefined && val !== null && val !== '';

    // Start Datetime
    if (hasValue(fields.Start_datetime)) {
      await this.page.locator('#start_datetime input').fill(fields.Start_datetime);
    }

    // End Datetime
    if (hasValue(fields.End_datetime)) {
      await this.page.locator('#end_datetime input').fill(fields.End_datetime);
    }

    // Name
    if (hasValue(fields.Name)) {
      await this.page.locator('#dyn_name').fill(fields.Name);
    }

    // Dropdown
    if (hasValue(fields.Dropdown)) {
      await this.page.locator('#dyn_dropdownkey').click();
      await this.page.getByRole('option', { name: fields.Dropdown }).click();
    }

    // Multiple Dropdown Levels
    if (hasValue(fields.MultipleDropdownlv1)) {
      await this.page.locator('#dyn_JEFOkL').click();
      await this.page.getByRole('option', { name: fields.MultipleDropdownlv1 }).click();
      await this.page.waitForTimeout(500);
    }

    if (hasValue(fields.MultipleDropdownlv2)) {
      await this.page.locator('#dyn_ds1WmD').click();
      await this.page.getByRole('option', { name: fields.MultipleDropdownlv2 }).click();
      await this.page.waitForTimeout(500);
    }

    if (hasValue(fields.MultipleDropdownlv3)) {
      await this.page.locator('#dyn_kGCQa0').click();
      await this.page.getByRole('option', { name: fields.MultipleDropdownlv3 }).click();
      await this.page.waitForTimeout(500);
    }

    if (hasValue(fields.MultipleDropdownlv4)) {
      await this.page.locator('#dyn_Rtp6MP').click();
      await this.page.getByRole('option', { name: fields.MultipleDropdownlv4 }).click();
      await this.page.waitForTimeout(500);
    }

    if (hasValue(fields.MultipleDropdownlv5)) {
      await this.page.locator('#dyn_BI5q7i').click();
      await this.page.getByRole('option', { name: fields.MultipleDropdownlv5 }).click();
      await this.page.waitForTimeout(500);
    }

    if (hasValue(fields.MultipleDropdownlv6)) {
      await this.page.locator('#dyn_fKpu0q').click();
      await this.page.getByRole('option', { name: fields.MultipleDropdownlv6 }).click();
      await this.page.waitForTimeout(500);
    }

    // Phone
    if (hasValue(fields.Phone)) {
      await this.page.locator('#dyn_phone').fill(fields.Phone);
    }

    // Email
    if (hasValue(fields.Email)) {
      await this.page.locator('#dyn_email').fill(fields.Email);
    }

    // Data Masking
    if (hasValue(fields.Datamasking)) {
      await this.page.locator('#dyn_datamasking').fill(fields.Datamasking);
    }

    // Checkbox
    if (hasValue(fields.Checkbox)) {
      await this.page.locator('#dyn_chkbox').click();
      await this.page.getByRole('option', { name: fields.Checkbox }).click();
    }

    // Radio Button
    if (hasValue(fields.Radiobtn)) {
      await this.page.locator('#dyn_radiobtn').click();
      await this.page.getByRole('option', { name: fields.Radiobtn }).click();
    }

    // Datetime
    if (hasValue(fields.Datetime)) {
      await this.page.locator('#dyn_feu1').fill(fields.Datetime);
    }

    // Date
    if (hasValue(fields.Date)) {
      await this.page.locator('#dyn_R8i6Yo').fill(fields.Date);
    }

    // Time
    if (hasValue(fields.Time)) {
      await this.page.locator('#dyn_yC3zrN').fill(fields.Time);
    }

    // Text Input
    if (hasValue(fields.Text_input)) {
      await this.page.locator('#dyn_txt_input').fill(fields.Text_input);
    }

    // Segment
    if (hasValue(fields.Segment)) {
      await this.page.locator('#dyn_name_segment').fill(fields.Segment);
    }

    // Address fields
    if (hasValue(fields.Address_no)) {
      await this.page.locator('#dyn_address\\.address').fill(fields.Address_no);
    }

    if (hasValue(fields.Address_subdistrict)) {
      await this.page.locator('#dyn_address\\.subdistrict').fill(fields.Address_subdistrict);
    }

    if (hasValue(fields.Address_district)) {
      await this.page.locator('#dyn_address\\.district').fill(fields.Address_district);
    }

    if (hasValue(fields.Address_province)) {
      await this.page.locator('#dyn_address\\.province').fill(fields.Address_province);
    }

    if (hasValue(fields.Address_zipcode)) {
      await this.page.locator('#dyn_address\\.zipcode').fill(fields.Address_zipcode);
    }

    // Click Search button
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForTimeout(2000);
  }

  // Method สำหรับเช็คค่า Multi Dropdown แต่ละ level จาก placeholder
  chk_multidropdown(level: number): Locator {
    const ariaControlsMap: { [key: number]: string } = {
      1: 'dyn_JEFOkL_panel',
      2: 'dyn_ds1WmD_panel',
      3: 'dyn_kGCQa0_panel',
      4: 'dyn_Rtp6MP_panel',
      5: 'dyn_BI5q7i_panel',
      6: 'dyn_fKpu0q_panel'
    };

    const ariaControl = ariaControlsMap[level];
    if (!ariaControl) {
      throw new Error(`Invalid multi-dropdown level: ${level}. Must be between 1-6.`);
    }

    return this.page.locator(`[aria-controls="${ariaControl}"]`);
  }
}
