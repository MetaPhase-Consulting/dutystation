import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '../HomePage'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('HomePage Component', () => {
  it('should render the main heading', () => {
    renderWithRouter(<HomePage />)
    expect(screen.getByText(/Find Your Next Duty Station/i)).toBeInTheDocument()
  })

  it('should render the search functionality', () => {
    renderWithRouter(<HomePage />)
    
    // Check for search input
    const searchInput = screen.getByPlaceholderText(/Search Duty Stations/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should render navigation sections', () => {
    renderWithRouter(<HomePage />)
    
    // Check for directory section
    expect(screen.getByText('Directory')).toBeInTheDocument()
    
    // Check for compare section
    expect(screen.getByText('Compare')).toBeInTheDocument()
    
    // Check for data sources section
    expect(screen.getByText('Data Sources')).toBeInTheDocument()
  })

  it('should display station information', () => {
    renderWithRouter(<HomePage />)
    
    // Should display information about duty stations - check for specific text
    expect(screen.getByText(/Browse duty stations with interactive list/i)).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    renderWithRouter(<HomePage />)
    
    // Check for proper heading structure
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
    
    // Check for search input accessibility
    const searchInput = screen.getByPlaceholderText(/Search Duty Stations/i)
    expect(searchInput).toHaveAttribute('type', 'search')
  })

  it('should render action buttons', () => {
    renderWithRouter(<HomePage />)
    
    // Check for search button
    expect(screen.getByText('Search')).toBeInTheDocument()
    
    // Check for explore stations button
    expect(screen.getByText('Explore Stations')).toBeInTheDocument()
    
    // Check for compare stations button
    expect(screen.getByText('Compare Stations')).toBeInTheDocument()
  })
}) 