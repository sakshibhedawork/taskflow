import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  )
}

describe('LandingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  /* ── Nav ── */
  it('renders TaskFlow in the nav', () => {
    renderLanding()
    expect(screen.getAllByText('TaskFlow').length).toBeGreaterThan(0)
  })

  it('renders nav links', () => {
    renderLanding()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Workflow')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('nav Open Board button navigates to /board', () => {
    renderLanding()
    fireEvent.click(screen.getAllByText('Open Board')[0])
    expect(mockNavigate).toHaveBeenCalledWith('/board')
  })

  /* ── Hero ── */
  it('renders hero heading words', () => {
    renderLanding()
    expect(screen.getByText('Move the')).toBeInTheDocument()
    expect(screen.getByText('backlog.')).toBeInTheDocument()
  })

  it('renders hero sub text', () => {
    renderLanding()
    expect(screen.getByText(/focused kanban board/i)).toBeInTheDocument()
  })

  it('renders No setup required button', () => {
    renderLanding()
    expect(screen.getByText('No setup required')).toBeInTheDocument()
  })

  it('renders trust text', () => {
    renderLanding()
    expect(screen.getByText(/Trusted by 180\+ engineering teams/i)).toBeInTheDocument()
  })

  /* ── Feature strip ── */
  it('renders all 5 feature strip items', () => {
    renderLanding()
    expect(screen.getByText('Kanban board')).toBeInTheDocument()
    expect(screen.getByText('Drag & drop')).toBeInTheDocument()
    expect(screen.getByText('Activity log')).toBeInTheDocument()
    expect(screen.getByText('Search & filter')).toBeInTheDocument()
    expect(screen.getByText('Persisted state')).toBeInTheDocument()
  })

  /* ── Features section ── */
  it('renders features eyebrow', () => {
    renderLanding()
    expect(screen.getByText('Why TaskFlow')).toBeInTheDocument()
  })

  it('renders all 3 feature titles', () => {
    renderLanding()
    expect(screen.getByText('Visual Kanban board')).toBeInTheDocument()
    expect(screen.getByText('Smart search & filter')).toBeInTheDocument()
    expect(screen.getByText('Automatic activity log')).toBeInTheDocument()
  })

  /* ── CTA ── */
  it('renders CTA heading', () => {
    renderLanding()
    expect(screen.getByText(/Ready to clear/i)).toBeInTheDocument()
  })

  it('CTA button navigates to /board', () => {
    renderLanding()
    fireEvent.click(screen.getByText(/Open Board — it's free/i))
    expect(mockNavigate).toHaveBeenCalledWith('/board')
  })

  /* ── Footer ── */
  it('renders footer copyright text', () => {
    renderLanding()
    expect(screen.getByText(/Senior Frontend Engineer Assignment/i)).toBeInTheDocument()
  })
})
