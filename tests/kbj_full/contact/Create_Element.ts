import { fa, th } from '@faker-js/faker';
import { Page, Locator, expect } from '@playwright/test';
import { selectDateTime } from './FillForm'; 
import path from 'path';
import fs from 'fs';
export class Element_Create_Contact {
  readonly page: Page;
 //StartDate EndDate
    readonly input_startdate : Locator;
    readonly input_enddate : Locator;
 //Input Group
  readonly input_group_btn :  Locator;
  
  // Buttons
  readonly btnCreateContact: Locator;
  readonly btnExport: Locator;
  readonly btnSearch: Locator;
  readonly btnDelete: Locator;
  readonly btnclear: Locator;
  readonly btnUpdate : Locator;
  readonly btnconfirm_update :Locator;
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
  readonly input_Create_Date : Locator;
  readonly input_Create_DateTime: Locator;
  readonly input_Create_Time :Locator;
  //Checkbox
  readonly inputCheckbox: Locator;
  // Address
  readonly addressNo: Locator;
  readonly addressDistrict: Locator;
  readonly addressSubDistrict: Locator;
  readonly addressProvince: Locator;
  readonly addressZipcode: Locator;
  readonly submmit_contact:Locator;
  readonly Create_address_addressDistrict:Locator;
  readonly
 //Segment
 readonly segment : Locator;
 readonly input_segment : Locator;
readonly fill_auto : Locator;

readonly error_msg_empty:  Locator;
readonly error_msg_val:Locator;
readonly error_msg_email_valid :Locator;
readonly inputDate_Create:Locator;
readonly input_address : Locator;
readonly btn_address :Locator ; 
 //Nodatacell
  readonly noDataCell: Locator;
  constructor(page: Page) { 
    this.page = page;
    this.btn_address =page.getByRole('button', { name: 'Add Address' })
    this.input_address = page.locator('#dyn_address_0');
    this.submmit_contact= page.getByRole('button', { name: 'Create', exact: true })
    this.error_msg_empty =page.getByText('Value is required')
    this.error_msg_val = page.getByText('Value is not an integer')
    this.error_msg_email_valid =page.getByText('Value is not a valid email')

    
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
    this.btnclear= page.getByRole('button', { name: 'Clear' })
    this.btnUpdate = page.getByRole('button', { name: 'Update' })
    this.btnconfirm_update =page.getByLabel('Update', { exact: true })
    // Inputs
    this.inputStartDate = page.locator('#start_datetime')
    this.inputEndDate = page.locator('#end_datetime')
    this.inputName = page.locator('#dyn_name').nth(1)
    
    // this.inputLastName = page.getByRole('textbox', { name: 'Enter your Email' });
    // this.inputCheckbox = page.getByRole('combobox', { name: 'Select checkbox' })
    this.inputPhone = page.locator('#dyn_phone_0')
    this.inputEmail = page.locator('#dyn_email').nth(1)
    this.inputDatemasking =page.locator('#dyn_datamasking').nth(1)
    this.inputCheckbox = page.locator('#dyn_chkbox').nth(1)
    this.btnRadio = page.locator('#dyn_radiobtn')
    this.inputText = page.getByRole('textbox', { name: 'Enter your textinput' }).nth(1)
    this.inputDatetime  = page.locator('#dyn_feu1').nth(1)
    this.inputDate =  page.locator('#dyn_R8i6Yo').nth(1)
    this.inputTime = page.locator('#dyn_yC3zrN').nth(1)
    this.input_Create_Date = page.getByRole('combobox', { name: 'date of birth', exact: true })
    this.input_Create_DateTime =  page.getByRole('combobox', { name: 'datetime', exact: true })
    this.input_Create_Time =  page.getByRole('combobox', { name: 'Time', exact: true })
    
    // Address
   this.addressNo = page.locator('#dyn_address.address').nth(1).or(page.getByRole('textbox', { name: 'Enter your ที่อยู่/บ้านเลขที่' })).nth(1) .or(page.locator('#dyn_address_0'))
    this.addressDistrict = page.locator('#dyn_address.address').nth(1).or(page.getByRole('textbox', { name: 'Enter your อำเภอ / เขต' })).nth(1).or(page.locator('#dyn_district_0').getByRole('combobox', { name: 'ค้นหา อำเภอ / เขต' }))
    this.addressSubDistrict = page.locator('#dyn_address.subdistrict').nth(1).or(page.getByRole('textbox', { name: 'Enter your ตำบล/แขวง' })).nth(1).or(page.locator('#dyn_subdistrict_0').getByRole('combobox', { name: 'ค้นหา ตำบล/แขวง' }));
    this.addressProvince = page.locator('#dyn_address.province').nth(1).or(page.getByRole('textbox', { name: 'Enter your จังหวัด' })).nth(1).or(page.locator('#dyn_province_0').getByRole('combobox', { name: 'ค้นหา จังหวัด' }))
    this.addressZipcode = page.locator('#dyn_address.zipcode').nth(1).or(page.getByRole('textbox', { name: 'Enter your รหัสไปรษณีย์' })).nth(1).or(page.locator('#dyn_zipcode_0').getByRole('combobox', { name: 'ค้นหา รหัสไปรษณีย์' }))
    this.Create_address_addressDistrict =  page.getByRole('combobox', { name: 'ค้นหา จังหวัด' })
    //Segment
    this.segment = page.locator ('#dyn_name_segment').nth(1)
    this.input_segment = page.locator('#dyn_text_segment')
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
  async input_Field(fields: { Name?: string; Phone?: string; Email?: string , 
    Address_no?: string  , Address_district?: string , 
    Address_subdistrict?: string , Address_province?: string , 
    Address_zipcode?: string , Datamasking ?: string  ,  
    search?: boolean,Dropdown? :string ,
    Radiobtn?:string , Checkbox?:boolean, 
    Segment?:string,Input_Segment?:string,
    DateTime?:string , Date?:string ,  
    Time?:string , District?:string ,
    Sub_district?:string ,Province?:string,
     Zipcode?:string , Btn_group?:string ,
     Dropdown_group?:string ,text_group?:string
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

if (hasValue(fields.Address_no)) {
  await this.btn_address.click();
  await this.addressNo.fill(fields.Address_no);
}

if (hasValue(fields.Address_subdistrict)) {
  await this.addressSubDistrict.click();
  await this.addressSubDistrict.fill(fields.Address_subdistrict);
  await this.page.locator('li.p-listbox-option').first().click();
}

if (hasValue(fields.Address_district)) {
  await this.addressDistrict.click();
  await this.addressDistrict.fill(fields.Address_district);
  await this.page.locator('li.p-listbox-option').first().click();
}

if (hasValue(fields.Address_province)) {
  await this.addressProvince.click();
  await this.addressProvince.fill(fields.Address_province);
  await this.page.locator('li.p-listbox-option').first().click();
}

if (hasValue(fields.Address_zipcode)) {
  await this.addressZipcode.click();
  await this.addressProvince.fill(fields.Address_zipcode);
  await this.page.locator('li.p-listbox-option').first().click();
}

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

if (fields.Checkbox) {
  await this.inputCheckbox.click();
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
 async  uploadFiles(page: Page, fileNames: string[]) {
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
}
