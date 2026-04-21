import { expect, test } from '@playwright/test'
import { expectNoSeriousA11yViolations } from './helpers'

test.describe('Homepage', () => {
  test('renders the hero and search affordance', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { level: 1, name: /explore your next cbp assignment/i })
    ).toBeVisible()

    // Two searchboxes today (banner + hero). Assert at least one is visible.
    await expect(
      page.getByRole('searchbox', { name: /search cbp duty locations/i }).first()
    ).toBeVisible()
  })

  test('shows station suggestions when the user types a query', async ({ page }) => {
    await page.goto('/')

    // Use the hero searchbox (inside main), not the banner one.
    const searchBox = page
      .locator('main')
      .getByRole('searchbox', { name: /search cbp duty locations/i })
    await searchBox.fill('Presidio')

    const suggestions = page.getByRole('listbox', {
      name: /cbp duty location suggestions/i,
    })
    await expect(suggestions).toBeVisible()
    await expect(suggestions.getByRole('button').first()).toBeVisible()
  })

  test('meets WCAG 2.1 AA on the homepage', async ({ page }, testInfo) => {
    await page.goto('/')
    await expectNoSeriousA11yViolations(page, testInfo, 'homepage')
  })
})
