import { expect, test } from '@playwright/test'
import { expectNoSeriousA11yViolations, skipA11yOnMobile } from './helpers'

const ROUTES = [
  { path: '/compare', label: 'compare' },
  { path: '/data-sources', label: 'data-sources' },
]

for (const route of ROUTES) {
  test.describe(`Route: ${route.path}`, () => {
    test(`loads without crashing`, async ({ page }) => {
      const response = await page.goto(route.path)
      expect(response?.status()).toBeLessThan(500)
      // Verify at least one heading renders so we know the page mounted.
      await expect(page.getByRole('heading').first()).toBeVisible()
    })

    test(`meets WCAG 2.1 AA`, async ({ page }, testInfo) => {
      skipA11yOnMobile(testInfo)
      await page.goto(route.path)
      await page.getByRole('heading').first().waitFor()
      await expectNoSeriousA11yViolations(page, testInfo, route.label)
    })
  })
}

test.describe('Not-found route', () => {
  test('renders a 404-style page for an unknown path', async ({ page }) => {
    await page.goto('/this-is-not-a-real-page')
    await expect(page.getByText(/404|not found/i).first()).toBeVisible()
  })
})
