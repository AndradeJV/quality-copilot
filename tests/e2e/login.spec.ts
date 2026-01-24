import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/pages/login.page';

test.describe('Login', () => {
	test.beforeEach(async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
	});

	test('should display loading text when logging in', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login('user@test.com', 'password123');
		expect(await loginPage.isLoadingTextVisible()).toBe(true);
	});

	test('should login successfully with valid credentials', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login('user@test.com', 'password123');
		await expect(page).toHaveURL('/dashboard');
	});

	test('should show error message with invalid credentials', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login('invalid@test.com', 'wrongpassword');
		await expect(page.getByText('Invalid credentials')).toBeVisible();
	});

	test('should not allow login with empty fields', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.login('', '');
		await expect(page.getByText('Email is required')).toBeVisible();
		await expect(page.getByText('Password is required')).toBeVisible();
	});
});