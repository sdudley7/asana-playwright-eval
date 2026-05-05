import { test, expect, Page } from '@playwright/test';
import { testCases } from '../testData/tasks';

async function login(page: Page) {
  await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');

  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('button', { name: /Web Application Main web/i })).toBeVisible();
}

async function navigateToProject(page: Page, projectName: string) {
  const projectButtonName =
    projectName === 'Web Application'
      ? /Web Application/i
      : /Mobile Application/i;

  await page.getByRole('button', { name: projectButtonName }).click();
  await page.waitForTimeout(3500);
}

test.describe('Asana-style task board', () => {
  for (const testCase of testCases) {
    test(`verifies "${testCase.task}" is in ${testCase.column} with correct tags`, async ({ page }) => {
      await login(page);
      await navigateToProject(page, testCase.project);

      const column = page
        .locator('div')
        .filter({ hasText: new RegExp(`^${testCase.column}$`) })
        .locator('xpath=ancestor::div[contains(@class, "bg-gray") or contains(@class, "rounded")][1]');

const taskCard = page
  .locator('div')
  .filter({ has: page.getByText(testCase.task, { exact: true }) })
  .filter({ hasText: testCase.column })
  .first();

await expect(taskCard).toBeVisible();
await expect(taskCard).toContainText(testCase.task);
await expect(taskCard).toContainText(testCase.column);

for (const tag of testCase.tags) {
  await expect(taskCard).toContainText(tag);
}
      
    });
  }
});