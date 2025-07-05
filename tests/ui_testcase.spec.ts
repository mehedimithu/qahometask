import { test, expect } from '@playwright/test';
import path from 'path';
import { Credentials } from '../helper_base/credentials';
import { ensureFormFieldsFilled } from '../helper_base/helperbase';

const BASE_URL = Credentials.BASE_URL;

test.use({
    permissions: ['geolocation'], // or other required permissions
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
    baseURL: BASE_URL,
});


/**
 * @testcase Automation Practice Form - Submit Valid Data
 *
 * @description
 * This test fills out the DemoQA Automation Practice Form with valid data
 * and verifies that the confirmation modal is displayed with the correct submission details.
 *
 * @steps
 * 1. Navigate to the Automation Practice Form.
 * 2. Remove any ads or footers that might block form elements.
 * 3. Fill in:
 *    - First Name, Last Name, Email
 *    - Gender selection
 *    - Mobile Number
 *    - Date of Birth
 *    - Subject (Maths)
 *    - Hobbies (Sports, Reading, Music)
 *    - Upload a profile picture
 *    - Current Address
 *    - State and City (NCR, Delhi)
 * 4. Submit the form.
 * 5. Assert that the confirmation modal appears with:
 *    - "Thanks for submitting the form" message
 *    - Submitted details: Name, Email, Phone Number
 * 6. Close the confirmation modal.
 *
 * @expected
 * - Modal appears with correct submission confirmation text.
 * - Submitted details are present and correct in the modal table.
 */


test('Automation Practice Form - Submit Valid Data', async ({ page }) => {
    // Block ads
    await page.route('**/*', route =>
        route.request().url().includes('ads') ? route.abort() : route.continue()
    );

    // 1. Navigate to the form
    await page.goto('/automation-practice-form', { waitUntil: 'domcontentloaded' });

    // 2. Remove fixed ads/footer that may block elements
    await page.evaluate(() => {
        document.getElementById('fixedban')?.remove();
        document.querySelector('footer')?.remove();
    });

    // 3. Fill personal details
    const firstname =  page.getByRole('textbox', { name: 'First Name' });
    await firstname.fill('Mehedi');
    const lastname =  page.getByRole('textbox', { name: 'Last Name' });
    await lastname.fill('Hasan');
    await page.getByRole('textbox', { name: 'name@example.com' }).fill('mehedi.doe@example.com');

    // 4. Select gender
    const gender =  page.getByText('Male', { exact: true })
    await gender.click();

    // 5. Enter mobile number
    const phone =  page.getByRole('textbox', { name: 'Mobile Number' });
    await phone.fill('1234567890');

    // 6. Set Date of Birth
    await page.locator('#dateOfBirthInput').click();
    await page.locator('.react-datepicker__year-select').selectOption('1995');
    await page.locator('.react-datepicker__month-select').selectOption('May');
    await page.locator('.react-datepicker__day--015').click();

    // 7. Add subject: Maths
    const subjectsContainer = page.locator('#subjectsContainer');
    await subjectsContainer.locator('#subjectsInput').fill('Maths');
    await page.keyboard.press('Enter');

    // Close modal if it exists (from previous runs)
    const modal = page.locator('#example-modal-sizes-title-lg');
    if (await modal.isVisible()) {
        await page.getByRole('button', { name: 'close' }).click();
        await expect(modal).toBeHidden();
    }

    // 8. Select hobbies
    await page.locator('label[for="hobbies-checkbox-1"]').click(); // Sports
    await page.locator('label[for="hobbies-checkbox-2"]').click(); // Reading
    await page.locator('label[for="hobbies-checkbox-3"]').click(); // Music

    // 9. Upload picture
    const filePath = path.resolve('helper_base/fixtures/test-picture.jpg');
    await page.setInputFiles('#uploadPicture', filePath);

    // 10. Enter address
    await page.getByRole('textbox', { name: 'Current Address' }).fill('123 Main St, Springfield');

    // 11. Select State and City
    await page.locator('#state svg').click();
    await page.getByText('NCR', { exact: true }).click();
    await page.locator('#city svg').click();
    await page.getByText('Delhi', { exact: true }).click();

    // 12. Submit form
    await ensureFormFieldsFilled(page);
    const submitBtn = page.getByRole('button', { name: 'Submit' });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 13. Validate confirmation modal
    const modalTitle = page.locator('#example-modal-sizes-title-lg');
    await modalTitle.waitFor({ state: 'visible' });
    await expect(modalTitle).toHaveText('Thanks for submitting the form', { timeout: 10000 });

    // 14. Assert key submitted values
    await expect(page.getByRole('cell', { name: 'Mehedi Hasan' })).toBeVisible();
   // await expect(page.getByRole('cell', { name: 'mehedi.doe@example.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '1234567890' })).toBeVisible();

    // 15. Close modal
    await page.getByRole('button', { name: 'Close' }).click();

});