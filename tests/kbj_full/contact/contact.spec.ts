import test, { expect, Page, APIRequestContext } from "@playwright/test";
import { BaseUrl, ContactPage } from "../../utils";
import { Element_Contact } from "./Elemenet_Contact";
import { FillInputContactForm, ContactFormFields } from "./FillForm";
import { ContactAPI } from "./Global_function";
import { Element_Create_Contact } from "./Create_Element";

// function กรอกข้อมูล auto

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
test.only('CRM_CT00065	กรณีค้นหา ตำบล/แขวง ต้องใส่ตัวอักษรที่อยู่ในdropdown ข้อมูลสถานที่ถึงแสดง" ', async ({ page  }) => {
   const contact = new Element_Create_Contact(page);  
    await contact.goto();
    await contact.btnCreateContact.click()
     
   await contact.btn_address.click();
   await page.waitForTimeout(1000)
    await page.getByRole('combobox', { name: 'ค้นหา ตำบล/แขวง' }).fill('หลักสอง');
 
    await page.waitForTimeout(1000)
       await page.locator('.grid.grid-cols-2 > div:nth-child(2) > #dropdownEl > .relative > .w-8').click()
  await page.getByText('หลักสอง » บางแค » กรุงเทพมหานคร »').click();
   await page.pause()
   
   

});