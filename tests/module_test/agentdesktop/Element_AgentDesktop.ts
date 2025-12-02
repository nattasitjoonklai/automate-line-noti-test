import { Page, Locator } from "@playwright/test";
import { AgentDesktopPage } from "../../utils";

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

    constructor(page: Page) {
        this.page = page;

        // Agent Status - ต้องปรับ selector ตามจริง
        this.statusDropdown = page.locator('[data-test="agent-status-dropdown"]');
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

        // Search Elements
        this.selectSearchType = page.locator('#select-task-search');
        this.inputSearch = page.locator('input[placeholder="Search"]');

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
        this.tabContact = page.locator('[aria-label="Contact"]');
        this.tabTicket = page.locator('[aria-label="Ticket"]');
        this.tabOmnichannel = page.locator('[aria-label="Omnichannel"]');
        this.tabEmailDetail = page.locator('[aria-label="Email"]');
        this.tabSMS = page.locator('[aria-label="SMS"]');
        this.tabAppointment = page.locator('[aria-label="Appointment"]');
        this.tabTicketHistory = page.locator('button[id*="tab-history-ticket-history"]');

        // Notification
        this.btnNotification = page.locator('[data-test="notification-button"]');
        this.btnReminder = page.locator('[data-test="reminder-button"]');
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

    async searchTask(searchType: 'Name' | 'Phone' | 'Ticket no.', searchValue: string) {
        // Select search type
        await this.selectSearchType.click();
        await this.page.getByText(searchType, { exact: true }).click();

        // Enter search value
        await this.inputSearch.fill(searchValue);
    }

    async getTaskCount(): Promise<number> {
        return await this.taskItems.count();
    }

    async selectFirstTask() {
        await this.taskItems.first().click();
    }
}
