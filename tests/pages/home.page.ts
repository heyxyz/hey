import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBar = page.getByPlaceholder('Search...');
  }

  async open() {
    await this.page.goto('/');
  }

  async search(keyword: string) {
    await this.searchBar.fill(keyword);
    await this.searchBar.press('Enter');
  }
}
