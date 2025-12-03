import { Page, expect } from "@playwright/test";

/**
 * Verify that Agent Desktop page elements are visible
 */
export async function verifyAgentDesktopElements(page: Page) {
    // Verify Agent Status dropdown exists
    const statusElement = page.locator('[class*="status"]').first();
    await expect(statusElement).toBeVisible({ timeout: 10000 });

    // Verify Channel Filter Tabs
    await expect(page.locator('button[id*="tab_x,phone"]')).toBeVisible();
    await expect(page.locator('button[id*="tab_phone"]')).toBeVisible();
    await expect(page.locator('button[id*="tab_line"]')).toBeVisible();
    await expect(page.locator('button[id*="tab_email"]')).toBeVisible();
    await expect(page.locator('button[id*="tab_facebook"]')).toBeVisible();
    await expect(page.locator('button[id*="tab_task"]')).toBeVisible();

    // Verify Action Buttons
    await expect(page.locator('button#create-ticket-button')).toBeVisible();
    await expect(page.locator('button#btn-import-csv')).toBeVisible();

    // Verify Search Elements
    await expect(page.locator('#select-task-search')).toBeVisible();
    await expect(page.locator('input[placeholder="Search"]')).toBeVisible();

    // Verify Task Type Tabs
    await expect(page.locator('#tab-task-my-task')).toBeVisible();
    await expect(page.locator('#tab-task-pending')).toBeVisible();
    await expect(page.locator('#tab-task-guest')).toBeVisible();
    await expect(page.locator('#tab-task-group')).toBeVisible();
    await expect(page.locator('#tab-task-all')).toBeVisible();
}

/**
 * Verify Agent Status options are available
 */
export async function verifyAgentStatusOptions(page: Page) {
    await page.waitForTimeout(5000);
    // คลิกปุ่ม dropdown เพื่อแสดงตัวเลือกสถานะ
    await page.locator('span').nth(4).click();

    // รอให้ dropdown แสดงขึ้นมา
    await page.waitForTimeout(500);

    // หา dropdown overlay (มักจะมี id ขึ้นต้นด้วย pv_id)
    const dropdown = page.locator('[id^="pv_id_"]').filter({ hasText: 'Available' }).first();

    // เช็คว่าตัวเลือกสถานะทั้งหมดแสดงขึ้นมาใน dropdown
    const expectedStatuses = [
        'Available',
        'login',
        'Toilet',
        'Coach/Tranining',
        'Outbound'
    ];

    for (const status of expectedStatuses) {
        // เลือกเฉพาะตัวที่อยู่ใน dropdown overlay
        const statusOption = page.locator('[id^="pv_id_"]').getByText(status, { exact: true }).first();
        await expect(statusOption).toBeVisible({ timeout: 5000 });
        console.log(`✅ Status option "${status}" is visible`);
    }

    // ปิด dropdown โดยกด Escape หรือคลิกที่อื่น
    await page.keyboard.press('Escape');

    console.log('✅ All agent status options verified successfully');
}

/**
 * Verify Channel Filter Tabs
 */
export async function verifyChannelTabs(page: Page) {
    const expectedChannels = [
        { id: 'tab_x,phone', label: 'all' },
        { id: 'tab_phone', label: 'phone' },
        { id: 'tab_line', label: 'line' },
        { id: 'tab_email', label: 'email' },
        { id: 'tab_facebook', label: 'facebook' },
        { id: 'tab_task', label: 'task' },
        { id: 'tab_instagram', label: 'instagram' },
        { id: 'tab_telegram', label: 'telegram' },
        { id: 'tab_lazada', label: 'lazada' }

    ];

    for (const channel of expectedChannels) {
        const tab = page.locator(`button[id*="${channel.id}"]`);
        await expect(tab).toBeVisible();
    }
}

/**
 * Verify Task Type Menu
 */
export async function verifyTaskTypeMenu(page: Page) {
    const expectedTypes = [
        { id: 'tab-task-my-task', label: 'My Task' },
        { id: 'tab-task-pending', label: 'Pending' },
        { id: 'tab-task-guest', label: 'Guest' },
        { id: 'tab-task-group', label: 'Group' },
        { id: 'tab-task-all', label: 'All' }
    ];

    for (const type of expectedTypes) {
        const tab = page.locator(`#${type.id}`);
        await expect(tab).toBeVisible();
        await expect(tab).toContainText(type.label);
    }
}

/**
 * Verify Ticket Detail Tabs (when a ticket is selected)
 * คลิกเลือก task แรกในรายการ แล้วเช็คว่ามีแท็บต่างๆ แสดงขึ้นมา
 */
export async function verifyTicketDetailTabs(page: Page) {
    // คลิกเลือก task แรกในรายการ (task container มี id ที่ขึ้นต้นด้วย hex)
    // หา task แรกใน mytask-wrapper
    const firstTask = page.locator('#mytask-wrapper > div > div').first();

    // เช็คว่า task มีอยู่จริง
    await expect(firstTask).toBeVisible({ timeout: 5000 });
    console.log('✅ First task found in list');

    // คลิกที่ task แรก
    await firstTask.click();
    console.log('✅ Clicked first task');

    // รอให้แท็บโหลดขึ้นมา
    await page.waitForTimeout(1000);

    // รายการแท็บที่ต้องเช็ค
    const expectedTabs = [
        'Contact',
        'Ticket',
        'Omnichannel',
        'Email',
        'SMS',
        'Appointment',
        'Ticket History'
    ];

    // เช็คว่าแท็บทั้งหมดแสดงขึ้นมา
    for (const tabName of expectedTabs) {
        const tab = page.locator(`button[role="tab"]`).filter({ hasText: tabName }).or(
            page.locator(`[aria-label="${tabName}"]`)
        ).first();

        await expect(tab).toBeVisible({ timeout: 5000 });
        console.log(`✅ Tab "${tabName}" is visible`);
    }

    console.log('✅ All ticket detail tabs verified successfully');
}

/**
 * Verify Search functionality
 */
export async function verifySearchOptions(page: Page) {
    const searchSelect = page.locator('#select-task-search');
    await expect(searchSelect).toBeVisible();

    // Click to open dropdown
    await searchSelect.click();

    // Verify search options
    const expectedOptions = ['Name', 'Phone', 'Ticket No.'];
    for (const option of expectedOptions) {
        await expect(page.getByText(option, { exact: true })).toBeVisible();
    }

    // Close dropdown
    await page.keyboard.press('Escape');
}

/**
 * Get task count from a specific tab
 */
export async function getTaskCount(page: Page, taskType: 'mytask' | 'pending' | 'guest' | 'group' | 'all'): Promise<number> {
    const tabId = `tab-task-${taskType === 'mytask' ? 'my-task' : taskType}`;
    const badge = page.locator(`#${tabId} .p-badge`);

    if (await badge.isVisible()) {
        const count = await badge.textContent();
        return parseInt(count || '0');
    }

    return 0;
}

/**
 * Wait for task list to load
 */
export async function waitForTaskListLoad(page: Page) {
    const taskWrapper = page.locator('#mytask-wrapper');
    await expect(taskWrapper).toBeVisible({ timeout: 10000 });

    // Wait for any loading indicators to disappear
    const loadingIndicator = page.locator('[class*="loading"]').or(page.locator('[class*="spinner"]'));
    if (await loadingIndicator.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(loadingIndicator).not.toBeVisible({ timeout: 10000 });
    }
}

/**
 * Verify Notification and Reminder tabs
 * เช็คว่าเมื่อกดไอคอนกระดิ่งแล้ว popup จะแสดงขึ้นพร้อมกับแท็บ 2 แท็บ (Notification และ Reminder)
 */
export async function verifyNotificationTabs(page: Page) {
    // หาและคลิกปุ่มกระดิ่ง (notification bell icon)
    // ใช้ XPath เพื่อหา element ที่แน่นอน (คลิกที่ span parent ของ svg)
    const notificationButton = page.locator('xpath=//*[@id="app"]/div[2]/div/div[2]/div/div[3]/span[1]');

    await notificationButton.click();
    console.log('✅ Clicked notification bell icon');

    // รอให้ popup แสดงขึ้นมา
    await page.waitForTimeout(500);

    // เช็คว่า popup dialog แสดงขึ้นมา
    const popover = page.locator('[role="dialog"][data-pc-name="popover"]');
    await expect(popover).toBeVisible({ timeout: 5000 });
    console.log('✅ Notification popover is visible');

    // เช็คว่ามีแท็บ Notification
    const notificationTab = page.locator('button[role="tab"]').filter({ hasText: 'Notification' });
    await expect(notificationTab).toBeVisible({ timeout: 5000 });
    console.log('✅ Notification tab is visible');

    // เช็คว่ามีแท็บ Reminder
    const reminderTab = page.locator('button[role="tab"]').filter({ hasText: 'Reminder' });
    await expect(reminderTab).toBeVisible({ timeout: 5000 });
    console.log('✅ Reminder tab is visible');

    // ทดสอบคลิกแท็บ Reminder
    await reminderTab.click();
    await page.waitForTimeout(300);
    console.log('✅ Clicked Reminder tab');

    // เช็คว่าแท็บ Reminder active
    await expect(reminderTab).toHaveAttribute('aria-selected', 'true');
    console.log('✅ Reminder tab is now active');

    // คลิกกลับไปที่แท็บ Notification
    await notificationTab.click();
    await page.waitForTimeout(300);
    console.log('✅ Clicked back to Notification tab');

    // ปิด popup โดยกด Escape หรือคลิกที่อื่น
    await page.keyboard.press('Escape');

    console.log('✅ All notification tabs verified successfully');
}
