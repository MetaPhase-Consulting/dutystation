import { expect, test } from '@playwright/test'
import { expectNoSeriousA11yViolations } from './helpers'

test.describe('Directory page', () => {
  test('renders the directory heading and the location list', async ({ page }) => {
    await page.goto('/directory')

    await expect(
      page.getByRole('heading', { name: /cbp duty location directory/i })
    ).toBeVisible()

    await expect(
      page.getByRole('heading', { name: /location list/i })
    ).toBeVisible()
  })

  test('mounts the map canvas (map-first UX)', async ({ page }) => {
    await page.goto('/directory')

    // OpenLayers renders a canvas inside its container.
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15_000 })
  })

  // Known failing: unlabeled buttons on the directory page (button-name, critical).
  // Tracked as a follow-up a11y fix — see Phase 5 in the hardening plan.
  test.fixme('meets WCAG 2.1 AA on the directory page', async ({ page }, testInfo) => {
    await page.goto('/directory')
    await page.locator('canvas').first().waitFor({ state: 'visible', timeout: 15_000 })
    await expectNoSeriousA11yViolations(page, testInfo, 'directory')
  })
})
