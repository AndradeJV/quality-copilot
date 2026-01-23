import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/pages/login.page';

const validEmail = 'user@test.com';
const validPassword = 'password123';
const invalidEmail = 'invalid@test.com';
const invalidPassword = 'wrongpassword';

test.describe('Login', () => {
	test.beforeEach(async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
	});

	test('should login successfully with valid credentials', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(validEmail, validPassword);
		await expect(page).toHaveURL('/dashboard');
	});

	test('should show loading text when logging in', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(validEmail, validPassword);
		await expect(loginPage.isLoadingVisible()).resolves.toBeTruthy();
	});

	test('should show error with invalid credentials', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login(invalidEmail, invalidPassword);
		await expect(page.locator('.error-message')).toBeVisible();
	});

	test('should render login page correctly', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await expect(loginPage.emailInput).toBeVisible();
		await expect(loginPage.passwordInput).toBeVisible();
		await expect(loginPage.submitButton).toBeVisible();
	});
});