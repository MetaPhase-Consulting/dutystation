import { expect, test } from '@playwright/test'
import { expectNoSeriousA11yViolations, skipA11yOnMobile } from './helpers'

const SMOKE_STATION_ID = 'presidio-station'

test.describe('Station detail', () => {
  test('renders a known station by id', async ({ page }) => {
    await page.goto(`/station/${SMOKE_STATION_ID}`)
    const heading = page.getByRole('heading', { name: /presidio/i }).first()
    await expect(heading).toBeVisible()
  })

  test('meets WCAG 2.1 AA on station detail', async ({ page }, testInfo) => {
    skipA11yOnMobile(testInfo)
    await page.goto(`/station/${SMOKE_STATION_ID}`)
    await page.getByRole('heading', { name: /presidio/i }).first().waitFor()
    await expectNoSeriousA11yViolations(page, testInfo, 'station-detail')
  })

  test('renders the area-summary dashboard region', async ({ page }) => {
    await page.goto(`/station/${SMOKE_STATION_ID}`)
    const dashboard = page.getByRole('region', { name: /area snapshot/i })
    await expect(dashboard).toBeVisible()
  })

  test('renders real alpha-seed summary data for Abilene', async ({ page }) => {
    await page.goto('/station/abilene-station')
    // Abilene ZIP 79602 median home price from the alpha seed.
    await expect(page.getByText('$225,212')).toBeVisible()
    // Weather card — Abilene annual avg daily high in °F.
    await expect(page.getByText('79°F')).toBeVisible()
  })
})
