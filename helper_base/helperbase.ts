import { Page } from '@playwright/test';

export async function ensureFormFieldsFilled(page: Page): Promise<void> {
    const firstName = page.getByRole('textbox', { name: 'First Name' });
    const lastName = page.getByRole('textbox', { name: 'Last Name' });
    const phone = page.getByRole('textbox', { name: 'Mobile Number' });
    const genderRadio = page.locator('input#gender-radio-1'); // Male

    const firstNameValue = await firstName.inputValue();
    if (!firstNameValue.trim()) {
        await firstName.fill('Mehedi');
    }

    const lastNameValue = await lastName.inputValue();
    if (!lastNameValue.trim()) {
        await lastName.fill('Hasan');
    }

    const phoneValue = await phone.inputValue();
    if (!phoneValue.trim()) {
        await phone.fill('1234567890');
    }

    const isGenderChecked = await genderRadio.isChecked();
    if (!isGenderChecked) {
        await page.locator('label[for="gender-radio-1"]').click();
    }
}