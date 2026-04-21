import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Layout } from '../Layout'
import { renderWithRouterAndQueryClient } from '@/test/test-utils'

const renderWithRouter = (component: React.ReactElement) => {
  return renderWithRouterAndQueryClient(component)
}

describe('Layout Component', () => {
  it('should render the footer with correct content', () => {
    renderWithRouter(<Layout />)

    // Brand title renders in both nav and footer
    expect(screen.getAllByText('Duty Station Relocation').length).toBeGreaterThan(0)

    // Check for Open Source link
    expect(screen.getByText('Open Source')).toBeInTheDocument()

    // Check for MetaPhase link
    expect(screen.getByText(/Built by/)).toBeInTheDocument()
    expect(screen.getByText('MetaPhase')).toBeInTheDocument()
  })

  it('should have correct links in footer', () => {
    renderWithRouter(<Layout />)
    
    // Check GitHub link
    const githubLink = screen.getByText('Open Source').closest('a')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/MetaPhase-Consulting/dutystation')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    // Check MetaPhase link
    const metaphaseLink = screen.getByText('MetaPhase').closest('a')
    expect(metaphaseLink).toHaveAttribute('href', 'https://metaphase.tech/')
    expect(metaphaseLink).toHaveAttribute('target', '_blank')
    expect(metaphaseLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render the compass icon', () => {
    renderWithRouter(<Layout />)
    
    const icon = screen.getByAltText('Compass Icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute('src', '/greencompassimg.png')
  })

  it('should have proper styling classes', () => {
    renderWithRouter(<Layout />)

    // The footer brand mark lives inside an anchor to the MetaPhase link-less
    // home link; pick the one inside the <footer> element.
    const footer = screen.getAllByText('Duty Station Relocation').find((el) =>
      el.closest('footer') !== null
    )
    expect(footer).toBeDefined()
    expect(footer!).toHaveClass('font-bold')
    expect(footer!).toHaveClass('text-[#1F631A]')
  })
}) 
