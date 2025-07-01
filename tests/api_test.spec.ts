import { test, expect, request, APIRequestContext } from '@playwright/test';
import { Credentials } from '../helper_base/credentials';

const BASE_URL = Credentials.BASE_URL;
const TEST_USER = Credentials.TEST_USER;

// Run tests serially
test.describe.configure({ mode: 'serial' });

test.describe('📚 DemoQA Book Store API', () => {
    let context: APIRequestContext;
    let token: string;
    let userId: string;
    let isbn: string;

    test.beforeAll(async () => {
        context = await request.newContext();

        // 1. Create User
        const createUserRes = await context.post(`${BASE_URL}/Account/v1/User`, {
            data: TEST_USER,
            headers: { 'Content-Type': 'application/json' }
        });

        expect(createUserRes.status()).toBe(201);
        const createUserBody = await createUserRes.json();
        expect(createUserBody.username).toBe(TEST_USER.userName);
        expect(createUserBody.userID).toBeDefined();

        userId = createUserBody.userID;

        console.log(`✅ User created: ${createUserBody.username} (ID: ${userId})`);

        // 2. Generate Token
        const tokenRes = await context.post(`${BASE_URL}/Account/v1/GenerateToken`, {
            data: TEST_USER,
            headers: { 'Content-Type': 'application/json' }
        });

        expect(tokenRes.status()).toBe(200);
        token = (await tokenRes.json()).token;
        expect(token).toBeDefined();
    });

    test('📘 Get Books', async () => {
        const booksRes = await context.get(`${BASE_URL}/BookStore/v1/Books`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        expect(booksRes.status()).toBe(200);
        const books = await booksRes.json();
        expect(books.books.length).toBeGreaterThan(0);
        isbn = books.books[0].isbn;

        console.log(`📚 Fetched Books. Sample ISBN: ${isbn}`);
    });

    test('➕ Add Book to User', async () => {
        const addBookRes = await context.post(`${BASE_URL}/BookStore/v1/Books`, {
            data: {
                userId,
                collectionOfIsbns: [{ isbn }]
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        expect(addBookRes.status()).toBe(201);
        const responseBody = await addBookRes.json();
        expect(responseBody.books).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ isbn })
            ])
        );

        console.log(`✅ Book with ISBN ${isbn} added to user.`);
    });

    test('➖ Delete Book from User', async () => {
        const deleteBookRes = await context.delete(`${BASE_URL}/BookStore/v1/Book`, {
            data: { isbn, userId },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        expect([200, 204]).toContain(deleteBookRes.status());
        console.log(`🗑️ Book with ISBN ${isbn} deleted.`);
    });

    test('🧹 Delete User', async () => {
        const deleteUserRes = await context.delete(`${BASE_URL}/Account/v1/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        expect([200, 204]).toContain(deleteUserRes.status());
        console.log(`🧍‍♂️ User with ID ${userId} deleted.`);
    });

    test.afterAll(async () => {
        await context.dispose();
    });
});