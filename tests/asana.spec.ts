import { test, expect, Page } from '@playwright/test';

const testCases = [
  {
    project: 'Web Application',
    task: 'Implement user authentication',
    column: 'To Do',
    tags: ['Feature', 'High Priority'],
  },
  {
    project: 'Web Application',
    task: 'Fix navigation bug',
    column: 'To Do',
    tags: ['Bug'],
  },
  {
    project: 'Web Application',
    task: 'Design system updates',
    column: 'In Progress',
    tags: ['Design'],
  },
  {
    project: 'Mobile Application',
    task: 'Push notification system',
    column: 'To Do',
    tags: ['Feature'],
  },
  {
    project: 'Mobile Application',
    task: 'Offline mode',
    column: 'In Progress',
    tags: ['Feature', 'High Priority'],
  },
  {
    project: 'Mobile Application',
    task: 'App icon design',
    column: 'Done',
    tags: ['Design'],
  },
];

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
  await page.waitForTimeout(500);
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