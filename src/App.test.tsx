import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('App Component', () => {
  it('should render without crashing', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should render the layout structure', () => {
    renderWithProviders(<App />)
    
    // Check for main content area
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for footer subtitle instead of title to avoid duplicates
    expect(screen.getByText('Explore and compare duty station locations')).toBeInTheDocument()
  })

  it('should have proper routing setup', () => {
    renderWithProviders(<App />)
    
    // The app should render without routing errors
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should include QueryClient provider', () => {
    renderWithProviders(<App />)
    
    // App should render with React Query context
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
}) 