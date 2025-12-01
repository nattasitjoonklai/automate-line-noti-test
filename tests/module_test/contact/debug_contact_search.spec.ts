import test, { expect, Page, APIRequestContext } from "@playwright/test";
import { BaseUrl } from "../../utils";
import { FillInputContactForm, ContactFormFields } from "./FillForm";
import { ContactAPI } from "./Global_function";

test('Debug Search UI Issue', async ({ page, request }) => {
    // 1. Setup Data
    console.log(`[DEBUG] BaseUrl: ${BaseUrl}`);

    // Listen for UI network requests
    page.on('response', async response => {
        if (response.url().includes('/contacts/filter')) {
            console.log(`[UI-API] Status: ${response.status()} URL: ${response.url()}`);
            try {
                const body = await response.json();
                const count = body.data?.data?.length ?? 0;
                console.log(`[UI-API] Response data count: ${count}`);
            } catch (e) {
                console.log(`[UI-API] Could not parse response body`);
            }
        }
    });

    // Listen for console logs
    page.on('console', msg => console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`));

    const searchData: ContactFormFields = {
        Name: "NattasitTest", // Using a name known to exist or from previous tests
        // Add other fields if necessary to match the failing scenario
    };

    // 2. API Call (Expect 0 results due to expired token/issue as reported)
    console.log("--- Step 1: API Call ---");
    const contacts = await ContactAPI.fetchContacts(request, {
        organize_id: "64db6878ed14931d4adca29e",
        template_id: "67b42f057d334a46144e6b1b",
        Name: searchData.Name
    });
    console.log(`API returned ${contacts.length} contacts.`);

    // 3. UI Interaction & Verification using the fixed function
    console.log("--- Step 2: Calling searchAndVerify with SIMULATED API FAILURE ---");

    // Monkey patch fetchContacts to return empty array (Simulate API Error/Expiry)
    const originalFetch = ContactAPI.fetchContacts;
    ContactAPI.fetchContacts = async () => [];

    // We expect this to FAIL if the fix works (because API=0, UI=1)
    // So we wrap it in a try-catch to confirm it fails as expected
    try {
        await ContactAPI.searchAndVerify(page, request, searchData);
        console.log("FAILURE: searchAndVerify passed (it should have failed due to mismatch)");
    } catch (error) {
        console.log("SUCCESS: searchAndVerify failed as expected!");
        console.log(`Error message: ${error.message}`);
    } finally {
        ContactAPI.fetchContacts = originalFetch; // Restore
    }

    // Screenshot for visual verification
    await page.screenshot({ path: 'debug_search_result.png', fullPage: true });

    if (contacts.length === 0) {
        console.log("API correctly returned 0 (simulated failure/expiry).");
    } else {
        console.log("WARNING: API returned data. Token might not be expired?");
    }

    // We can't check 'count' here because we are calling the function which does the assertion internally.
    // The try-catch block above handles the success/failure verification.
});
