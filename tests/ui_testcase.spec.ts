import { test, expect } from '@playwright/test';
import path from 'path';
import { Credentials } from '../helper_base/credentials';

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
    // 1. Go to form page
    /**
     - Ensure the form page loads successfully with all expected input fields visible.
     */

    await page.route('**/*', route => {
        return route.request().url().includes('ads') ? route.abort() : route.continue();
    });

    await page.goto('/automation-practice-form', { waitUntil: 'domcontentloaded' });


    // 2. Remove ads or footers that might block submit button
    /**
    - Remove ads or footer elements that might block the submit button.
    - Ensure ads/footer don’t block submit button after removal by script.
    - This is to prevent interference with form submission.
    - Ads & Footer Interference
    - Ensure ads/footer don’t block submit button after removal by script.
    - This is to prevent interference with form submission.
     */
    await page.evaluate(() => {
        const ad = document.getElementById('fixedban');
        if (ad) ad.remove();
        const footer = document.querySelector('footer');
        if (footer) footer.remove();
    });


    // 3. Fill personal details
    /** Fill Basic Details
  - Fill in First Name, Last Name, Email.
  - Verify each textbox accepts and retains input.
   */
    await page.getByRole('textbox', { name: 'First Name' }).fill('Mehedi');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Hasan');
    await page.getByRole('textbox', { name: 'name@example.com' }).fill('demo.doe@example.com');


    // 4. Select gender radio
    /** Gender Selection
   - Select each gender radio option (Male, Female, Other) and verify selection.
   - Ensure only one option can be selected at a time.
    */
    await page.getByText('Male', { exact: true }).click();
    // await page.getByRole('radio', { name: 'Male', exact: true }).check();


    // 5. Enter mobile number
    /** Mobile Number
  - Enter valid 10-digit mobile number.
  - Verify the input accepts only numbers.
       */
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill('1234567890');


    // 6. Set Date of Birth
    /** Date of Birth Picker
  - Click and select a valid date.
  - Verify selected date appears correctly in the field.
   */
    await page.locator('#dateOfBirthInput').click();
    await page.locator('.react-datepicker__year-select').selectOption('1995');
    await page.locator('.react-datepicker__month-select').selectOption('May');
    await page.locator('.react-datepicker__day--015').click();


    // 7. Add Subjects
    /** Subject Auto-complete
  - Type subject name (e.g., Maths) and select from suggestions.
  - Ensure the selected subject appears correctly.
  */
    const subjectsContainer = page.locator('#subjectsContainer');
    await subjectsContainer.locator('#subjectsInput').fill('Maths');
    await page.keyboard.press('Enter');

    // Close modal if it exists (from previous runs or tests)
    const modal = page.locator('#example-modal-sizes-title-lg');
    if (await modal.isVisible()) {
        await page.getByRole('button', { name: 'close' }).click();
        // Wait for modal to be hidden
        await expect(modal).toBeHidden();

    }

    // 8. Select Hobbies safely
    /** Hobbies Selection
 - Select multiple checkboxes (Sports, Reading, Music).
 - Verify selected hobbies reflect in submission.
   */
    await page.locator('label[for="hobbies-checkbox-1"]').click(); // Sports
    await page.locator('label[for="hobbies-checkbox-2"]').click(); // Reading
    await page.locator('label[for="hobbies-checkbox-3"]').click(); // Music


    // 9. Upload picture
    /** File Upload
   - Upload a sample JPG file.
   - Ensure the file name appears on the form.
       */
    const filePath = path.resolve('helper_base/fixtures/test-picture.jpg');
    // await page.getByRole('button', { name: 'Select picture' }).click();
    await page.setInputFiles('#uploadPicture', filePath);


    // 10. Enter Current Address
    /** Current Address
  - Enter text in the address field.
 - Verify long text inputs are accepted.
   */
    await page.locator('#currentAddress').click();
    await page.getByRole('textbox', { name: 'Current Address' }).fill('123 Main St, Springfield');


    // 11. Choose State and City
    /** State and City Dropdowns
    - Select NCR as state and Delhi as city.
   - Ensure dependent dropdowns load correctly.
    */
    await page.locator('#state svg').click();
    await page.getByText('NCR', { exact: true }).click();
    await page.locator('#city svg').click();
    await page.getByText('Delhi', { exact: true }).click();


    // 3. Fill personal details
    await page.getByRole('textbox', { name: 'First Name' }).fill('Mehedi');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Hasan');
    await page.getByRole('textbox', { name: 'name@example.com' }).fill('demo.doe@example.com');

    // 4. Select gender radio
    await page.getByText('Male', { exact: true }).click();

    // 5. Enter mobile number
    await page.getByRole('textbox', { name: 'Mobile Number' }).fill('1234567890');

    // 6. Set Date of Birth
    await page.locator('#dateOfBirthInput').click();
    await page.locator('.react-datepicker__year-select').selectOption('1995');
    await page.locator('.react-datepicker__month-select').selectOption('May');
    await page.locator('.react-datepicker__day--015').click();

    // 7. Add Subjects
    await subjectsContainer.locator('#subjectsInput').fill('Maths');
    page.waitForTimeout(1000); // Wait for suggestions to appear
    await page.keyboard.press('Enter');


    /**
    - Click Submit button.
    - Verify confirmation modal appears with submitted data.
     */
    // Submit form
    await page.getByRole('button', { name: 'Submit' }).click();


    // Assert confirmation modal
    /**
     - Assert that modal displays correct values (name, email, mobile, etc.).
    */
    const modalTitle = page.locator('#example-modal-sizes-title-lg');
    await expect(modalTitle).toHaveText('Thanks for submitting the form', { timeout: 10000 });

    // Assert key submission data
    /**
      Modal Close
    - Click on 'Close' button.
    - Verify modal disappears.

    Validation Errors (Negative)
    - Submit without filling required fields.
    - Ensure error validation styles appear.
     */
    const table = page.locator('td');
    await expect(page.getByRole('cell', { name: 'Mehedi Hasan' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'demo.doe@example.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '1234567890' })).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Close' }).click();

});