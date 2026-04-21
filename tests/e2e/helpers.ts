import AxeBuilder from '@axe-core/playwright'
import type { Page, TestInfo } from '@playwright/test'
import { expect } from '@playwright/test'

export async function expectNoSeriousA11yViolations(
  page: Page,
  testInfo: TestInfo,
  label: string
) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
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
