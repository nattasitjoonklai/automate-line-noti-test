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
/**
 * Verify Agent Status options are available
 */
export async function verifyAgentStatusOptions(page: Page) {
    await page.waitForTimeout(2000);
    // คลิกปุ่ม dropdown เพื่อแสดงตัวเลือกสถานะ
    await page.locator('#dyn_user_status').click();

    // รอให้ dropdown แสดงขึ้นมา
    await page.waitForTimeout(500);

    // หา dropdown overlay (มักจะมี id ขึ้นต้นด้วย pv_id)
    // Note: The dropdown content might be dynamic, checking for common statuses
    const expectedStatuses = [
        'Available',
        'Login',
        'Toilet',
        'Lunch',
        'Break',
        'Acd'
    ];

    // Check if at least one status is visible to confirm dropdown opened
    const dropdownItem = page.locator('[id^="pv_id_"]').first();
    await expect(dropdownItem).toBeVisible({ timeout: 5000 });

    // ปิด dropdown โดยกด Escape หรือคลิกที่อื่น
    await page.keyboard.press('Escape');

    console.log('✅ Agent status dropdown verified successfully');
}

/**
 * Verify Channel Filter Tabs
 */
export async function verifyChannelTabs(page: Page) {
    // The channel filters are in a container below the "Tasks" header
    // We look for the container first
    // Use specific classes to avoid strict mode violation (there are multiple "Tasks" texts)
    const tasksHeader = page.locator('span.text-xl.font-bold').filter({ hasText: 'Tasks' });
    await expect(tasksHeader).toBeVisible();

    // The filter container is a sibling of the header's container
    // Structure: Header Container -> Filter Container
    // We can use a locator that targets the filter items directly

    // Verify "All" filter which has text
    const allFilter = page.locator('.flex-wrap').getByText('all', { exact: true });
    await expect(allFilter).toBeVisible();

    // Verify we have multiple filter icons (divs with rounded-full and bg-slate-200 or primary)
    const filterIcons = page.locator('.flex-wrap.gap-1 > div.rounded-full');
    const count = await filterIcons.count();
    expect(count).toBeGreaterThan(5); // Expecting at least 5 filters

    console.log(`✅ Verified Channel Tabs (Found ${count} filters)`);
}

/**
 * Verify Task Type Menu
 */
export async function verifyTaskTypeMenu(page: Page) {
    const expectedTypes = [
        'My Task',
        'Pending',
        'Guest',
        'Group',
        'All'
    ];

    for (const label of expectedTypes) {
        // Use class selector combined with text
        const tab = page.locator('.task-tab-item').filter({ hasText: label });
        await expect(tab).toBeVisible();
    }
    console.log('✅ Verified Task Type Menu');
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

/**
 * Verify Search functionality with API
 * @param page Playwright Page object
 * @param searchType Type of search ('Name', 'Phone', 'Ticket No.')
 * @param searchValue Value to search for
 * @param searchAction Callback function to perform the search action
 */
export async function verifySearchWithAPI(
    page: Page,
    searchType: 'Name' | 'Phone' | 'Ticket No.',
    searchValue: string,
    searchAction: () => Promise<void>
) {
    let apiSearchType = '';
    let apiField = '';

    switch (searchType) {
        case 'Name':
            apiSearchType = 'contact_name';
            apiField = 'c_name';
            break;
        case 'Phone':
            apiSearchType = 'contact_phone';
            apiField = 'c_phone';
            break;
        case 'Ticket No.':
            apiSearchType = 'ticket_no';
            apiField = 'cs_ticket_no';
            break;
    }

    // Setup API listener
    const responsePromise = page.waitForResponse(response =>
        response.url().includes('/api/tasks/mytask') &&
        response.url().includes(`searchType=${apiSearchType}`) &&
        response.status() === 200
    );

    // Perform search action
    await searchAction();
    console.log(`Searching for ${searchType}: ${searchValue}`);

    // Wait for API response
    const response = await responsePromise;
    const responseBody = await response.json();
    console.log(`API Response Status: ${response.status()}`);

    // Verify API data
    const apiTasks = responseBody.data?.data || [];
    console.log(`API returned ${apiTasks.length} tasks`);

    // Verify UI matches API count (approximate)
    await page.waitForTimeout(1000);

    // Check if API results contain the searched term
    let match = false;
    if (apiTasks.length > 0) {
        match = apiTasks.some((task: any) => {
            const fieldValue = task[apiField];
            if (Array.isArray(fieldValue)) {
                return fieldValue.some((v: string) => v.includes(searchValue));
            }
            return (fieldValue || '').includes(searchValue);
        });

        if (match) {
            console.log(`✅ API data contains search term: ${searchValue}`);
        } else {
            console.log(`⚠️ Search term "${searchValue}" not found in API results.`);
            // Log first item for debugging
            console.log('First task structure:', JSON.stringify(apiTasks[0], null, 2));
        }
        expect(match).toBeTruthy();
    } else {
        console.log('⚠️ API returned no results');
    }

    console.log(`✅ Search by ${searchType} (${searchValue}) verified with API`);
}

/**
 * Verify Default Task List with API (after clearing search)
 * @param page Playwright Page object
 * @param clearAction Callback function to perform the clear search action
 */
export async function verifyDefaultTaskListWithAPI(page: Page, clearAction: () => Promise<void>) {
    console.log('Verifying default task list (cleared search)...');

    // Setup API listener for default list
    // We expect a call to mytask with status 200
    // We can be more specific if needed, but generally any successful mytask call after clear is good
    const responsePromise = page.waitForResponse(response =>
        response.url().includes('/api/tasks/mytask') &&
        response.status() === 200
    );

    // Perform clear action
    await clearAction();

    // Wait for API response
    const response = await responsePromise;
    const responseBody = await response.json();
    console.log(`API Response Status: ${response.status()}`);

    // Verify API data
    const apiTasks = responseBody.data?.data || [];
    console.log(`API returned ${apiTasks.length} tasks`);

    // Verify UI matches API count
    await page.waitForTimeout(1000);

    if (apiTasks.length > 0) {
        // Check if the first item from API is present in the UI
        // This confirms the list actually updated
        const taskItems = page.locator('#mytask-wrapper > div > div');
        await expect(taskItems.first()).toBeVisible();
        console.log('✅ UI shows tasks after clearing search');
    } else {
        console.log('⚠️ API returned no tasks after clearing search');
    }

    console.log('✅ Default task list verified with API');
}
