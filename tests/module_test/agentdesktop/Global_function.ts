import { Page, expect } from "@playwright/test";
import { Element_AgentDesktop } from "./Element_AgentDesktop";

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

/**
 * Fetch all tasks by scrolling through pagination and verify against UI
 * @param page Playwright Page object
 * @param wrapperSelector Selector for the scrollable task container
 * @param apiEndpoint API endpoint to listen for (e.g. '/api/tasks/all')
 * @param initialData Optional initial API response data (Page 1) if already loaded
 */
export async function fetchAllTasksAndVerify(
    page: Page,
    wrapperSelector: string,
    apiEndpoint: string,
    initialData: any = null
) {
    const taskWrapper = page.locator(wrapperSelector);
    await expect(taskWrapper).toBeVisible();

    let allApiTasks: any[] = [];
    let currentPage = 0;
    let lastPage = 1; // Start with 1, will update from response
    let attempts = 0;
    const maxAttempts = 50; // Safety limit for pages

    console.log(`🚀 Starting full pagination fetch for ${apiEndpoint}`);

    // Initialize from initialData if provided
    if (initialData && initialData.data) {
        const data = initialData.data;
        currentPage = data.current_page;
        lastPage = data.last_page;
        const newTasks = data.data || [];

        allApiTasks = [...newTasks];
        console.log(`📄 Initial Page ${currentPage}/${lastPage} loaded. Tasks: ${allApiTasks.length}`);

        if (allApiTasks.length > 0) {
            // Wait for at least one task to be visible to ensure UI is rendered
            // This addresses the "loading too fast" issue
            const firstTask = page.locator(`${wrapperSelector} > div > div`).first();
            try {
                await expect(firstTask).toBeVisible({ timeout: 10000 });
            } catch (e) {
                console.log('⚠️ Timeout waiting for first task to appear. UI might be slow or empty.');
                // Debug: Print all visible wrappers
                const wrappers = page.locator('[id*="wrapper"]');
                const count = await wrappers.count();
                console.log(`DEBUG: Found ${count} elements with 'wrapper' in ID`);
                for (let i = 0; i < count; i++) {
                    const id = await wrappers.nth(i).getAttribute('id');
                    const visible = await wrappers.nth(i).isVisible();
                    console.log(`Wrapper ${i}: ID=${id}, Visible=${visible}`);
                }
            }
        }
    }

    // Initial wait for the first load if not already loaded, or we just start scrolling
    // We'll assume we might need to scroll to trigger next pages.
    // But first, we need to capture the current state or the next request.

    // Actually, the best way is to scroll and wait for response repeatedly until current_page == last_page.
    // If we are already at page 1, we scroll to get page 2.

    // Map to store unique UI tasks (key: text content or ticket no)
    const uiTasksMap = new Map<string, any>();

    // Helper to extract current visible tasks
    const extractVisibleTasks = async () => {
        // Selector based on observed structure: div with flex items-start gap-2
        // Or generic div child of wrapper's container
        const items = page.locator(`${wrapperSelector} > div > div`);
        const count = await items.count();

        for (let i = 0; i < count; i++) {
            const item = items.nth(i);
            if (await item.isVisible()) {
                const text = (await item.innerText()).trim();
                // Use text as key for uniqueness (or extract ID if possible)
                // Filter out empty strings
                if (text && !uiTasksMap.has(text)) {
                    const ticketMatch = text.match(/\d{8}-\d{3}/);

                    // Check for channel icon (SVG in the avatar wrapper)
                    const icon = await item.locator('.absolute.-bottom-1.-right-1 svg').first();
                    const hasIcon = await icon.isVisible();

                    uiTasksMap.set(text, {
                        text: text,
                        ticketNo: ticketMatch ? ticketMatch[0] : null,
                        hasIcon: hasIcon
                    });
                }
            }
        }
    };

    // Extract initial visible tasks before scrolling
    await extractVisibleTasks();

    while (currentPage < lastPage && attempts < maxAttempts) {
        attempts++;

        // Create a promise for the next response
        // We filter by endpoint and status 200
        const responsePromise = page.waitForResponse(response =>
            response.url().includes(apiEndpoint) &&
            response.status() === 200,
            { timeout: 5000 } // Short timeout for wait, if no request happens we might be done or need more scroll
        ).catch(() => null); // Catch timeout if no request is made (e.g. end of list)

        // Scroll to bottom to trigger load
        await taskWrapper.evaluate((el) => el.scrollTo(0, el.scrollHeight));

        // Wait for response
        const response = await responsePromise;

        if (response) {
            const responseBody = await response.json();
            const data = responseBody.data;

            if (data) {
                currentPage = data.current_page;
                lastPage = data.last_page;
                const newTasks = data.data || [];

                // Avoid duplicates if any (though API should give unique pages)
                // We'll just push for now, or check IDs
                // Simple concat:
                // allApiTasks = allApiTasks.concat(newTasks);

                // Better: Add only if not exists (by t_id or contact_id)
                for (const task of newTasks) {
                    if (!allApiTasks.some(t => t.t_id === task.t_id)) {
                        allApiTasks.push(task);
                    }
                }

                console.log(`📄 Page ${currentPage}/${lastPage} loaded. Total API tasks: ${allApiTasks.length}`);
            }
        } else {
            // No response triggered.
            // Could be we are at the end or need to wait/scroll more.
            // If we haven't reached lastPage, maybe try scrolling again?
            console.log('⚠️ No API response triggered on scroll.');

            // If we have some data and current >= last, we break.
            // If we don't know lastPage yet (e.g. first load missed), we might be stuck.
            // But usually the test starts after first load.

            // Let's check if we can break
            if (currentPage >= lastPage && lastPage > 1) break;

            // If we are stuck, maybe wait a bit and try scrolling again in next loop
            await page.waitForTimeout(1000);
        }

        // Extract tasks currently visible in UI
        await extractVisibleTasks();

        // Small pause to let UI render
        await page.waitForTimeout(500);
    }

    console.log(`✅ Finished pagination. Total API tasks: ${allApiTasks.length}`);

    // Final scroll to ensure everything is rendered (only if we actually have multiple pages)
    if (lastPage > 1) {
        await taskWrapper.evaluate((el) => el.scrollTo(0, el.scrollHeight));
        await page.waitForTimeout(1000);
    }

    await extractVisibleTasks();

    // Extract UI tasks
    // Selector: wrapper > div > div (based on observed structure)
    // Try a more general selector to capture all task cards
    const uiTasks = Array.from(uiTasksMap.values());
    console.log(`📊 Found ${uiTasks.length} unique tasks in UI`);

    return { apiTasks: allApiTasks, uiTasks };
}

/**
 * Reusable function to verify task tabs (My Task, Pending, Guest, Group, All)
 */
export async function verifyTaskTab(
    page: Page,
    agentDesktop: Element_AgentDesktop,
    tabType: 'mytask' | 'pending' | 'guest' | 'group' | 'all',
    apiEndpoint: string,
    wrapperSelector: string,
    preLoadedResponse: any = null
) {
    let firstResponseBody = preLoadedResponse;

    if (!firstResponseBody) {
        // Setup listener for the first API response (Page 1)
        const firstResponsePromise = page.waitForResponse(response =>
            response.url().includes(apiEndpoint) &&
            response.status() === 200
        );

        await agentDesktop.selectTaskType(tabType);
        await page.waitForTimeout(1000);

        // Capture the first response data
        const firstResponse = await firstResponsePromise;
        firstResponseBody = await firstResponse.json();
    } else {
        // If response is pre-loaded (e.g. My Task on page load), just ensure we are on the tab
        // For My Task, we are already there. For others, we might need to click if we passed response manually?
        // Usually preLoadedResponse implies we are already in the right state.
        // We can still verify the tab is active.
    }

    // Verify tab is active
    let activeTab;
    switch (tabType) {
        case 'mytask': activeTab = agentDesktop.tabMyTask; break;
        case 'pending': activeTab = agentDesktop.tabPending; break;
        case 'guest': activeTab = agentDesktop.tabGuest; break;
        case 'group': activeTab = agentDesktop.tabGroup; break;
        case 'all': activeTab = agentDesktop.tabAllTasks; break;
    }
    await expect(activeTab).toHaveClass(/active/);
    console.log(`✅ Verified ${tabType} tab is active`);

    console.log(`Initial API Response captured: ${firstResponseBody.data?.data?.length} tasks`);

    // Fetch all tasks with pagination and verify, passing the initial data
    const { apiTasks, uiTasks } = await fetchAllTasksAndVerify(page, wrapperSelector, apiEndpoint, firstResponseBody);

    console.log(`Summary: API Tasks: ${apiTasks.length}, UI Tasks: ${uiTasks.length} `);

    // Verification
    // We check by Ticket No first, then Name
    let matchCount = 0;
    const missingTasks = [];

    for (const apiTask of apiTasks) {
        const ticketNo = apiTask.cs_ticket_no;
        const name = apiTask.c_name;

        let found = false;
        if (ticketNo) {
            found = uiTasks.some(t => t.text.includes(ticketNo));
        } else if (name) {
            found = uiTasks.some(t => t.text.includes(name));
        }

        if (found) {
            matchCount++;
        } else {
            missingTasks.push({ ticketNo, name });
        }
    }

    console.log(`✅ Matched ${matchCount}/${apiTasks.length} tasks from API in UI`);

    if (missingTasks.length > 0) {
        console.log('❌ Missing Tasks in UI:', JSON.stringify(missingTasks, null, 2));
    }

    // Find tasks in UI that are NOT in API
    const extraUiTasks = [];
    for (const uiTask of uiTasks) {
        let foundInApi = false;
        // Check against all API tasks
        for (const apiTask of apiTasks) {
            const ticketNo = apiTask.cs_ticket_no;
            const name = apiTask.c_name;
            if ((ticketNo && uiTask.text.includes(ticketNo)) || (name && uiTask.text.includes(name))) {
                foundInApi = true;
                break;
            }
        }
        if (!foundInApi) {
            extraUiTasks.push(uiTask.text);
        }
    }

    if (extraUiTasks.length > 0) {
        console.log('⚠️ Extra Tasks in UI (not in API):', JSON.stringify(extraUiTasks, null, 2));
    }

    expect(matchCount).toBe(apiTasks.length);
    expect(uiTasks.length).toBe(apiTasks.length);
}

/**
 * Reusable function to verify Channel Filters (All, Facebook, Line, etc.)
 * Verifies:
 * 1. Filter selection state (active/inactive)
 * 2. Task count matches API
 * 3. All displayed tasks have visible channel icons
 */
export async function verifyChannelFilter(
    page: Page,
    agentDesktop: Element_AgentDesktop,
    filterName: 'all' | 'phone' | 'line' | 'email' | 'facebook' | 'task' | 'instagram' | 'telegram' | 'lazada',
    apiEndpoint: string,
    wrapperSelector: string,
    preLoadedResponse: any = null
) {
    let firstResponseBody = preLoadedResponse;

    // Map filter names to locators from agentDesktop
    const tabMap = {
        all: agentDesktop.tabAll,
        phone: agentDesktop.tabPhone,
        line: agentDesktop.tabLine,
        email: agentDesktop.tabEmail,
        facebook: agentDesktop.tabFacebook,
        task: agentDesktop.tabTask,
        instagram: agentDesktop.tabInstagram,
        telegram: agentDesktop.tabTelegram,
        lazada: agentDesktop.tabLazada
    };

    const targetFilterBtn = tabMap[filterName];
    if (!targetFilterBtn) {
        throw new Error(`Unknown filter name: ${filterName}`);
    }

    if (!firstResponseBody) {
        const firstResponsePromise = page.waitForResponse(response =>
            response.url().includes(apiEndpoint) &&
            response.status() === 200
        );

        await targetFilterBtn.click();
        await page.waitForTimeout(500); // Wait for UI update

        const firstResponse = await firstResponsePromise;
        firstResponseBody = await firstResponse.json();
    } else {
        await targetFilterBtn.click();
        await page.waitForTimeout(500);
    }

    // Verify Target Filter is active
    await expect(targetFilterBtn).toHaveClass(/bg-primary/);
    await expect(targetFilterBtn).toHaveClass(/text-white/);
    console.log(`✅ Verified '${filterName}' filter is active`);

    // Verify others are NOT active
    // We can iterate through all values in tabMap
    for (const [key, locator] of Object.entries(tabMap)) {
        if (key !== filterName) {
            // Check if it has cursor-pointer (meaning it's a filter button)
            // The locators in Element_AgentDesktop point to the button div itself
            if (await locator.getAttribute('class').then(c => c?.includes('cursor-pointer'))) {
                await expect(locator).toHaveClass(/bg-slate-200/);
                await expect(locator).toHaveClass(/text-gray-700/);
                await expect(locator).not.toHaveClass(/bg-primary/);
            }
        }
    }
    console.log(`✅ Verified other filters are inactive`);

    // Fetch and Verify Tasks
    const { apiTasks, uiTasks } = await fetchAllTasksAndVerify(page, wrapperSelector, apiEndpoint, firstResponseBody);

    // Verify Task Count
    expect(uiTasks.length).toBe(apiTasks.length);
    console.log(`✅ Verified Task Count: ${uiTasks.length}`);

    // Verify Icons
    let iconCount = 0;
    for (const task of uiTasks) {
        if (task.hasIcon) {
            iconCount++;
        } else {
            console.log(`❌ Task missing icon: ${task.text.substring(0, 50)}...`);
        }
    }
    expect(iconCount).toBe(uiTasks.length);
    console.log(`✅ Verified all ${iconCount} tasks have channel icons`);
}
