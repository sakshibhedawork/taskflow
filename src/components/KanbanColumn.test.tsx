import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import KanbanColumn from './KanbanColumn'
import type { Task } from '../types/task'

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: 'Sample Task',
  description: 'desc',
  assignee: null,
  priority: 'medium',
  status: 'backlog',
  dueDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  activity: [],
  ...overrides,
})

function renderColumn({
  tasks = [] as Task[],
  loading = false,
  onNewTask = vi.fn(),
  onEdit = vi.fn(),
  onDelete = vi.fn(),
} = {}) {
  render(
    <DndContext>
      <KanbanColumn
        status="backlog"
        tasks={tasks}
        draggingId={null}
        loading={loading}
        onNewTask={onNewTask}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </DndContext>
  )
  return { onNewTask, onEdit, onDelete }
}

describe('KanbanColumn', () => {
  it('renders column title', () => {
    renderColumn()
    expect(screen.getByText('Backlog')).toBeInTheDocument()
  })

  it('shows task count when tasks present', () => {
    renderColumn({ tasks: [makeTask()] })
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows zero count when empty', () => {
    renderColumn({ tasks: [] })
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows dash for count while loading', () => {
    renderColumn({ loading: true })
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows empty state when no tasks and not loading', () => {
    renderColumn({ tasks: [] })
    expect(screen.getByText('No tasks')).toBeInTheDocument()
    expect(screen.getByText('Drop here or add one')).toBeInTheDocument()
  })

  it('does not show empty state while loading', () => {
    renderColumn({ loading: true })
    expect(screen.queryByText('No tasks')).not.toBeInTheDocument()
  })

  it('renders task cards', () => {
    renderColumn({ tasks: [makeTask({ title: 'My card task' })] })
    expect(screen.getByText('My card task')).toBeInTheDocument()
  })

  it('renders multiple task cards', () => {
    renderColumn({
      tasks: [
        makeTask({ id: 't1', title: 'Task One' }),
        makeTask({ id: 't2', title: 'Task Two' }),
      ],
    })
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.getByText('Task Two')).toBeInTheDocument()
  })

  it('shows Add task button when not loading', () => {
    renderColumn()
    expect(screen.getByText('Add task')).toBeInTheDocument()
  })

  it('hides Add task button while loading', () => {
    renderColumn({ loading: true })
    expect(screen.queryByText('Add task')).not.toBeInTheDocument()
  })

  it('calls onNewTask with status when Add task clicked', () => {
    const { onNewTask } = renderColumn()
    fireEvent.click(screen.getByText('Add task'))
    expect(onNewTask).toHaveBeenCalledWith('backlog')
  })

  it('renders correct status titles for each column', () => {
    const statuses = [
      { status: 'backlog' as const,     label: 'Backlog' },
      { status: 'in-progress' as const, label: 'In Progress' },
      { status: 'in-review' as const,   label: 'In Review' },
      { status: 'done' as const,        label: 'Done' },
    ]
    statuses.forEach(({ status, label }) => {
      const { unmount } = render(
        <DndContext>
          <KanbanColumn
            status={status}
            tasks={[]}
            draggingId={null}
            loading={false}
            onNewTask={vi.fn()}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </DndContext>
      )
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })
})
