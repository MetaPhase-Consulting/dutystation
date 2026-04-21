import { expect, test } from '@playwright/test'
import { expectNoSeriousA11yViolations } from './helpers'

const SMOKE_STATION_ID = 'presidio-station'

test.describe('Station detail', () => {
  test('renders a known station by id', async ({ page }) => {
    await page.goto(`/station/${SMOKE_STATION_ID}`)

    // Station name should appear in an h1 or h2; match either.
    const heading = page.getByRole('heading', { name: /presidio/i }).first()
    await expect(heading).toBeVisible()
  })

  test('exposes at least one external resource link', async ({ page }) => {
    await page.goto(`/station/${SMOKE_STATION_ID}`)

    // External links on station detail should use target=_blank and have
    // rel="noopener noreferrer" by convention.
    const externalLinks = page.locator('a[target="_blank"]')
    await expect(externalLinks.first()).toBeVisible()
  })

  test('falls back to NotFound for an unknown station id', async ({ page }) => {
    const response = await page.goto('/station/does-not-exist-123')
    expect(response?.status()).toBeLessThan(500)
    // App handles unknown stations in-route; verify no uncaught React error
    // boundary splash.
    await expect(page.getByText(/application error/i)).toHaveCount(0)
  })

  test('meets WCAG 2.1 AA on station detail', async ({ page }, testInfo) => {
    await page.goto(`/station/${SMOKE_STATION_ID}`)
    await page.getByRole('heading', { name: /presidio/i }).first().waitFor()
    await expectNoSeriousA11yViolations(page, testInfo, 'station-detail')
  })
})
