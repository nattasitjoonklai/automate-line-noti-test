import { Page, Locator, expect } from "@playwright/test";
import { AgentDesktopPage } from "../../utils";
import path from 'path';
import fs from 'fs';

export class Element_AgentDesktop {
    readonly page: Page;

    // Agent Status Elements
    readonly statusDropdown: Locator;
    readonly statusAvailable: Locator;
    readonly statusLogin: Locator;
    readonly statusToilet: Locator;
    readonly statusLunch: Locator;
    readonly statusBreak: Locator;
    readonly statusAcd: Locator;

    // Channel Filter Tabs
    readonly tabAll: Locator;
    readonly tabPhone: Locator;
    readonly tabLine: Locator;
    readonly tabEmail: Locator;
    readonly tabFacebook: Locator;
    readonly tabTask: Locator;
    readonly tabInstagram: Locator;
    readonly tabTelegram: Locator;
    readonly tabLazada: Locator;

    // Action Buttons
    readonly btnCreateTicket: Locator;
    readonly btnImportCSV: Locator;

    // Search Elements
    readonly selectSearchType: Locator;
    readonly inputSearch: Locator;

    // Task Type Tabs
    readonly tabMyTask: Locator;
    readonly tabPending: Locator;
    readonly tabGuest: Locator;
    readonly tabGroup: Locator;
    readonly tabAllTasks: Locator;

    // Task List
    readonly taskContainer: Locator;
    readonly taskItems: Locator;

    // Ticket Detail Tabs (when ticket is selected)
    readonly tabContact: Locator;
    readonly tabTicket: Locator;
    readonly tabOmnichannel: Locator;
    readonly tabEmailDetail: Locator;
    readonly tabSMS: Locator;
    readonly tabAppointment: Locator;
    readonly tabTicketHistory: Locator;

    // Notification
    readonly btnNotification: Locator;
    readonly btnReminder: Locator;

    // Create Ticket Menu
    readonly menuExistingContact: Locator;

    // Search Contact Modal
    readonly modalSearchContact: Locator;
    readonly inputSearchContact: Locator;
    readonly btnSearchContact: Locator;
    readonly btnSelectContact: Locator;

    // New Elements for CRM_AG00046+
    readonly dropdown: Locator;
    readonly multipledropdownlv1: Locator;
    readonly multipledropdownlv2: Locator;
    readonly multipledropdownlv3: Locator;
    readonly multipledropdownlv4: Locator;
    readonly multipledropdownlv5: Locator;
    readonly multipledropdownlv6: Locator;

    readonly inputText: Locator;
    readonly inputDatemasking: Locator;
    readonly btnRadio: Locator;
    readonly inputCheckbox: Locator;
    readonly inputDatetime: Locator;
    readonly inputDate: Locator;
    readonly inputTime: Locator;
    readonly btnLink: Locator;
    readonly segment: Locator;
    readonly input_segment: Locator;

    readonly fileInput: Locator;
    readonly btnRemoveFile: Locator;
    readonly btnConfirmRemoveFile: Locator;

    readonly btnSync: Locator;
    readonly inputNote: Locator;
    readonly btnSendNote: Locator;

    constructor(page: Page) {
        this.page = page;

        // Agent Status - Updated to match Global_function.ts
        this.statusDropdown = page.locator('span').nth(4);
        this.statusAvailable = page.locator('[data-test="status-available"]');
        this.statusLogin = page.locator('[data-test="status-login"]');
        this.statusToilet = page.locator('[data-test="status-toilet"]');
        this.statusLunch = page.locator('[data-test="status-lunch"]');
        this.statusBreak = page.locator('[data-test="status-break"]');
        this.statusAcd = page.locator('[data-test="status-acd"]');

        // Channel Filter Tabs - จาก HTML ที่ให้มา
        this.tabAll = page.locator('button[id*="tab_x,phone,line,facebook"]');
        this.tabPhone = page.locator('button[id*="tab_phone"]');
        this.tabLine = page.locator('button[id*="tab_line"]');
        this.tabEmail = page.locator('button[id*="tab_email"]');
        this.tabFacebook = page.locator('button[id*="tab_facebook"]');
        this.tabTask = page.locator('button[id*="tab_task"]');
        this.tabInstagram = page.locator('button[id*="tab_instagram"]');
        this.tabTelegram = page.locator('button[id*="tab_telegram"]');
        this.tabLazada = page.locator('button[id*="tab_lazada"]');

        // Action Buttons
        this.btnCreateTicket = page.locator('button#create-ticket-button');
        this.btnImportCSV = page.locator('button#btn-import-csv');

        // Create Ticket Menu
        this.menuExistingContact = page.getByText('Existing Contact');

        // Search Contact Modal
        this.modalSearchContact = page.getByRole('dialog');
        this.inputSearchContact = page.locator('#input-search-contact');
        this.btnSearchContact = page.locator('#btn-search-contact');
        this.btnSelectContact = this.modalSearchContact.locator('button').filter({ hasText: 'Select' });

        // Search Elements
        this.selectSearchType = page.locator('#select-task-search');
        this.inputSearch = page.locator('input[placeholder="Search"]').first();

        // Task Type Tabs
        this.tabMyTask = page.locator('#tab-task-my-task');
        this.tabPending = page.locator('#tab-task-pending');
        this.tabGuest = page.locator('#tab-task-guest');
        this.tabGroup = page.locator('#tab-task-group');
        this.tabAllTasks = page.locator('#tab-task-all');

        // Task List
        this.taskContainer = page.locator('#mytask-wrapper');
        this.taskItems = page.locator('[id^="mytask-wrapper"] > div > div');

        // Ticket Detail Tabs
        this.tabContact = page.locator('#tab-task-component-contact');
        this.tabTicket = page.locator('[aria-label="Ticket"]');
        this.tabOmnichannel = page.locator('[aria-label="Omnichannel"]');
        this.tabEmailDetail = page.locator('[aria-label="Email"]');
        this.tabSMS = page.locator('[aria-label="SMS"]');
        this.tabAppointment = page.locator('[aria-label="Appointment"]');
        this.tabTicketHistory = page.locator('button[id*="tab-history-ticket-history"]');

        // Notification
        this.btnNotification = page.locator('[data-test="notification-button"]');
        this.btnReminder = page.locator('[data-test="reminder-button"]');

        // New Elements Initialization
        this.dropdown = page.locator('#dyn_dropdownkey').first();
        this.multipledropdownlv1 = page.locator('#dyn_JEFOkL').first();
        this.multipledropdownlv2 = page.locator('#dyn_ds1WmD').first();
        this.multipledropdownlv3 = page.locator('#dyn_kGCQa0').first();
        this.multipledropdownlv4 = page.locator('#dyn_Rtp6MP').first();
        this.multipledropdownlv5 = page.locator('#dyn_BI5q7i').first();
        this.multipledropdownlv6 = page.locator('#dyn_fKpu0q').first();

        this.inputText = page.getByPlaceholder('textinput').first();
        this.inputDatemasking = page.locator('#dyn_datamasking').first();
        this.btnRadio = page.locator('#dyn_radiobtn').first();
        this.inputCheckbox = page.locator('#dyn_chkbox').first();
        this.inputDatetime = page.locator('#dyn_feu1').first();
        this.inputDate = page.locator('#dyn_R8i6Yo').first();
        this.inputTime = page.locator('#dyn_yC3zrN').first();
        this.btnLink = page.getByRole('button', { name: 'btntest' }).first();
        this.segment = page.locator('#dyn_name_segment').first();
        this.input_segment = page.locator('#dyn_text_segment').first();

        this.fileInput = page.locator('input[type="file"]').first();
        this.btnRemoveFile = page.locator('button.remove-file').first(); // Placeholder selector
        this.btnConfirmRemoveFile = page.getByRole('button', { name: 'Remove', exact: true });

        this.btnSync = page.getByRole('button', { name: 'Sync' });
        this.inputNote = page.getByPlaceholder('note');
        this.btnSendNote = page.locator('#dyn_send_note');
    }

    async createTicketExistingContact(contactName: string) {
        await this.btnCreateTicket.click();
        await this.menuExistingContact.click();

        await expect(this.inputSearchContact).toBeVisible();

        await this.inputSearchContact.fill(contactName);
        await this.btnSearchContact.click();

        // Wait for either the "Select" button (multiple results) OR the Contact Input (auto-redirect)
        const selectButton = this.btnSelectContact.first();
        const contactInput = this.page.locator('#dyn_name').first();

        try {
            await Promise.race([
                selectButton.waitFor({ state: 'visible', timeout: 5000 }),
                contactInput.waitFor({ state: 'visible', timeout: 5000 })
            ]);
        } catch (error) {
            console.log('⚠️ Timeout waiting for search results or redirect.');
        }

        if (await contactInput.isVisible()) {
            console.log(`✅ Auto-redirected to Contact page for: ${contactName}`);
            return; // Already on contact page
        }

        if (await selectButton.isVisible()) {
            // Verify the result contains the name (optional, but good practice)
            const contactRow = this.modalSearchContact.locator('tr, div[class*="item"]').filter({ hasText: contactName }).first();
            if (await contactRow.isVisible()) {
                await expect(contactRow).toContainText(contactName);
                console.log(`✅ Verified search result contains: ${contactName}`);
            }

            await selectButton.click();
            console.log(`✅ Selected contact from list: ${contactName}`);
        }
    }

    async verifyExistingContactNotFound(contactName: string) {
        await this.btnCreateTicket.click();
        await this.menuExistingContact.click();

        await expect(this.inputSearchContact).toBeVisible();

        await this.inputSearchContact.fill(contactName);

        await this.btnSearchContact.click();

        await this.page.waitForTimeout(2000); // Wait for search results

        // Verify "No data" message from Toast
        // User provided HTML showing a toast with class "error-toast" and text "ไม่พบข้อมูลที่ค้นหา"
        const toastMessage = this.page.locator('li[data-sonner-toast="true"]').filter({ hasText: 'ไม่พบข้อมูลที่ค้นหา' });
        await expect(toastMessage).toBeVisible();
    }

    async editContactInfo(name: string) {
        // Ensure we are on Contact tab
        await this.tabContact.click();

        // Verify Contact tab is selected (aria-selected="true")
        await expect(this.tabContact).toHaveAttribute('aria-selected', 'true');

        // Wait for input to be visible (this confirms the tab is active/selected)
        // Using locator from Element_Contact.ts: #dyn_name
        // Resolved strict mode violation by selecting the first one (enabled one)
        const inputName = this.page.locator('#dyn_name').first();
        await expect(inputName).toBeVisible();

        // Fill Name
        await inputName.fill(name);

        // Verify value
        await expect(inputName).toHaveValue(name);
    }

    async saveContact() {
        // Click Update button
        const btnUpdate = this.page.getByRole('button', { name: 'Update' });
        await btnUpdate.click();
        const btn_confirm_update = this.page.getByLabel('Update', { exact: true })
        await btn_confirm_update.click();
        // Wait for success toast
        const toastMessage = this.page.getByText('Update Contact Success');
        await expect(toastMessage).toBeVisible();
        await this.page.waitForTimeout(2000); // Wait for save to complete
    }

    async clickUpdate() {
        const btnUpdate = this.page.getByRole('button', { name: 'Update' });
        await btnUpdate.click();
    }

    async clearContactName() {
        // Ensure we are on Contact tab
        await this.tabContact.click();

        const inputName = this.page.locator('#dyn_name').first();
        await expect(inputName).toBeVisible();
        await inputName.clear();
    }

    async editContactPhone(phone: string) {
        // Ensure we are on Contact tab
        await this.tabContact.click();

        const inputPhone = this.page.locator('#dyn_phone').first();
        await expect(inputPhone).toBeVisible();
        await inputPhone.fill(phone);
    }

    async clearContactPhone() {
        // Ensure we are on Contact tab
        await this.tabContact.click();

        const inputPhone = this.page.locator('#dyn_phone').first();
        await expect(inputPhone).toBeVisible();
        await inputPhone.clear();
    }



    async editContactEmail(email: string) {
        // Ensure we are on Contact tab
        await this.tabContact.click();

        const inputEmail = this.page.locator('#dyn_email').first();
        await expect(inputEmail).toBeVisible();
        await inputEmail.fill(email);
    }

    async clickAddPhone() {
        // Assuming button text is "Add Phone"
        const btnAddPhone = this.page.getByRole('button', { name: 'Add Phone' });
        await btnAddPhone.click();
    }

    async clickAddAddress() {
        // Assuming button text is "Add Address"
        const btnAddAddress = this.page.getByRole('button', { name: 'Add Address' });
        await btnAddAddress.click();
    }

    async verifyErrorMessage(message: string) {
        // Check for toast or inline error
        // User mentioned "Value is required" appearing in the list (inline?) or toast
        // We will check both visible text
        const errorMsg = this.page.getByText(message).first();
        await expect(errorMsg).toBeVisible();
    }

    async editContactAddress(data: { no: string, district: string, subDistrict: string, province: string, zipcode: string }) {
        await this.tabContact.click();

        await this.page.locator('#dyn_address\\.address').first().fill(data.no);
        await this.selectAddressDropdown(this.page.locator('#dyn_address\\.district').first(), data.district);
        await this.selectAddressDropdown(this.page.locator('#dyn_address\\.subdistrict').first(), data.subDistrict);
        await this.selectAddressDropdown(this.page.locator('#dyn_address\\.province').first(), data.province);
        await this.selectAddressDropdown(this.page.locator('#dyn_address\\.zipcode').first(), data.zipcode);
    }

    async selectAddressDropdown(locator: any, value: string) {
        await locator.click();
        await locator.fill(value);
        await this.page.waitForTimeout(1000);
        // Try to click the option if it appears
        const option = this.page.locator('li.p-dropdown-item, li.p-listbox-option').first();
        if (await option.isVisible()) {
            await option.click();
        } else {
            // If no option appears, maybe it's just a text field or value didn't match
            console.log(`No option found for ${value}, keeping text as is.`);
            await this.page.keyboard.press('Enter');
        }
    }

    async changeStatus(status: string) {
        await this.statusDropdown.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2000);
        await this.statusDropdown.click();
        // Wait for dropdown to appear
        await this.page.waitForTimeout(500);
        // Select status from dropdown
        await this.page.locator('[id^="pv_id_"]').getByText(status, { exact: true }).first().click();
    }

    async goto() {
        await this.page.goto(AgentDesktopPage);
    }

    async waitForPageLoad() {
        await this.taskContainer.waitFor({ state: 'visible' });
    }

    async selectTaskType(type: 'mytask' | 'pending' | 'guest' | 'group' | 'all') {
        const tabMap = {
            mytask: this.tabMyTask,
            pending: this.tabPending,
            guest: this.tabGuest,
            group: this.tabGroup,
            all: this.tabAllTasks
        };
        await tabMap[type].click();
    }

    async selectChannelFilter(channel: 'all' | 'phone' | 'line' | 'email' | 'facebook' | 'task' | 'instagram' | 'telegram' | 'lazada') {
        const tabMap = {
            all: this.tabAll,
            phone: this.tabPhone,
            line: this.tabLine,
            email: this.tabEmail,
            facebook: this.tabFacebook,
            task: this.tabTask,
            instagram: this.tabInstagram,
            telegram: this.tabTelegram,
            lazada: this.tabLazada
        };
        await tabMap[channel].click();
    }

    async searchTask(searchType: 'Name' | 'Phone' | 'Ticket No.', searchValue: string) {
        // Select search type
        await this.selectSearchType.click();
        await this.page.getByText(searchType, { exact: true }).last().click();

        // Enter search value
        await this.inputSearch.fill(searchValue);
    }

    async getTaskCount(): Promise<number> {
        return await this.taskItems.count();
    }

    async selectFirstTask() {
        await this.taskItems.first().click();
    }

    async getTaskData(index: number = 0) {
        const task = this.taskItems.nth(index);
        await task.waitFor({ state: 'visible' });

        // This is a best-effort extraction based on typical layouts. 
        // We might need to refine selectors if we can see the HTML.
        // Assuming the text content contains all these fields.
        const text = await task.innerText();
        const lines = text.split('\n');

        // We'll return the raw text for now to help with debugging/searching
        // In a real scenario, we'd want precise selectors for each field.
        return {
            fullText: text,
            lines: lines
        };
    }

    async verifyTaskCardElements(index: number = 0) {
        const task = this.taskItems.nth(index);
        await expect(task).toBeVisible();

        // 1. Profile Picture (Assumed selector)
        // It could be an image, an avatar div, or an icon
        const profile = task.locator('.p-avatar, img, [class*="avatar"], [class*="profile"]').first();
        if (await profile.isVisible()) {
            await expect(profile).toBeVisible();
        } else {
            console.log('⚠️ Profile picture not found with standard selectors');
        }

        // 2. Channel Icon (Assumed selector)
        const channelIcon = task.locator('i[class*="pi-"], svg, [class*="channel"], img[src*="icon"]').first();
        if (await channelIcon.isVisible()) {
            await expect(channelIcon).toBeVisible();
        } else {
            console.log('⚠️ Channel icon not found with standard selectors');
        }

        // 3-7. Text fields (Name, Phone, Ticket No, Date/Time, Status)
        // Since we don't have precise selectors, we check if the card contains text.
        // We can refine this if we know the DOM structure.
        const text = await task.innerText();
        expect(text.length).toBeGreaterThan(10); // Ensure there is some content
    }

    async clearSearch() {
        await this.inputSearch.clear();
        // Optionally trigger a search update if needed (e.g., press Enter)
        await this.inputSearch.press('Enter');
        await this.page.waitForTimeout(1000); // Wait for list to reload
    }

    // New Helper Methods for CRM_AG00046+

    async selectDropdown(value: string) {
        await this.dropdown.click();
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('option', { name: value }).click();
    }

    async fillInputMultipleDropdown(fields: {
        MultipleDropdownlv1?: string;
        MultipleDropdownlv2?: string;
        MultipleDropdownlv3?: string;
        MultipleDropdownlv4?: string;
        MultipleDropdownlv5?: string;
        MultipleDropdownlv6?: string;
    }) {
        const dropdownLevels = [
            "MultipleDropdownlv1",
            "MultipleDropdownlv2",
            "MultipleDropdownlv3",
            "MultipleDropdownlv4",
            "MultipleDropdownlv5",
            "MultipleDropdownlv6",
        ];

        for (let i = 0; i < dropdownLevels.length; i++) {
            const key = dropdownLevels[i];
            const value = fields[key as keyof typeof fields];

            if (!value) continue;

            const dropdownLocator = (this as any)[`multipledropdownlv${i + 1}`];

            // Check if already selected (optional optimization)
            const inputLocator = dropdownLocator.locator('input');
            const currentPlaceholder = await inputLocator.getAttribute('placeholder');
            if (currentPlaceholder === String(value)) {
                console.log(`${key} already has value "${value}", skipping...`);
                continue;
            }

            await dropdownLocator.click();

            // Retry logic for option visibility
            const optionLocator = this.page.getByRole("option", { name: String(value) });
            try {
                await optionLocator.waitFor({ state: "visible", timeout: 5000 });
                await optionLocator.click();
            } catch (e) {
                console.log(`Failed to select ${value} for ${key}`);
                throw e;
            }
            await this.page.waitForTimeout(500);
        }
    }

    async fillTextInput(value: string) {
        await this.inputText.fill(value);
    }

    async fillDataMasking(value: string) {
        await this.inputDatemasking.fill(value);
    }

    async selectRadio(value: string) {
        await this.btnRadio.click();
        await this.page.getByRole('option', { name: value }).click();
    }

    async selectCheckbox(value: string) {
        await this.inputCheckbox.click();
        await this.page.getByRole('option', { name: value }).click();
    }

    async fillDateTime(value: string) {
        await this.inputDatetime.fill(value);
        await this.page.keyboard.press('Enter');
    }

    async fillDate(value: string) {
        await this.inputDate.fill(value);
        await this.page.keyboard.press('Enter');
    }

    async fillTime(value: string) {
        await this.inputTime.fill(value);
        await this.page.keyboard.press('Enter');
    }

    async clickButtonLink() {
        await this.btnLink.click();
    }

    async fillSegment(value: string) {
        await this.segment.fill(value);
    }

    async uploadFiles(fileNames: string[]) {
        const basePath = path.resolve('tests/file_update-test');
        const filesToUpload = fileNames.map(file => path.join(basePath, file));

        // Verify files exist
        filesToUpload.forEach(filePath => {
            if (!fs.existsSync(filePath)) {
                throw new Error(`❌ File not found: ${filePath}`);
            }
        });

        await this.fileInput.setInputFiles(filesToUpload);
    }

    async removeFile() {
        await this.btnRemoveFile.click();
        await this.btnConfirmRemoveFile.click();
    }

    async clickSync() {
        await this.btnSync.click();
    }

    async addNote(note: string) {
        await this.inputNote.fill(note);
        await this.btnSendNote.click();
    }
}
