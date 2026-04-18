import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

const mockSetSearch        = vi.fn()
const mockSetAssigneeFilter = vi.fn()
const mockSetPriorityFilter = vi.fn()
const mockClearFilters     = vi.fn()

let mockFilters = { search: '', assigneeId: '', priority: '' }

vi.mock('../store/taskStore', () => ({
  useTaskStore: () => ({
    get filters() { return mockFilters },
    setSearch: mockSetSearch,
    setAssigneeFilter: mockSetAssigneeFilter,
    setPriorityFilter: mockSetPriorityFilter,
    clearFilters: mockClearFilters,
  }),
}))

vi.mock('../data/assignees', () => ({
  ASSIGNEES: [
    { id: 'a1', name: 'Alex Chen',    color: '#000' },
    { id: 'a2', name: 'Sarah Kim',    color: '#000' },
  ],
}))

function renderHeader(onNewTask = vi.fn()) {
  render(
    <MemoryRouter>
      <Header onNewTask={onNewTask} />
    </MemoryRouter>
  )
  return { onNewTask }
}

describe('Header', () => {
  beforeEach(() => {
    mockFilters = { search: '', assigneeId: '', priority: '' }
    vi.clearAllMocks()
  })

  it('renders TaskFlow logo text', () => {
    renderHeader()
    expect(screen.getByText('TaskFlow')).toBeInTheDocument()
  })

  it('renders search input with placeholder', () => {
    renderHeader()
    expect(screen.getByPlaceholderText('Search tasks…')).toBeInTheDocument()
  })

  it('renders All assignees option', () => {
    renderHeader()
    expect(screen.getByText('All assignees')).toBeInTheDocument()
  })

  it('renders assignee options from ASSIGNEES list', () => {
    renderHeader()
    expect(screen.getByText('Alex Chen')).toBeInTheDocument()
    expect(screen.getByText('Sarah Kim')).toBeInTheDocument()
  })

  it('renders All priorities option', () => {
    renderHeader()
    expect(screen.getByText('All priorities')).toBeInTheDocument()
  })

  it('renders all priority options', () => {
    renderHeader()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('renders New Task button', () => {
    renderHeader()
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })

  it('calls onNewTask when New Task is clicked', () => {
    const { onNewTask } = renderHeader()
    fireEvent.click(screen.getByText('New Task'))
    expect(onNewTask).toHaveBeenCalledOnce()
  })

  it('calls setSearch when typing in search', () => {
    renderHeader()
    fireEvent.change(screen.getByPlaceholderText('Search tasks…'), {
      target: { value: 'auth' },
    })
    expect(mockSetSearch).toHaveBeenCalledWith('auth')
  })

  it('calls setAssigneeFilter when assignee select changes', () => {
    renderHeader()
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'a1' } })
    expect(mockSetAssigneeFilter).toHaveBeenCalledWith('a1')
  })

  it('calls setPriorityFilter when priority select changes', () => {
    renderHeader()
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[1], { target: { value: 'high' } })
    expect(mockSetPriorityFilter).toHaveBeenCalledWith('high')
  })

  it('does not show Clear button when no filters active', () => {
    renderHeader()
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('shows Clear button when search filter is active', () => {
    mockFilters = { search: 'auth', assigneeId: '', priority: '' }
    renderHeader()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('shows Clear button when assignee filter is active', () => {
    mockFilters = { search: '', assigneeId: 'a1', priority: '' }
    renderHeader()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('calls clearFilters when Clear button clicked', () => {
    mockFilters = { search: 'x', assigneeId: '', priority: '' }
    renderHeader()
    fireEvent.click(screen.getByText('Clear'))
    expect(mockClearFilters).toHaveBeenCalledOnce()
  })
})
