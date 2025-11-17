import { Page, APIRequestContext, expect } from "@playwright/test";
import {FillInputContactForm, ContactFormFields} from "./FillForm";
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
    Datamasking ?: string;
};

export class ContactAPI {
  static token = "iAS-MNCCXmyR4FhYh-a1W0EPuoMB-TufSUIfGBDDoU9CGCwnMgGSvskX2fI66B3AJAzgBsqJkhJNbudXXNSVe21ryezfaOBmV8Ecr2u5VloksgiM"; // <<-- คุณใส่ token ไว้ที่นี่ครั้งเดียว

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
    if (params.Address_no) apiParams["data.address.no"] = params.Address_no;
    if (params.Address_district) apiParams["data.address.district"] = params.Address_district;
    if (params.Address_subdistrict) apiParams["data.address.subdistrict"] = params.Address_subdistrict;
    if (params.Address_province) apiParams["data.address.province"] = params.Address_province;
    if (params.Address_zipcode) apiParams["data.address.zipcode"] = params.Address_zipcode;
    if (params.Dropdown_value) apiParams["data.dropdownkey"] = params.Dropdown_value;
    if (params.Dropdown_mutlple_lv1) apiParams["data.JEFOkL"] = params.Dropdown_mutlple_lv1;
    if(params.Dropdown_mutlple_lv2) apiParams["data.ds1WmD"] = params.Dropdown_mutlple_lv2;
    if(params.Dropdown_mutlple_lv3) apiParams["data.kGCQa0"] = params.Dropdown_mutlple_lv3;
    if(params.Dropdown_mutlple_lv4) apiParams["data.Rtp6MP"] = params.Dropdown_mutlple_lv4;
    if(params.Dropdown_mutlple_lv5) apiParams["data.BI5q7i"] = params.Dropdown_mutlple_lv5;
    if(params.Dropdown_mutlple_lv6) apiParams["data.fKpu0q"] = params.Dropdown_mutlple_lv6;
    if(params.Datamasking) apiParams["data.datamasking"] = params.Datamasking;   
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

    const json = await apiResponse.json();
    console.log(json);
    
    const raw = json?.data?.data ?? [];
console.log(raw);
    return raw.map((item: any) => ({
      Name: item.name,
      NationalID: item.national_id,
      CustomerID: item.customer_id,
      Email: item.email,
      CaseBasic: item.case_basic,
      Phone: item.phone,
        Address_no: item.address?.no,
        Address_district: item.address?.district,
        Address_subdistrict: item.address?.subdistrict,
        Address_province: item.address?.province,
        Address_zipcode: item.address?.zipcode,
        Dropdown_value: item.dropdownkey,
        Dropdown_mutlple_lv1: item.JEFOkL,
        Dropdown_mutlple_lv2: item.ds1WmD,
        Dropdown_mutlple_lv3: item.kGCQa0,
        Dropdown_mutlple_lv4: item.fKpu0q,
        Dropdown_mutlple_lv5: item.BI5q7i,
        Dropdown_mutlple_lv6: item.Rtp6MP,
        Datamasking : item.datamasking,
    })) as ContactFormFields[];
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
        Dropdown_mutlple_lv1: form.Dropdown_mutlple_lv1,
        Dropdown_mutlple_lv2: form.Dropdown_mutlple_lv2,
        Dropdown_mutlple_lv3: form.Dropdown_mutlple_lv3,
        Dropdown_mutlple_lv4: form.Dropdown_mutlple_lv4,
        Dropdown_mutlple_lv5: form.Dropdown_mutlple_lv5,
        Dropdown_mutlple_lv6: form.Dropdown_mutlple_lv6,
        Datamasking : form.Datamasking,
        
    });

    // 2) เปิดหน้า
    await page.goto("/contact");

    // 3) เปิด filter
    await page.getByRole("button", { name: "Search" }).nth(2).click();

    // 4) กรอก form
    await FillInputContactForm(page, form);

    // 5) clear date
    await page.getByRole("combobox", { name: "Select Start Datetime" }).click();
    await page.getByLabel("Clear").click();
    await page.getByRole("combobox", { name: "Select End Datetime" }).click();
    await page.getByLabel("Clear").click();

    // 6) Search
    await page.getByRole("button", { name: "Search" }).first().click();

    // 7) Verify row
    for (const row of contacts) {
      const rowName = [
        row.Name,
        row.NationalID,
        row.CustomerID,
        row.Email,
        row.CaseBasic,
        row.Phone,
        row.Address_no,
        row.Address_district,
        row.Address_subdistrict,
        row.Address_province,
        row.Address_zipcode,
        row.Dropdown_value , 
        row.Dropdown_mutlple_lv1,
        row.Dropdown_mutlple_lv2,
        row.Dropdown_mutlple_lv3,
        row.Dropdown_mutlple_lv4,
        row.Dropdown_mutlple_lv5,
        row.Dropdown_mutlple_lv6,
        row.Datamasking
      ]
        .filter(Boolean)
        .join(" ");
      
      
      const rows = page.getByRole("row", { name: rowName });
    expect(await rows.count()).toBeGreaterThan(0);
     
    }
  }
}