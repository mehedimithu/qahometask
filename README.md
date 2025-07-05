# qahometask

✅ DemoQA Automated Test Project
================================

This project contains automated test cases using Playwright to validate the following DemoQA modules:

🔹 Automation Practice Form: https://demoqa.com/automation-practice-form
🔹 Web Tables CRUD Operations: https://demoqa.com/webtables
🔹 Books API: https://demoqa.com/books (Swagger: https://demoqa.com/swagger/)

----------------------------------------

📁 Project Structure
--------------------

tests/
├── form_ui.spec.ts          - UI Tests for the Practice Form
├── webtables_crud.spec.ts   - UI Tests for Web Tables (CRUD)
├── api_test.spec.ts         - API Tests for Books
helper_base/
├── credentials.ts           - Reusable config or test data
playwright.config.ts         - Playwright configuration
README.txt                   - This file

----------------------------------------

🚀 Installation Guide
----------------------

1. Clone the repository:
   git clone https://github.com/mehedimithu/qahometask.git
   cd qahometask-playwright-tests

2. Install project dependencies:
   npm install

3. Install Playwright browsers:
   npx playwright install

----------------------------------------

🧪 How to Run the Tests
------------------------

To run all tests:
   npx playwright test

To run the Form UI test only:
   npx playwright test tests/ui_testcase.spec.ts

To run the Web Tables CRUD test only:
   npx playwright test tests/webtables_crud.spec.ts

To run the Books API test only:
   npx playwright test tests/api_test.spec.ts

----------------------------------------

📸 View HTML Report
--------------------

After running any tests, you can open the test report by running:
   npx playwright show-report

----------------------------------------

⚙️ Configuration
-----------------

You can customize test settings (like base URL, timeout, etc.) in the `playwright.config.ts` file.

----------------------------------------

📞 Support
-----------

For questions or issues, contact: mhasan172036@mscse.uiu.ac.bd
Or open an issue in the repository.