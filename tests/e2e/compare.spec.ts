import { expect, test } from '@playwright/test'
import { expectNoSeriousA11yViolations, skipA11yOnMobile } from './helpers'

test.describe('Compare page', () => {
  test('loads with a heading and selectors', async ({ page }) => {
    await page.goto('/compare')
    await expect(
      page.getByRole('heading', { level: 1, name: /compare duty stations/i })
    ).toBeVisible()
    await expect(
      page.getByRole('combobox', { name: /first duty station/i })
    ).toBeVisible()
  })

  test('meets WCAG 2.1 AA on the compare page', async ({ page }, testInfo) => {
    skipA11yOnMobile(testInfo)
    await page.goto('/compare')
    await page
      .getByRole('heading', { level: 1, name: /compare duty stations/i })
      .waitFor()
    await expectNoSeriousA11yViolations(page, testInfo, 'compare')
  })
})
