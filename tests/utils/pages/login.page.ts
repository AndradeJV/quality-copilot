import { test, expect } from '@playwright/test';

import { Page, Locator } from '@playwright/test';

export class LoginPage {
	readonly page: Page;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;
	readonly loadingText: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailInput = page.getByTestId('email-input');
		this.passwordInput = page.getByTestId('password-input');
		this.submitButton = page.getByRole('button', { name: 'Entrar' });
		this.loadingText = page.getByText('testando...');
	}

	async goto() {
		await this.page.goto('/login');
	}

	async login(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();
	}

	async isLoading() {
		return await this.loadingText.isVisible();
	}
}