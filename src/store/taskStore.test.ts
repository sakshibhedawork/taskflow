import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskStore } from './taskStore'
import type { Task } from '../types/task'

const getStore = () => useTaskStore.getState()

const reset = () => {
  useTaskStore.setState({
    tasks: [],
    filters: { search: '', assigneeId: '', priority: '' },
    loading: false,
    initialized: false,
  })
  localStorage.clear()
}

const makeTask = (overrides: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'activity'>> = {}) => ({
  title: 'Test Task',
  description: 'A description',
  assignee: null,
  priority: 'medium' as const,
  status: 'backlog' as const,
  dueDate: null,
  ...overrides,
})

describe('taskStore', () => {
  beforeEach(reset)

  /* ── addTask ── */
  describe('addTask', () => {
    it('adds a task to the list', () => {
      getStore().addTask(makeTask())
      expect(getStore().tasks).toHaveLength(1)
    })

    it('sets title correctly', () => {
      getStore().addTask(makeTask({ title: 'My Task' }))
      expect(getStore().tasks[0].title).toBe('My Task')
    })

    it('creates a unique id for each task', () => {
      getStore().addTask(makeTask())
      getStore().addTask(makeTask())
      const [a, b] = getStore().tasks
      expect(a.id).not.toBe(b.id)
    })

    it('logs Task created activity', () => {
      getStore().addTask(makeTask())
      expect(getStore().tasks[0].activity[0].action).toBe('Task created')
    })
  })

  /* ── updateTask ── */
  describe('updateTask', () => {
    beforeEach(() => getStore().addTask(makeTask()))

    it('updates the title', () => {
      const { id } = getStore().tasks[0]
      getStore().updateTask(id, { title: 'Updated' })
      expect(getStore().tasks[0].title).toBe('Updated')
    })

    it('logs activity when status changes', () => {
      const { id } = getStore().tasks[0]
      getStore().updateTask(id, { status: 'in-progress' })
      const log = getStore().tasks[0].activity
      expect(log).toHaveLength(2)
      expect(log[1].action).toContain('Status changed')
    })

    it('logs activity when priority changes', () => {
      const { id } = getStore().tasks[0]
      getStore().updateTask(id, { priority: 'urgent' })
      const log = getStore().tasks[0].activity
      expect(log[1].action).toContain('Priority changed')
    })

    it('logs activity when assignee changes', () => {
      const { id } = getStore().tasks[0]
      getStore().updateTask(id, { assignee: { id: 'a1', name: 'Alex', color: '#000' } })
      const log = getStore().tasks[0].activity
      expect(log[1].action).toContain('Assignee changed')
    })

    it('does not log activity when title changes', () => {
      const { id } = getStore().tasks[0]
      getStore().updateTask(id, { title: 'New title' })
      const log = getStore().tasks[0].activity
      expect(log[1].action).toBe('Title updated')
    })

    it('updates updatedAt timestamp', () => {
      const { id, updatedAt } = getStore().tasks[0]
      getStore().updateTask(id, { title: 'Changed' })
      expect(getStore().tasks[0].updatedAt).not.toBe(updatedAt)
    })
  })

  /* ── deleteTask ── */
  describe('deleteTask', () => {
    it('removes the task', () => {
      getStore().addTask(makeTask())
      const { id } = getStore().tasks[0]
      getStore().deleteTask(id)
      expect(getStore().tasks).toHaveLength(0)
    })

    it('only removes the target task', () => {
      getStore().addTask(makeTask({ title: 'A' }))
      getStore().addTask(makeTask({ title: 'B' }))
      const { id } = getStore().tasks[0]
      getStore().deleteTask(id)
      expect(getStore().tasks).toHaveLength(1)
      expect(getStore().tasks[0].title).toBe('B')
    })
  })

  /* ── moveTask ── */
  describe('moveTask', () => {
    beforeEach(() => getStore().addTask(makeTask({ status: 'backlog' })))

    it('changes task status', () => {
      const { id } = getStore().tasks[0]
      getStore().moveTask(id, 'done')
      expect(getStore().tasks[0].status).toBe('done')
    })

    it('does nothing if status is unchanged', () => {
      const { id } = getStore().tasks[0]
      const before = getStore().tasks[0].activity.length
      getStore().moveTask(id, 'backlog')
      expect(getStore().tasks[0].activity).toHaveLength(before)
    })
  })

  /* ── reorderTasks ── */
  describe('reorderTasks', () => {
    beforeEach(() => {
      getStore().addTask(makeTask({ title: 'A', status: 'backlog' }))
      getStore().addTask(makeTask({ title: 'B', status: 'backlog' }))
      getStore().addTask(makeTask({ title: 'C', status: 'in-progress' }))
    })

    it('swaps two tasks within the same column', () => {
      const [idA, idB] = getStore().tasks.map((t) => t.id)
      getStore().reorderTasks(idA, idB)
      expect(getStore().tasks[0].id).toBe(idB)
      expect(getStore().tasks[1].id).toBe(idA)
    })

    it('does nothing when active === over', () => {
      const [idA] = getStore().tasks.map((t) => t.id)
      getStore().reorderTasks(idA, idA)
      expect(getStore().tasks[0].title).toBe('A')
    })

    it('changes status when dropped on a task in a different column', () => {
      const [idA, , idC] = getStore().tasks.map((t) => t.id)
      getStore().reorderTasks(idA, idC)
      const moved = getStore().tasks.find((t) => t.id === idA)
      expect(moved?.status).toBe('in-progress')
    })

    it('logs status change activity on cross-column drop', () => {
      const [idA, , idC] = getStore().tasks.map((t) => t.id)
      getStore().reorderTasks(idA, idC)
      const moved = getStore().tasks.find((t) => t.id === idA)!
      expect(moved.activity[1].action).toContain('Status changed')
    })
  })

  /* ── filters ── */
  describe('filters', () => {
    beforeEach(() => {
      getStore().addTask(makeTask({ title: 'Auth flow', status: 'backlog', priority: 'high', assignee: { id: 'a1', name: 'Alex', color: '#000' } }))
      getStore().addTask(makeTask({ title: 'Dashboard UI', status: 'backlog', priority: 'low', assignee: { id: 'a2', name: 'Sarah', color: '#000' } }))
    })

    it('getTasksByStatus returns correct tasks', () => {
      expect(getStore().getTasksByStatus('backlog')).toHaveLength(2)
      expect(getStore().getTasksByStatus('done')).toHaveLength(0)
    })

    it('setSearch filters by title (case-insensitive)', () => {
      getStore().setSearch('auth')
      expect(getStore().getTasksByStatus('backlog')).toHaveLength(1)
    })

    it('setAssigneeFilter filters by assignee id', () => {
      getStore().setAssigneeFilter('a2')
      expect(getStore().getTasksByStatus('backlog')).toHaveLength(1)
      expect(getStore().getTasksByStatus('backlog')[0].title).toBe('Dashboard UI')
    })

    it('setPriorityFilter filters by priority', () => {
      getStore().setPriorityFilter('high')
      expect(getStore().getTasksByStatus('backlog')).toHaveLength(1)
    })

    it('clearFilters resets all filters', () => {
      getStore().setSearch('auth')
      getStore().setAssigneeFilter('a1')
      getStore().clearFilters()
      const { filters } = getStore()
      expect(filters.search).toBe('')
      expect(filters.assigneeId).toBe('')
      expect(filters.priority).toBe('')
    })

    it('returns empty when search matches nothing', () => {
      getStore().setSearch('zzz_no_match')
      expect(getStore().getTasksByStatus('backlog')).toHaveLength(0)
    })
  })
})
