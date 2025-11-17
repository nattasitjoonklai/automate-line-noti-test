import { th } from '@faker-js/faker';
import { Page, Locator, expect } from '@playwright/test';
 
export class Element_Contact {
  readonly page: Page;
 //StartDate EndDate
    readonly input_startdate : Locator;
    readonly input_enddate : Locator;
  // Buttons
  readonly btnCreateContact: Locator;
  readonly btnExport: Locator;
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
 readonly segmment : Locator;

 //Nodatacell
  readonly noDataCell: Locator;
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
    this.btnSearch = page.getByRole('button', { name: 'Search' }).nth(2);
    this.btnDelete = page.getByRole('button', { name: 'Delete' });
    this.btnclear= page.getByRole('button', { name: 'Clear' })
    // Inputs
    this.inputStartDate = page.locator('#start_datetime')
    this.inputEndDate = page.locator('#end_datetime')
    this.inputName = page.locator('#dyn_name')
    
    // this.inputLastName = page.getByRole('textbox', { name: 'Enter your Email' });
    // this.inputCheckbox = page.getByRole('combobox', { name: 'Select checkbox' })
    this.inputPhone = page.locator('#dyn_phone')
    this.inputEmail = page.locator('#dyn_email')
    this.inputDatemasking =page.locator('#dyn_datamasking')
    this.inputCheckbox = page.locator('#dyn_chkbox')
    this.btnRadio = page.locator('#dyn_radiobtn')
    this.inputText = page.getByRole('textbox', { name: 'Enter your textinput' })
    this.inputDatetime  = page.locator('#dyn_feu1')
    this.inputDate =  page.locator('#dyn_R8i6Yo')
    this.inputTime = page.locator('#dyn_yC3zrN')
    // Address
   this.addressNo = page.locator('#dyn_address.address').first().or(page.getByRole('textbox', { name: 'Enter your ที่อยู่/บ้านเลขที่' })).first();
    this.addressDistrict = page.locator('#dyn_address.address').first().or(page.getByRole('textbox', { name: 'Enter your อำเภอ / เขต' })).first()
    this.addressSubDistrict = page.locator('#dyn_address.subdistrict').first().or(page.getByRole('textbox', { name: 'Enter your ตำบล/แขวง' })).first()
    this.addressProvince = page.locator('#dyn_address.province').first().or(page.getByRole('textbox', { name: 'Enter your จังหวัด' })).first()
    this.addressZipcode = page.locator('#dyn_address.zipcode').first().or(page.getByRole('textbox', { name: 'Enter your จังหวัด' })).first()
    //Segment
    this.segmment = page.locator ('#dyn_segment')
    //

    this.noDataCell=page.getByRole('cell', { name: 'No Data' })
    
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
  async goto(){
    await this.page.goto('/contact');
  }
  async export() {
    await this.btnExport.click();
  }
   // Generic search
  async searchBy(fields: { Name?: string; Phone?: string; Email?: string , Address_no?: string  , Address_district?: string , Address_subdistrict?: string , Address_province?: string , Address_zipcode?: string , Datamasking ?: string }) {
    await this.btnSearch.click();
    if (fields.Address_no) await this.addressNo.fill(fields.Address_no);
    if (fields.Address_district) await this.addressDistrict.fill(fields.Address_district);
    if (fields.Address_subdistrict) await this.addressSubDistrict.fill(fields.Address_subdistrict);
    if (fields.Address_province) await this.addressProvince.fill(fields.Address_province);
    if (fields.Address_zipcode) await this.addressZipcode.fill(fields.Address_zipcode);
    if (fields.Name) await this.inputName.fill(fields.Name);
    if (fields.Phone) await this.inputPhone.fill(fields.Phone);
    if (fields.Email) await this.inputEmail.fill(fields.Email);
    if (fields.Datamasking) await this.inputDatemasking.fill(fields.Datamasking);
    // กด search รอบสอง
    await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
  }

  async searchBy_Dropdown(fields: {Dropodown?:string }) {
    await this.btnSearch.click();
    if (fields.Dropodown) 
        await this.cleardate();
        await this.dropdown.click();
        await this.page.getByRole('option', { name: fields.Dropodown }).click();
    // กด search รอบสอง
    await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
  }


 async searchByMultipleDropdown(fields: {
  MultipleDropdownlv1?: string;
  MultipleDropdownlv2?: string;
  MultipleDropdownlv3?: string;
  MultipleDropdownlv4?: string;
  MultipleDropdownlv5?: string;
  MultipleDropdownlv6?: string;
}) {
  await this.btnSearch.click();   
  await this.cleardate();

  // กำหนดลำดับ dropdown
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

    // ข้ามถ้าไม่มีค่า
    if (!value) continue;

    // สำหรับ level > 1 ให้เช็คว่ามี level ก่อนหน้าแล้ว
    if (i > 0) {
      const prevKey = dropdownLevels[i - 1];
      if (!fields[prevKey]) {
        console.warn(`Cannot select ${key} because ${prevKey} is not set`);
        continue;
      }
    }

    // คลิก dropdown และเลือก option
    const dropdownLocator = (this as any)[`multipledropdownlv${i + 1}`];
    console.log(`Selecting ${key}: ${value}`);
    await this.page.waitForTimeout(3000)
    await dropdownLocator.click();
    await this.page.getByRole("option", { name: value }).click();
  }

  // กด search รอบสอง
  await this.page.getByRole('button', { name: 'Search' }).nth(1).click();
}
  async expectNoData() {
    await expect(this.noDataCell).toBeVisible();
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

  async cleardate (){
     await this.page.getByRole("combobox", { name: "Select Start Datetime" }).click();
    await this.page.getByLabel("Clear").click();
    await this.page.getByRole("combobox", { name: "Select End Datetime" }).click();
    await this.page.getByLabel("Clear").click();
  }
}