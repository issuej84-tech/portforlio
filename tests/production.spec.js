const { test, expect } = require('@playwright/test');

async function expectEstimate(page, { value, label, low, high, fill }) {
  const slider = page.locator('#followers');
  await expect(slider).toHaveValue(value);
  await expect(page.locator('#followers-label')).toHaveText(label);
  await expect(page.locator('#low')).toHaveText(`${low} ₽`);
  await expect(page.locator('#high')).toHaveText(`${high} ₽`);
  const percentage = await slider.evaluate(element =>
    parseFloat(element.style.getPropertyValue('--fill')),
  );
  expect(percentage).toBeCloseTo(fill, 5);
}

test.describe('LUMERA income calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lumera/index.html');
  });

  test('initializes estimates and fill from the default audience', async ({ page }) => {
    // The static fallback differs from the calculated upper estimate.
    await expectEstimate(page, {
      value: '170', label: '170 тыс.', low: '340 000', high: '1 734 000',
      fill: 16.1616161616,
    });
  });

  test('updates both bounds, rounding, labels and fill on real slider input', async ({ page }) => {
    const slider = page.locator('#followers');
    await slider.focus();
    await slider.press('Home');
    await expectEstimate(page, {
      value: '10', label: '10 тыс.', low: '20 000', high: '102 000', fill: 0,
    });
    await slider.press('ArrowLeft');
    await expect(slider).toHaveValue('10');
    await slider.press('ArrowRight');
    await expectEstimate(page, {
      value: '20', label: '20 тыс.', low: '40 000', high: '204 000',
      fill: 1.0101010101,
    });
    await slider.press('End');
    await expectEstimate(page, {
      value: '1000', label: '1 млн+', low: '2 000 000', high: '10 200 000', fill: 100,
    });
    await slider.press('ArrowRight');
    await expect(slider).toHaveValue('1000');
    await slider.press('ArrowLeft');
    await expectEstimate(page, {
      value: '990', label: '990 тыс.', low: '1 980 000', high: '10 098 000',
      fill: 98.9898989899,
    });
    await slider.press('Home');
    await expectEstimate(page, {
      value: '10', label: '10 тыс.', low: '20 000', high: '102 000', fill: 0,
    });
  });
});

for (const demo of [
  { name: 'LUMERA', path: '/lumera/index.html' },
  { name: 'Zvonix AI', path: '/zvonix/index.html' },
]) {
  test(`opens ${demo.name} from the portfolio and returns home`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: new RegExp(demo.name) }).click();
    await expect(page).toHaveURL(demo.path);
    await expect(page.locator('h1')).toBeVisible();
    await page.getByRole('link', { name: '← Назад в портфолио' }).click();
    await expect(page).toHaveURL('/index.html');
    await expect(page.getByRole('link', { name: new RegExp(demo.name) })).toBeVisible();
  });
}

test('404 demo recovers to Zvonix, then back to the portfolio', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Страница 404/ }).click();
  await expect(page).toHaveURL('/zvonix/404.html');
  await page.getByRole('link', { name: /На главную/ }).click();
  await expect(page).toHaveURL('/zvonix/index.html');
  await expect(page.locator('h1')).toBeVisible();
  await page.getByRole('link', { name: '← Назад в портфолио' }).click();
  await expect(page).toHaveURL('/index.html');
});
