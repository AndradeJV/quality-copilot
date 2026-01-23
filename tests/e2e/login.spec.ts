import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/pages/login.page';

test.describe('Login Page', () => {
	let loginPage: LoginPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		await loginPage.goto();
	});

	test('should display loading text when logging in', async () => {
		await loginPage.login('user@test.com', 'password123');
		expect(await loginPage.isLoading()).toBe(true);
	});

	test('should login successfully with valid credentials', async () => {
		await loginPage.login('user@test.com', 'password123');
		await expect(page).toHaveURL('/dashboard');
	});

	test('should show error message with invalid credentials', async () => {
		await loginPage.login('invalid@test.com', 'wrongpassword');
		await expect(page).toHaveText('Invalid credentials');
	});

	test('should render input fields correctly', async () => {
		await expect(loginPage.emailInput).toBeVisible();
		await expect(loginPage.passwordInput).toBeVisible();
	});

	test('should disable button when inputs are empty', async () => {
		await expect(loginPage.submitButton).toBeDisabled();
	});
});