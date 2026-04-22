import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    exclude: ['node_modules', 'dist', 'tests/e2e/**', 'playwright-report/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/components/ui/**',
        'src/hooks/use-toast.ts',
      ],
      // vitest 4 + @vitest/coverage-v8 v4 count branches more aggressively
      // than v3 (every optional chain / nullish-coalesce / short-circuit
      // logical op registers). The same test suite dropped from ~78% to
      // ~47% branch coverage on the upgrade with zero real regression.
      // Thresholds re-baselined against the current measurement.
      thresholds: {
        lines: 50,
        statements: 50,
        functions: 50,
        branches: 40,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
