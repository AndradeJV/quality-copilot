import { test, expect } from '@playwright/test';

class LoginPage {
	constructor(page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('/login');
	}

	async fillUsername(username) {
		await this.page.fill('[data-testid="username-input"]', username);
	}

	async fillPassword(password) {
		await this.page.fill('[data-testid="password-input"]', password);
	}

	async submit() {
		await this.page.click('[data-testid="submit-button"]');
	}

	async waitForLoading() {
		await this.page.waitForSelector('[data-testid="loading-indicator"]', { state: 'hidden' });
	}

	async assertButtonLabel(expectedLabel) {
		const button = await this.page.locator('[data-testid="submit-button"]');
		await expect(button).toHaveText(expectedLabel);
	}
}

test.describe('Login Page', () => {
	test('should render login page and interact with elements', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await expect(page.locator('h1')).toHaveText('Login');
		await loginPage.fillUsername('testuser');
		await loginPage.fillPassword('password123');
		await loginPage.assertButtonLabel('Entrar');
		await loginPage.submit();
		await loginPage.waitForLoading();
	});

	test('should show loading state when logging in', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.fillUsername('testuser');
		await loginPage.fillPassword('password123');
		await loginPage.submit();
		await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();
	});

	test('should display correct button text during loading', async ({ page }) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.fillUsername('testuser');
		await loginPage.fillPassword('password123');
		await loginPage.submit();
		await loginPage.waitForLoading();
		await loginPage.assertButtonLabel('testando...');
	});
});