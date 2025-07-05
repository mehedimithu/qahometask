import { test, expect } from '@playwright/test';
import { Credentials } from '../helper_base/credentials';

const BASE_URL = Credentials.BASE_URL;

test.use({
    permissions: ['geolocation'],
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
    baseURL: BASE_URL,
});

test.describe('📋 DemoQA Web Tables - CRUD UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Setup: Block ads and navigate to Web Tables page
        await page.route('**/*', route => {
            return route.request().url().includes('ads') ? route.abort() : route.continue();
        });
        await page.goto('/webtables', { waitUntil: 'domcontentloaded' });
    });

    test('➕ Add New Record', async ({ page }) => {
        /**
         * ✅ Test Case: Add New Record
         * Steps:
         *  1. Click "Add" button
         *  2. Fill all required fields:
         *     - First Name: John
         *     - Last Name: Doe
         *     - Email: john.doe@example.com
         *     - Age: 30
         *     - Salary: 50000
         *     - Department: QA
         *  3. Click "Submit"
         * Expected Result:
         *  - New record should appear in the table with "John" and "Doe" present.
         */

        await page.getByRole('button', { name: 'Add' }).click();
        await page.getByPlaceholder('First Name').fill('Mehedi');
        await page.getByPlaceholder('Last Name').fill('Hasan');
        await page.getByPlaceholder('name@example.com').fill('mehedi.doe@example.com');
        await page.getByPlaceholder('Age').fill('30');
        await page.getByPlaceholder('Salary').fill('105000');
        await page.getByPlaceholder('Department').fill('QA');
        await page.getByRole('button', { name: 'Submit' }).click();

        /**
         * ✅ Verify the new record is added
         * - Use a locator that finds the row by text content, not by index.
         * - Ensure the row contains the expected data.
         */
        // ✅ Look up the newly added row by text content, not by index
        const newRow = page.locator('.rt-tr-group:has-text("Mehedi"):has-text("Hasan")');

        await expect(newRow).toContainText('Mehedi');
        await expect(newRow).toContainText('Hasan');
        await expect(newRow).toContainText('mehedi.doe@example.com');
    });

    test('🔍 View Existing Record', async ({ page }) => {
        /**
         * ✅ Test Case: View Existing Record
         * Steps:
         *  1. Locate the first row in the Web Table
         * Expected Result:
         *  - The row should contain non-empty text (valid data).
         */

        const firstRow = page.locator('.rt-tbody .rt-tr-group').first();
        await expect(firstRow).toContainText(/\w+/);
    });

    test('✏️ Update Existing Record', async ({ page }) => {
        /**
         * ✅ Test Case: Update Existing Record
         * Steps:
         *  1. Click on the first edit icon
         *  2. Change the email to: updated.email@example.com
         *  3. Submit the form
         * Expected Result:
         *  - Updated email should be visible in the table.
         */

        await page.locator('span[title="Edit"]').first().click();
        const emailInput = page.getByPlaceholder('name@example.com');
        await emailInput.fill('updated.email@example.com');
        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page.locator('.rt-tbody')).toContainText('updated.email@example.com');
    });

    test('❌ Delete Existing Record', async ({ page }) => {
        /**
         * ✅ Test Case: Delete Existing Record
         * Steps:
         *  1. Count the number of existing rows
         *  2. Click on the first delete icon
         *  3. Count the number of rows again
         * Expected Result:
         *  - The row count should decrease by 1.
         */

        // Count only rows that contain meaningful data (non-empty)
        const getDataRows = () => page.locator('.rt-tr-group').filter({ hasText: '@' }); // Email always present

        const rowsBefore = await getDataRows().count();

        // Guard against zero to prevent invalid comparison
        expect(rowsBefore).toBeGreaterThan(0);

        // Delete the first record
        await page.locator('span[title="Delete"]').first().click();

        // Wait until a row disappears
        await expect.poll(async () => await getDataRows().count())
            .toBeLessThan(rowsBefore);
    });
});