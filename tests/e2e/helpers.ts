import AxeBuilder from '@axe-core/playwright'
import type { Page, TestInfo } from '@playwright/test'
import { expect, test } from '@playwright/test'

// a11y regressions do not meaningfully differ by viewport width on this app —
// the same components mount in both desktop and mobile. Running the scan once
// (desktop chromium) catches everything the mobile run would, without paying
// for a second full Playwright browser per check.
export function skipA11yOnMobile(testInfo: TestInfo) {
  test.skip(
    testInfo.project.name !== 'chromium',
    'a11y scan is run only on the chromium project'
  )
}

export async function expectNoSeriousA11yViolations(
  page: Page,
  testInfo: TestInfo,
  label: string
) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    // Brand wordmark "MetaPhase" uses the brand orange; treated like a logo
    // per WCAG 1.4.3 Exception for logos/branding. Skip it on contrast checks.
    .exclude('[data-brand="metaphase"]')
    .analyze()

  const blocking = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  )

  if (blocking.length > 0) {
    await testInfo.attach(`axe-violations-${label}.json`, {
      body: JSON.stringify(blocking, null, 2),
      contentType: 'application/json',
    })
  }

  expect(blocking, `axe violations on ${label}`).toEqual([])
}
