import test, { expect, Page, APIRequestContext } from "@playwright/test";
import { BaseUrl, ContactPage } from "../../utils";
import { Element_Contact } from "./Elemenet_Contact";
import { FillInputContactForm, ContactFormFields } from "./FillForm";
import { ContactAPI, verifyTopTableRow } from "./Global_function";
import { Element_Create_Contact } from "./Create_Element";

// function กรอกข้อมูล auto

const contactData = {
  Name: "name456",
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
  Address_no: "123456",
  Address_province: "กรุงเทพมหานคร",
  Change_name:'Name_Edit',
  Change_phone:'0111111'
  // Btn_group: "1",
  // Dropdown_group: "2",
  // text_group: "Group ทดสอบ"
};


const multipleDropdownData = {
  MultipleDropdownlv1: "Level1-1",
  MultipleDropdownlv2: "Level2-1-",
  MultipleDropdownlv3: "Level3-1-1",
  MultipleDropdownlv4: "Level 4_3_1_1",
  MultipleDropdownlv5: "Level 5_4_3_2_1",
  MultipleDropdownlv6: "Level 6_5_4_3_1_1"
};

const filesToUpload = [
  "csv-test.csv",
  "jpg.jpg",
  "png.png"
];
test('CRM_CT00001 การเข้าหน้า Contact', async ({ page }) => {
    const contact = new Element_Contact(page);
  await page.goto(BaseUrl + '/contact');
  await expect(contact.btnCreateContact).toBeVisible();
  await expect(contact.btnExport).toBeVisible();
  await expect(contact.btnSearch).toBeVisible();
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
    await contact.btnSearch.click();
    
   // await expect(contact.addressNo).toBeVisible();
    // await expect(contact.addressDistrict).toBeVisible();
    // await expect(contact.addressSubDistrict).toBeVisible();
    // await expect(contact.addressProvince).toBeVisible();
    // await expect(contact.addressZipcode).toBeVisible();
    await expect(contact.segmment).toBeVisible();
    
});  
test('CRM_CT00003 การค้นหาช่อง Start Datetime', async ({ page }) => {
  const now = new Date();
  const formatted = now.toISOString().slice(0, 10) + ' 00:00';
  const mockdate = '2025-11-11 00:00'
  console.log(formatted); 
  const contact = new Element_Contact(page);  
  await page.goto(BaseUrl + '/contact');
  await contact.btnSearch.click();
  await contact.inputStartDate.click();
  const datetimeValue = await page.getByRole('combobox', { name: 'Select Start Datetime' }).inputValue();
  expect(datetimeValue).toBe(formatted);
 
  await page.getByText('11', { exact: true }).click();
  const afterValue = await page
  .getByRole('combobox', { name: 'Select Start Datetime' })
  .inputValue();
console.log(afterValue);

  
    await page.mouse.click(300, 300);
   expect(afterValue).toBe(mockdate);

   
});
test('CRM_CT00004 การค้นหาช่อง End Datetime', async ({ page }) => {
   const now = new Date();
  const formatted = now.toISOString().slice(0, 10) + ' 23:59';
  // พรุ่งนี้
const nextDay = new Date(now);
nextDay.setDate(now.getDate() + 2);

const mockdate =
  nextDay.toISOString().slice(0, 10) + ' 23:59';
  console.log(formatted); 
  const nextDayNumber = nextDay.getDate().toString();
  const contact = new Element_Contact(page);  
  await page.goto(BaseUrl + '/contact');
  await contact.btnSearch.click();
  await contact.inputEndDate.click();
  const datetimeValue = await page.getByRole('combobox', { name: 'Select End Datetime' }).inputValue();
  expect(datetimeValue).toBe(formatted);
  await page.pause()
  // ❗ อ่านค่าใหม่อีกครั้ง
  await page.getByRole('gridcell', { name: nextDayNumber }).click()
 
  await page.pause()
const afterValue = await page
  .getByRole('combobox', { name: 'Select End Datetime' })
  .inputValue();

  
    await page.mouse.click(300, 300);
   expect(afterValue).toBe(mockdate);
  
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
test('CRM_CT00010   "การค้นหาช่องใส่ Email กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page ,request }) => {
    await ContactAPI.searchAndVerify(page, request, { Email: "nattasit@cloudsoft.co.th" });  
    
});
test('CRM_CT00011   "การค้นหาช่องใส่ Email กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page ,request }) => {
     const contact = new Element_Contact(page);
   await contact.goto();
    await contact.searchBy({ Email: '1232213@gmail.com' });
    await contact.expectNoData();
    
});
test('CRM_CT00012   "การค้นหาช่องใส่ Email กรณีกรอกรูปแบบอีเมลไม่ถูกต้อง"', async ({ page ,request }) => {
     const contact = new Element_Contact(page);
   await contact.goto();
    await contact.btnSearch.click()
    await contact.inputEmail.fill('asasas')
    expect(await page.getByText('Invalid email format')).toBeVisible();
    
});
test('CRM_CT00013   "การค้นหาช่องใส่ Address ที่อยู่/บ้านเลขที่ กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, { Address_no: "88/12" });  
    //await expect(contact.multipledropdownlv1).toBeVisible();
});
test('CRM_CT00014   "การค้นหาช่องใส่ Address ที่อยู่/บ้านเลขที่ กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
     const contact = new Element_Contact(page);
    await contact.goto();
    await contact.searchBy({ Address_no: '88/12' });
});
test('CRM_CT00015   "การค้นหาช่องใส่ Address ตำบล/แขวงกรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, { Address_subdistrict: "บางละมุง" });  
});
test('CRM_CT00016 "การค้นหาช่องใส่ Address ตำบล/แขวง กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page }) => {
    const contact = new Element_Contact(page);
    await contact.goto();
    await contact.searchBy({ Address_subdistrict: '12313132131' });
    await contact.expectNoData();
});
test('CRM_CT00017 "การค้นหาช่องใส่ Address อำเภอ/เขต กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, { Address_subdistrict: "บางละมุง" });  
});
test('CRM_CT00018   "การค้นหาช่องใส่ Address อำเภอ/เขต กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
   const contact = new Element_Contact(page);
    await contact.goto();
    await contact.searchBy({ Address_district: 'สุ่มตำบล' });
    await contact.expectNoData();
});
test('CRM_CT00019  "การค้นหาช่องใส่ Address จังหวัด กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page ,request}) => {
    await ContactAPI.searchAndVerify(page, request, { Address_province: "ชลบุรี" });  
});
test('CRM_CT00020   "การค้นหาช่องใส่ Address จังหวัด กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
    const contact = new Element_Contact(page);
    await contact.goto();
    await contact.searchBy({ Address_province: 'สุ่มจังหวัด' });
    await contact.expectNoData();
});
test('CRM_CT00021   "การค้นหาช่องใส่ Address รหัสไปรษณีย์ กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page ,request}) => {
     await ContactAPI.searchAndVerify(page, request, { Address_zipcode: "20150" });  
});
test('CRM_CT00022   "การค้นหาช่องใส่ Address รหัสไปรษณีย์ กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page }) => {
     const contact = new Element_Contact(page);
    await contact.goto();
    await contact.searchBy({ Address_province: 'สุ่มจังหวัด' });
    await contact.expectNoData();
});
test('CRM_CT00023  "การค้นหาช่องเลือก Dropdown กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page,request }) => {
   await ContactAPI.searchAndVerify(page, request, { Dropdown_value: "ทดสอบตัวเลือก 1" });  
   
});
test('CRM_CT00024   "การค้นหาช่องเลือก Dropdown กรณีข้อมูลไม่มีอยู่ในระบบ"', async ({ page }) => {
    const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchBy_Dropdown( {Dropodown:'ทดสอบตัวเลือก 3'});
    await contact.expectNoData();
    //await expect(contact.multipledropdownlv1).toBeVisible();
});

test('CRM_CT00025   "การค้นหาช่องเลือก Collection Level 1 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, { Dropdown_mutlple_lv1: "Level1-1" });  
});
test('CRM_CT00026	"การค้นหาช่องเลือก Collection Level 1 กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page }) => {
    const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchByMultipleDropdown( {MultipleDropdownlv1:'Level1-4'});
    await contact.expectNoData();
    
});
test('CRM_CT00027  "การค้นหาช่องเลือก Collection Level 2 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, { Dropdown_mutlple_lv1: "Level1-1" , Dropdown_mutlple_lv2: "Level2-1-1"});  
});
test('CRM_CT00028	"การค้นหาช่องเลือก Collection Level 2 กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page }) => {
    const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchByMultipleDropdown( {MultipleDropdownlv1:'Level1-4' , MultipleDropdownlv2:'Level2-3-1'});
    await contact.expectNoData();
    
});
test('CRM_CT00029  "การค้นหาช่องเลือก Collection Level 3 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, { Dropdown_mutlple_lv1: "Level1-1" , Dropdown_mutlple_lv2: "Level2-1-1" , Dropdown_mutlple_lv3: "Level3-1-1"});  
});
test('CRM_CT00030	"การค้นหาช่องเลือก Collection Level 3 กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page }) => {
    const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchByMultipleDropdown( {MultipleDropdownlv1:'Level1-4' , MultipleDropdownlv2:'Level2-3-1', MultipleDropdownlv3:'Level3-3-3'});
    await contact.expectNoData();
    
});
test('CRM_CT00031  "การค้นหาช่องเลือก Collection Level 4 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, 
     {Dropdown_mutlple_lv1:'Level1-1' , 
        Dropdown_mutlple_lv2:'Level2-1-1', 
        Dropdown_mutlple_lv3:'Level3-1-1',
        Dropdown_mutlple_lv4:'Level 4_3_1_1'
      }); 
});
test('CRM_CT00032	"การค้นหาช่องเลือก Collection Level 4 กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page }) => {
    const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchByMultipleDropdown( 
      {MultipleDropdownlv1:'Level1-4' , 
        MultipleDropdownlv2:'Level2-3-1', 
        MultipleDropdownlv3:'Level3-3-3',
        MultipleDropdownlv4:'Level 4_3_1_2'
      });
    await contact.expectNoData();
    
});
test('CRM_CT00033  "การค้นหาช่องเลือก Collection Level 5 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, 
     {Dropdown_mutlple_lv1:'Level1-1' , 
        Dropdown_mutlple_lv2:'Level2-1-1', 
        Dropdown_mutlple_lv3:'Level3-1-1',
        Dropdown_mutlple_lv4:'Level 4_3_1_1',
        Dropdown_mutlple_lv5:'Level 5_4_3_2_1',
      }); 
});
test('CRM_CT00034	"การค้นหาช่องเลือก Collection Level 5 กรณีไม่มีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page }) => {
    const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchByMultipleDropdown( 
      {MultipleDropdownlv1:'Level1-4' , 
        MultipleDropdownlv2:'Level2-3-1', 
        MultipleDropdownlv3:'Level3-3-3',
        MultipleDropdownlv4:'Level 4_3_1_2',
        MultipleDropdownlv5:'Level 5_4_3_2_2',
      });
    await contact.expectNoData();
    
});
test('CRM_CT00035  "การค้นหาช่องเลือก Collection Level 6 กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page,request }) => {
    await ContactAPI.searchAndVerify(page, request, 
     {Dropdown_mutlple_lv1:'Level1-1' , 
        Dropdown_mutlple_lv2:'Level2-1-1', 
        Dropdown_mutlple_lv3:'Level3-1-1',
        Dropdown_mutlple_lv4:'Level 4_3_1_1',
        Dropdown_mutlple_lv5:'Level 5_4_3_2_1',
        Dropdown_mutlple_lv6:'Level 6_5_4_3_1_1'
      }); 
});
test('CRM_CT00036	"การค้นหาช่องเลือก Collection Level 6 กรณีไม่มีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page }) => {
    const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchByMultipleDropdown( 
      {MultipleDropdownlv1:'Level1-4' , 
        MultipleDropdownlv2:'Level2-3-1', 
        MultipleDropdownlv3:'Level3-3-3',
        MultipleDropdownlv4:'Level 4_3_1_2',
        MultipleDropdownlv5:'Level 5_4_3_2_2',
         MultipleDropdownlv6:'Level Level 6_5_4_3_1_3'
      });
    await contact.expectNoData();
    
});
test('CRM_CT00037	"การค้นหาช่อง Data Masking กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page ,request }) => {
  
    await ContactAPI.searchAndVerify(page, request, { Datamasking: "asking" });  
});
test('CRM_CT00038	"การค้นหาช่อง Data Masking กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page ,request }) => {
  
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchBy({ Datamasking: 'Tester' });
    await contact.expectNoData();
});
test('CRM_CT00039	"การค้นหาช่อง Check Box กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page ,request }) => {
  
    await ContactAPI.searchAndVerify(page, request, { Checkbox_TrueFalse: "true" });  
});
test('CRM_CT00040	"การค้นหาช่อง Check Box กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page ,request }) => {
  
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchBy_Checkbox({ Checkbox: 'true' });
    await contact.expectNoData();
});
test('CRM_CT00041	"การค้นหาช่อง Radio Button กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page ,request }) => {
  
    await ContactAPI.searchAndVerify(page, request, { Radio: "value1" });  
});
test('CRM_CT00042	"การค้นหาช่อง Radio Button กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ""', async ({ page ,request }) => {
  
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.searchBy_Radiobtn({ Radiobtn: 'value2' });
    await contact.expectNoData();
});
test('CRM_CT00043	"การค้นหาช่อง Date Time กรณีมีรายชื่อลูกค้าอยู่ในระบบ"""', async ({ page ,request }) => {
  
    await ContactAPI.searchAndVerify(page, request, { Datetime: "2025-11-13 15:53" });  
});
test('CRM_CT00044	"การค้นหาช่อง Date Time กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page  }) => {
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.search_datetime({ Datetime: '2025-11-13 15:53' });
    await contact.expectNoData();
});

test('CRM_CT00045	"การค้นหาช่อง Date กรณีมีรายชื่อลูกค้าอยู่ในระบบ"', async ({ page ,request }) => {
  
    await ContactAPI.searchAndVerify(page, request, { Date: "2025-11-18" });  
});
test('CRM_CT00046	"การค้นหาช่อง Date กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page  }) => {
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.search_datetime({ Datetime: '2025-11-13 15:53' });
    await contact.expectNoData();
});
test('CRM_CT00047	"การค้นหาช่อง Time กรณีมีรายชื่อลูกค้าอยู่ในระบบ""', async ({ page ,request }) => {
  
    await ContactAPI.searchAndVerify(page, request, { Time: "15:53" });  
});
test('CRM_CT00048	"การค้นหาช่อง Time กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ"', async ({ page  }) => {
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.search_datetime({ Time: '15:53' });
    await contact.expectNoData();
});
test('CRM_CT00049	"การค้นหาช่อง Segment กรณีมีรายชื่อลูกค้าอยู่ในระบบ Fail ""', async ({ page ,request }) => {
  
   
});
test('CRM_CT00050	"การค้นหาช่อง Segment กรณีมีรายชื่อลูกค้าไม่มีอยู่ในระบบ Fail ""', async ({ page  }) => {
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.search_datetime({ Time: '15:53' });
    await contact.expectNoData();
});

test('CRM_CT00051	การค้นหาข้อมูล (ปุ่มSearch) ""', async ({ page  }) => {
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.search_datetime({ Time: '15:53' });
    await contact.expectNoData();
});
test('CRM_CT00052	"การค้นหาข้อมูล (ปุ่มSearch) กรณีไม่มีข้อมูลรายชื่อลูกค้าที่ Search" ', async ({ page  }) => {
   const contact = new Element_Contact(page);  
    await contact.goto();
    await contact.search_datetime({ Time: '15:53' });
    await contact.expectNoData();
});
test('CRM_CT00053	การล้างข้อมูลที่กรอก (ปุ่มClear)" Fail ', async ({ page  }) => {
   const contact = new Element_Contact(page);  
   await contact.goto()
   await contact.searchBy({ 
    Name : " ทดสอบ" , 
    Phone: '12312312' ,
    Email :'test01@gmail.com' ,
    Datamasking : 'ทดสอบ' , 
    Address_no :'1111',
    Address_subdistrict : 'ทดสอบ',
    Address_district :'test',
    Address_province :'ทดสอบ',
    Address_zipcode : '5555',
    search:  false
} );
    await contact.searchBy_Dropdown({Dropodown:'ทดสอบตัวเลือก 1',search:false,btn_search:false})
    await contact.searchByMultipleDropdown ({MultipleDropdownlv1:'Level1-1' , 
        MultipleDropdownlv2:'Level2-1-1', 
        MultipleDropdownlv3:'Level3-1-1',
        MultipleDropdownlv4:'Level 4_3_1_1',
        MultipleDropdownlv5:'Level 5_4_3_2_1',
        MultipleDropdownlv6:'Level 6_5_4_3_1_1',
        search: false,
        btn_search : false
      }); 
    await contact.searchBy_Checkbox({Checkbox:'true',search :false, btn_search:false})
    await contact.searchBy_Radiobtn({Radiobtn:'value1',search:false,btn_search:false})
    await contact.search_datetime({Datetime:'2025-11-19 16:05' ,btn_search:false , search: false})
    await contact.search_datetime({Date:'2025-11-19',btn_search:false ,search :false})
    await contact.search_datetime({Time:'16:06',btn_search :false , search :false})
        
    });
    
    test('CRM_CT00054	การสร้้างรายชื่อลูกค้า (Create Contact)" ', async ({ page  }) => {
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
test('CRM_CT00055	การใส่ข้อมูลช่อง NameCRM_CT00055 การใส่ข้อมูลช่อง Name" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   
   await contact.inputName.fill('ทดสอบ')
   await expect(contact.inputName).toHaveValue('ทดสอบ');
    
});
test('CRM_CT00056	"การใส่ข้อมูลช่อง Name กรณีไม่่ใส่ Name " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   
   await contact.submmit_contact.click()
   await expect(contact.error_msg_empty).toBeVisible();
   
    
});
test('CRM_CT00057	การใส่ข้อมูลช่อง Phone" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   
   await contact.inputPhone.fill('0917777')
   await expect(contact.inputPhone).toHaveValue('0917777');
    
});
test('CRM_CT00058	"การใส่ข้อมูลช่อง Phone กรณีใส่ตัวอักษรหรืออักขระพิเศษ" " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await contact.inputPhone.fill('sadsada')
    await page.pause()
     await contact.submmit_contact.click()
    const visible = await contact.error_msg_val.isVisible(); // ต้องเป็น Locator
    expect(visible).toBe(true);
    
});
test('CRM_CT00059	"การใส่ข้อมูลช่อง Phone กรณีไม่ใส่ข้อมูล " " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await contact.inputName.fill('1231456')
     await contact.submmit_contact.click()
    const visible = await contact.error_msg_empty.isVisible(); // ต้องเป็น Locator
    expect(visible).toBe(true);
    
});
test('CRM_CT00060	การเพิ่มช่องใส่ Phone (ปุ่มAdd Phone)" " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
     await page.getByRole('button', { name: 'Add Phone' }).click();
  await page.locator('#dyn_phone_1').click();
  await page.locator('#dyn_phone_1').fill('231231313');
    await expect(page.locator('#dyn_phone_1')).toHaveValue('231231313');
});
test('CRM_CT00061	การใส่ข้อมูลช่อง Email " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await contact.inputEmail.fill('nattasit@cloudsoft.co.th')
    await expect(contact.inputEmail).toHaveValue('nattasit@cloudsoft.co.th')
});
test('CRM_CT00062	"การใส่ข้อมูลช่อง Email กรณีกรอกไม่ตรงรูปแบบ Email " " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await contact.inputEmail.fill('Admintest@mail')
    const visible = await contact.error_msg_email_valid.isVisible(); // ต้องเป็น Locator
    expect(visible).toBe(true);
    await page.pause()
});
test('CRM_CT00063	การเพิ่มข้อมูลที่อยู่ (ปุ่ม Add Address)" " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
      await page.pause()
   await contact.btn_address.click()
   expect (contact.input_address).toBeVisible()
   expect (contact.addressDistrict).toBeVisible()
   expect (contact.addressSubDistrict).toBeVisible()
   expect (contact.addressZipcode).toBeVisible()
  

});
test('CRM_CT00064	"การใส่ข้อมูลช่อง Address ที่อยู่ " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   
   await contact.btn_address.click();
   await contact.input_address.fill('ทดสอบการใส่ที่อยู')
   expect (contact.input_address).toHaveValue('ทดสอบการใส่ที่อยู')
   

});
test('CRM_CT00065	กรณีค้นหา ตำบล/แขวง ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page  }) => {
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
test('CRM_CT00066	กรณีค้นหา อำเภอ/เขต ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
   await contact.goto();
   await contact.btnCreateContact.click()
   await contact.btn_address.click();
   await page.pause()
   await page.waitForTimeout(1000)
   await page.getByRole('combobox', { name: 'ค้นหา อำเภอ / เขต' }).fill('บางแค');
   await page.waitForTimeout(1000)
   await page.locator('.grid.grid-cols-2 > div:nth-child(3) > #dropdownEl > .relative > .w-8').click()
   await page.getByText('บางแค » บางแค » กรุงเทพมหานคร »').click();
    expect(await page.getByRole('combobox', { name: 'บางแค' }).nth(1)).toBeVisible()
});
test('CRM_CT00067	กรณีค้นหา จังหวัด ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
   await contact.goto();
   await contact.btnCreateContact.click()
   await contact.btn_address.click();
   await page.pause()
   await page.waitForTimeout(1000)
   await page.getByRole('combobox', { name: 'ค้นหา จังหวัด' }).fill('กรุงเทพมหานคร');
   await page.waitForTimeout(1000)
   await page.locator('.grid.grid-cols-2 > div:nth-child(4) > #dropdownEl > .relative > .w-8').click()
  await page.getByRole('option', { name: 'คลองต้นไทร » คลองสาน » กรุงเทพมหานคร »' }).click();
    expect(await page.getByRole('combobox', { name: 'กรุงเทพมหานคร' })).toBeVisible()
});
test('CRM_CT00068	กรณีค้นหา รหัสไปรษณีย์ ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page  }) => {
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
test('CRM_CT00069	"การใส่ข้อมูลช่อง Address กรณีไม่ใส่ข้อมูลที่อยู่ "" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
   await contact.goto();
   await contact.btnCreateContact.click()
   await contact.btn_address.click();
 

 
  await page.getByRole('textbox', { name: 'กรอกข้อมูล' }).fill('test');
  await page.getByRole('textbox', { name: 'Tel.' }).click();
  await page.getByRole('textbox', { name: 'Tel.' }).fill('123456');
  await page.getByRole('textbox', { name: 'Enter your Email' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Enter your Email' }).nth(1).fill('example@gmail.com');
  await page.getByRole('radio', { name: 'value1' }).check();
  await page.locator('#dyn_chkbox').nth(1).check();

  await page.getByRole('combobox', { name: 'date of birth', exact: true }).fill('2025-11-01');
  await page.locator('.flex.justify-between.items-center.mb-1').click();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
   expect(await page.getByText('Value is required').first()).toBeVisible()
  expect (await page.getByText('Value is required').nth(1)).toBeVisible()
  expect(await page.getByText('Value is required').nth(2)).toBeVisible()
  expect(await page.getByText('Value is required').nth(3)).toBeVisible()
  expect(await page.getByText('Value is required').nth(4)).toBeVisible()
  
   
});
test('CRM_CT00070	การเลือกข้อมูลช่อง Dropdown"" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
   await contact.goto();
   await contact.btnCreateContact.click()
   await contact.btn_address.click();
 await page.pause()

 await page.getByRole('combobox').filter({ hasText: /^$/ }).nth(5).click();
  await page.locator('#pv_id_16_0').getByText('ทดสอบตัวเลือก').click();
 expect( await page.getByRole('combobox', { name: 'ทดสอบตัวเลือก' })).toBeVisible()
  
   
});

test('CRM_CT00071	การเลือกข้อมูลช่อง Multi Dropdown"" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
   await contact.goto();
   await contact.btnCreateContact.click()
   await contact.btn_address.click();
    await page.locator('#dyn_JEFOkL > .p-inputtext').click();
    await page.waitForTimeout(3000)
  await page.getByRole('option', { name: 'Level1-1' }).click();
  await page.waitForTimeout(3000)
  await page.locator('#dyn_ds1WmD > .p-inputtext').click();
  await page.waitForTimeout(3000)
  await page.getByRole('option', { name: 'Level2-1-' }).click();
  await page.waitForTimeout(3000)
  await page.locator('#dyn_kGCQa0 > .p-inputtext').click();
  await page.waitForTimeout(3000)
  await page.getByRole('option', { name: 'Level3-1-1' }).click();
  await page.waitForTimeout(3000)
  await page.locator('#dyn_Rtp6MP > .p-inputtext').click();
  await page.waitForTimeout(3000)
  await page.getByRole('option', { name: 'Level 4_3_1_1' }).click();
  await page.waitForTimeout(3000)
  await page.locator('#dyn_BI5q7i > .p-inputtext').click();
  await page.waitForTimeout(3000)
  await page.getByRole('option', { name: 'Level 5_4_3_2_1' }).click();
  await page.waitForTimeout(3000)
  await page.locator('#dyn_fKpu0q > .p-inputtext').click();
  await page.waitForTimeout(3000)
  await page.getByRole('option', { name: 'Level 6_5_4_3_1_1' }).click();
 
  expect (await page.getByRole('combobox', { name: 'Level1-' })).toBeVisible()
  expect (await page.getByRole('combobox', { name: 'Level2-1-' })).toBeVisible()
  expect (await page.getByRole('combobox', { name: 'Level3-1-' })).toBeVisible()
  expect (await page.getByRole('combobox', { name: 'Level 4_3_1_1' })).toBeVisible()
  expect (await page.getByRole('combobox', { name: 'Level 5_4_3_2_1' })).toBeVisible()
  expect (await page.getByRole('combobox', { name: 'Level 6_5_4_3_1_1' })).toBeVisible()
});
test('CRM_CT00072	การใส่ข้อมูลช่อง Text Input" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   
   await contact.inputName.fill('ทดสอบ')
   await expect(contact.inputName).toHaveValue('ทดสอบ');
    
});
test('CRM_CT00073	"การใส่ข้อมูลช่อง Text Input กรณีใส่ Text Input ความยาวตัวอักษร สูงสุด 10 The maximum length allowed is 10"" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   
   await contact.inputName.fill('ทดสอบsadsadsddd11')
   expect (await page.getByText('Name *The maximum length')).toBeVisible()
  
    
});
test('CRM_CT00074	"การใส่ข้อมูลช่อง Text Input กรณีีไม่ใส่ Text Input Value is required""" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.getByRole('button', { name: 'Create', exact: true }).click();
  expect (await page.getByText('Name *Value is required')).toBeVisible()
   
});
test('CRM_CT00075	"การใส่ข้อมูลช่อง Data Masking " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   await page.locator('#dyn_datamasking').nth(1).fill('*****32323131');
const text = await page.locator('#dyn_datamasking').nth(1).inputValue();
await expect(text).toBe('*****32323131');
});
test('CRM_CT00076	"การติ๊กเลือกRadio Button " " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.getByRole('radio', { name: 'value2' }).check();
    const radioLabel = page.getByLabel('value2'); // Playwright จับ input ที่ for="dyn_radiobtn_1"
    await expect(radioLabel).toBeChecked();
    
});

test('CRM_CT00077	"การติ๊กเลือกCheckbox " " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.pause()
    await page.locator('#dyn_chkbox').nth(1).click()
   const isChecked = await page.locator('#dyn_chkbox').nth(1).isChecked();
console.log(isChecked); // true or false
expect(isChecked).toBe(true);

    
});

test('CRM_CT00078	การใส่รูปภาพ Image   Fail  " " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.pause()
    await page.locator('#dyn_chkbox').nth(1).click()
   const isChecked = await page.locator('#dyn_chkbox').nth(1).isChecked();
console.log(isChecked); // true or false
expect(isChecked).toBe(true);

    
});
test('CRM_CT00079	การใส่ข้อมูลวันที่และเวลา Date Time  " " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   await page.pause()
    await page.getByRole('combobox', { name: 'datetime', exact: true }).click();
    await contact.input_Field({DateTime: '2025-11-20 17:09'})
    const datetime = await page.getByRole('combobox', { name: 'datetime', exact: true }).getAttribute('value');
    expect(datetime).toBe('2025-11-20 17:09')
});
test('CRM_CT00080	การใส่ข้อมูลวันที่ Date " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.getByRole('combobox', { name: 'date of birth', exact: true }).click();
   
    await page.getByRole('combobox', { name: 'date of birth', exact: true }).fill('2025-11-24')
    
    const datetime = await page.getByRole('combobox', { name: 'date of birth', exact: true }) .getAttribute('value');
    console.log("date time"  , datetime);
    
// expect(dob).toBe("2025-11-18");
    
   
    
});
test('CRM_CT00081	การใส่ข้อมูลเวลา Time " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
await page.getByRole('combobox', { name: 'Time', exact: true }).fill('17:18')
   const datetime =  await page.getByRole('combobox', { name: 'Time', exact: true }) .getAttribute('value');
 
    expect(datetime).toBe('17:8')
});
test('CRM_CT00082	ฺปุ่มกดลิ้งค์ไปหน้าอื่น Button " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   
  
    await page.getByRole('button', { name: 'btntest' }).click()
    await expect(page).toHaveURL(/google\.com/);
   
});
test('CRM_CT00083	"การเลือกกลุ่มและข้อมูลในกลุ่มที่เลือก จะแสดงก็ต่อเมื่อมีการเปลี่ยนแปลง Segment" " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   await page.pause()
    
  await page.getByRole('textbox', { name: 'segment', exact: true }).fill('ทดสอบ Segment');
  expect (await page.locator('#dyn_text_segment')).toBeVisible()
 
   
});

test('CRM_CT00084	การเลือกใส่ข้อมูลในกลุุ่่ม Group " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.getByRole('radio', { name: '2', exact: true }).click()
    const radio2 = page.locator('input[type="radio"][value="2"]');

  await page.locator('#dyn_iu').click()
  await page.getByRole('option', { name: '2', exact: true }).click();
  const ddl_value = await page.getByRole('combobox', { name: '2', exact: true })
  await expect(ddl_value).toBeVisible()
  await expect(radio2).toBeChecked();
  await page.locator('#dyn_text_group').fill('ทดสอบ Group')
   const text_group =  await page.locator('#dyn_text_group').getAttribute('value');
  expect(text_group).toBe('ทดสอบ Group')
 
//   expect (await page.getByText('button *1234')).toBeVisible()
//  expect( await page.getByText('drop *No results found')).toBeVisible()
   
});

test('CRM_CT00085	การค้นหาข้อมูล Search    ===== Fail อยู่" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.getByRole('radio', { name: '2', exact: true }).click()
    const radio2 = page.locator('input[type="radio"][value="2"]');

  await page.locator('#dyn_iu').click()
  await page.getByRole('option', { name: '2', exact: true }).click();
  const ddl_value = await page.getByRole('combobox', { name: '2', exact: true })
  await expect(ddl_value).toBeVisible()
  await expect(radio2).toBeChecked();
  await page.locator('#dyn_text_group').fill('ทดสอบ Group')
   const text_group =  await page.locator('#dyn_text_group').getAttribute('value');
  expect(text_group).toBe('ทดสอบ Group')
  await page.pause()
//   expect (await page.getByText('button *1234')).toBeVisible()
//  expect( await page.getByText('drop *No results found')).toBeVisible()
   
});
test('CRM_CT00086	"การสร้างเนื้อหาแจ้งเตือน การอัปโหลด Attach File สามารถอัปโหลดได้สูงสุด 10 ไฟล์และขนาดไฟล์ทั้งหมดไม่เกิน 5 MB "" ', async ({ page  }) => {
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
   
   await page.pause()
//   expect (await page.getByText('button *1234')).toBeVisible()
//  expect( await page.getByText('drop *No results found')).toBeVisible()
   
});

test('CRM_CT00089	"การสร้างเนื้อหา อัปโหลด Attach File (Type DOC) ขนาดไฟล์ไม่เกิน5MB"" "" ', async ({ page  }) => {
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
test('CRM_CT00090	"การสร้างเนื้อหา อัปโหลด Attach File (Type DOC) กรณีขนาดไฟล์เกิน5MB" "" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.pause()
   await page.setInputFiles('input[type="file"]', [
  
  'tests/file_update-test/doc-test.doc',

   ]);
    expect(await page.getByText('ขนาดไฟล์ไม่เกิน 5 Mb')).toBeVisible()
   
//   expect (await page.getByText('button *1234')).toBeVisible()
//  expect( await page.getByText('drop *No results found')).toBeVisible()
   
});

test('CRM_CT00091	"การสร้างเนื้อหา อัปโหลด Attach File (Type DOCX) ขนาดไฟล์ไม่เกิน5MB " " ', async ({ page  }) => {
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
test('CRM_CT00092	"การสร้างเนื้อหา อัปโหลด Attach File (Type DOCX) กรณีขนาดไฟล์เกิน5MB " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   await page.setInputFiles('input[type="file"]', [
  'tests/file_update-test/docx-13mb.docx',
   ]);
   await page.waitForTimeout(2000)
 expect(await page.getByText('ขนาดไฟล์ไม่เกิน 5 Mb')).toBeVisible()
});
test('CRM_CT00093	"การสร้างเนื้อหา อัปโหลด Attach File (Type XLS) ""ขนาดไฟล์ไม่เกิน5MB " ', async ({ page  }) => {
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
test('CRM_CT00094	"การสร้างเนื้อหา อัปโหลด Attach File (Type XLS) ""กรณีขนาดไฟล์เกิน5MB"" " " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.setInputFiles('input[type="file"]', [
  'tests/file_update-test/xls-15mb.xls',
   ]);
   await page.waitForTimeout(2000)
 expect(await page.getByText('ขนาดไฟล์ไม่เกิน 5 Mb')).toBeVisible()
});

test('CRM_CT00095	"การสร้างเนื้อหา อัปโหลด Attach File (Type XLSX) ""ขนาดไฟล์ไม่เกิน5MB"" " " ', async ({ page  }) => {
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
test('CRM_CT00096	"การสร้างเนื้อหา อัปโหลด Attach File (Type XLSX) ""กรณีขนาดไฟล์เกิน5MB"" "" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.setInputFiles('input[type="file"]', [
  'tests/file_update-test/11mb.xlsx',
   ]);
   await page.waitForTimeout(2000)
 expect(await page.getByText('ขนาดไฟล์ไม่เกิน 5 Mb')).toBeVisible()
});

test('CRM_CT00097	"การสร้างเนื้อหา อัปโหลด Attach File (Type CSV) ""ขนาดไฟล์ไม่เกิน5MB"" " " ', async ({ page  }) => {
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
test('CRM_CT00098	"การสร้างเนื้อหา อัปโหลด Attach File (Type CSV) ""กรณีขนาดไฟล์เกิน5MB"" "" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.setInputFiles('input[type="file"]', [
  'tests/file_update-test/6mb.csv',
   ]);
   await page.waitForTimeout(2000)
 expect(await page.getByText('ขนาดไฟล์ไม่เกิน 5 Mb')).toBeVisible()
});
test('CRM_CT00099	"การสร้างเนื้อหา อัปโหลด Attach File (Type PNG) ""ขนาดไฟล์ไม่เกิน5MB"" " " ', async ({ page  }) => {
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
test('CRM_CT00100	"การสร้างเนื้อหา อัปโหลด Attach File (Type PNG) ""กรณีขนาดไฟล์เกิน5MB"" " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.setInputFiles('input[type="file"]', [
  'tests/file_update-test/12mb.png',
   ]);
   await page.waitForTimeout(2000)
 expect(await page.getByText('ขนาดไฟล์ไม่เกิน 5 Mb')).toBeVisible()
});
test('CRM_CT00101	"การสร้างเนื้อหา อัปโหลด Attach File (Type JPG) ""ขนาดไฟล์ไม่เกิน5MB"" " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
   await page.setInputFiles('input[type="file"]', [
  'tests/file_update-test/jpg-test.jpg',
   ]);
    const items = page.locator('.filepond--item');
   const expectedFiles = [
  'jpg-test.jpg',
];
await expect(items).toHaveCount(expectedFiles.length);
// 2. ดึงชื่อไฟล์ทั้งหมดจากหน้าเว็บ
const fileNames = await page.locator('.filepond--file-info-main').allTextContents();
// 3. ตรวจสอบชื่อไฟล์ว่าตรงกับ expected หรือไม่
expect(fileNames).toEqual(expectedFiles);
});
test('CRM_CT00102	"การสร้างเนื้อหา อัปโหลด Attach File (Type JPG) ""กรณีขนาดไฟล์เกิน5MB"" " ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.setInputFiles('input[type="file"]', [
  'tests/file_update-test/jpg-15mb.jpg',
   ]);
   await page.waitForTimeout(2000)
 expect(await page.getByText('ขนาดไฟล์ไม่เกิน 5 Mb')).toBeVisible()
});

test('CRM_CT00103	"การสร้างเนื้อหา อัปโหลด Attach File (Type JPEG) ""ขนาดไฟล์ไม่เกิน5MB"" " ', async ({ page  }) => {
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
test('CRM_CT00104	"การสร้างเนื้อหา อัปโหลด Attach File (Type JPEG) ""กรณีขนาดไฟล์เกิน5MB""" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
    await page.setInputFiles('input[type="file"]', [
  'tests/file_update-test/jpeg-20mb.jpeg',
   ]);
   await page.waitForTimeout(2000)
 expect(await page.getByText('ขนาดไฟล์ไม่เกิน 5 Mb')).toBeVisible()
});
test('CRM_CT00105	"การสร้างเนื้อหา ปุ่มกด X Remove File " ', async ({ page  }) => {
  
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
test('CRM_CT00107	การจดบันทึก Note ', async ({ page  }) => {
  
  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await contact.btnCreateContact.click();
const input = page.locator('input.p-inputtext');
await expect(input).toBeDisabled();

 
});

test('CRM_CT00108	ยกเลิกการสร้าง (ปุ่มCancel) ', async ({ page  }) => {
  
  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await contact.btnCreateContact.click();
  await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByText('ทดสอบ SectionName *ทดสอบ')).not.toBeVisible();
  await page.pause()

 
});


test('CRM_CT00109	การสร้างลูกค้า Contact (ปุ่มCreate) ', async ({ page  }) => {
  
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
test('CRM_CT00110	การส่งออกข้อมูลลูกค้า (ปุ่มExport)', async ({ page  }) => {

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

test('CRM_CT00111	"ติ๊กกล่องเลือกข้อมูล Contact สำหรับลบรายชื่อลูกค้า (ปุ่มDelete Contact)"', async ({ page  }) => {

  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await page.waitForTimeout(5000)
  await verifyTopTableRow(page,{CheckDelete:contactData.Name})
})
test('CRM_CT00114	การเข้าชมข้อมูลลูกค้า (View Contact) ========== Fail', async ({ page  }) => {

  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await verifyTopTableRow(page,{CheckView:contactData.Name})
  await page.pause()

expect(await contact.inputName.inputValue()).toBe(contactData.Name);
await page.pause()
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
expect(await contact.addressNo.inputValue()).toBe(contactData.Address_no);






})

test('CRM_CT00115	การแก้ไขข้อมูลลูกค้า (Edit Contact)', async ({ page  }) => {

  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await verifyTopTableRow(page,{CheckEdit:contactData.Name})
  
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

test('CRM_CT00116	การแก้ไขช่องใส่ Name', async ({ page  }) => {

  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await verifyTopTableRow(page,{CheckEdit:contactData.Name})
  await contact.inputName.fill(contactData.Change_name)
  await contact.btnUpdate.click()
  await contact.btnconfirm_update.click()
  await page.waitForTimeout(3000)
  await verifyTopTableRow(page,{Name:contactData.Change_name})
  
})
test('CRM_CT00117	"การแก้ไขช่องใส่ Name กรณีไม่ใส่ช้อมูล Name"', async ({ page  }) => {

  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await verifyTopTableRow(page,{CheckEdit:contactData.Name})
  await contact.inputName.fill('')
  await expect(contact.error_msg_empty).toBeVisible()
  
})


test.only('CRM_CT00118	การแก้ไขช่องใส่ Phone', async ({ page  }) => {

  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await verifyTopTableRow(page,{CheckEdit:contactData.Name})
  await contact.inputPhone.fill(contactData.Change_phone)
  await contact.btnUpdate.click()
  await contact.btnconfirm_update.click()
  await page.pause()
  await page.waitForTimeout(3000)
  await verifyTopTableRow(page,{Phone:contactData.Change_phone})
  
})
test('CRM_CT0119	"การแก้ไขช่องใส่ Phone กรณีใส่ตัวอักษรหรืออักขระพิเศษ""', async ({ page  }) => {

  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await verifyTopTableRow(page,{CheckEdit:contactData.Name})
  await contact.inputPhone.fill('!!!@#@#')
  await expect(contact.error_msg_val).toBeVisible()
  
})
test('CRM_CT00120	"การแก้ไขช่องใส่ Phone กรณีีไม่ใส่ข้อมูล"', async ({ page  }) => {

  const contact = new Element_Create_Contact(page);  
  await contact.goto();
  await verifyTopTableRow(page,{CheckEdit:contactData.Name})
  await contact.inputPhone.fill('')
  await expect(contact.error_msg_val).toBeVisible()
  
})