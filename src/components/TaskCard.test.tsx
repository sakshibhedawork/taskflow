import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import type { Task } from '../types/task'

const baseTask: Task = {
  id: 'task-1',
  title: 'Fix login bug',
  description: 'Auth module fails on timeout',
  assignee: { id: 'a1', name: 'Alex Chen', color: '#1c1917' },
  priority: 'high',
  status: 'in-progress',
  dueDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  activity: [],
}

function renderCard(task: Task = baseTask, onEdit = vi.fn(), onDelete = vi.fn()) {
  render(
    <DndContext>
      <SortableContext items={[task.id]}>
        <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
      </SortableContext>
    </DndContext>
  )
  return { onEdit, onDelete }
}

describe('TaskCard', () => {
  it('renders task title', () => {
    renderCard()
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
  })

  it('renders task description', () => {
    renderCard()
    expect(screen.getByText('Auth module fails on timeout')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    renderCard()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders assignee first name', () => {
    renderCard()
    expect(screen.getByText('Alex')).toBeInTheDocument()
  })

  it('applies priority CSS class', () => {
    renderCard()
    expect(screen.getByText('Fix login bug').closest('.task-card')).toHaveClass('task-card--high')
  })

  it('calls onEdit when edit button clicked', () => {
    const { onEdit } = renderCard()
    fireEvent.click(screen.getByTitle('Edit task'))
    expect(onEdit).toHaveBeenCalledWith(baseTask)
  })

  it('calls onDelete when delete button clicked', () => {
    const { onDelete } = renderCard()
    fireEvent.click(screen.getByTitle('Delete task'))
    expect(onDelete).toHaveBeenCalledWith('task-1')
  })

  it('shows overdue label when past due date', () => {
    renderCard({ ...baseTask, dueDate: '2020-01-01' })
    expect(screen.getByText(/overdue/i)).toBeInTheDocument()
  })

  it('shows "Due today" when due date is today', () => {
    const today = new Date().toISOString().slice(0, 10)
    renderCard({ ...baseTask, dueDate: today })
    expect(screen.getByText('Due today')).toBeInTheDocument()
  })

  it('shows no due date section when dueDate is null', () => {
    renderCard({ ...baseTask, dueDate: null })
    expect(screen.queryByText(/due/i)).not.toBeInTheDocument()
  })

  it('renders unassigned avatar when no assignee', () => {
    renderCard({ ...baseTask, assignee: null })
    expect(screen.getByTitle('Unassigned')).toBeInTheDocument()
  })

  it('renders correct initials in avatar', () => {
    renderCard()
    expect(screen.getByText('AC')).toBeInTheDocument()
  })

  it('renders urgent priority badge', () => {
    renderCard({ ...baseTask, priority: 'urgent' })
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders low priority badge', () => {
    renderCard({ ...baseTask, priority: 'low' })
    expect(screen.getByText('Low')).toBeInTheDocument()
  })
})
