import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/pages/login.page';

test.describe('Login', () => {
	test('should display loading text when logging in', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('user@test.com', 'password123');
		expect(await loginPage.isLoading()).toBe(true);
	});

	test('should login successfully with valid credentials', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('user@test.com', 'password123');
		await expect(page).toHaveURL('/dashboard');
	});

	test('should show error message with invalid credentials', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('invalid@test.com', 'wrongpassword');
		await expect(page.getByText('Invalid credentials')).toBeVisible();
	});

	test('should render login components correctly', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await expect(loginPage.emailInput).toBeVisible();
		await expect(loginPage.passwordInput).toBeVisible();
		await expect(loginPage.submitButton).toBeVisible();
	});

	test('should disable submit button when loading', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('user@test.com', 'password123');
		await expect(loginPage.submitButton).toBeDisabled();
	});
});