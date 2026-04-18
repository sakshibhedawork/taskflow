import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { Task, Status, Priority, ActivityEntry } from '../types/task'
import { STATUS_LABELS, PRIORITY_LABELS } from '../types/task'
import { seedTasks } from '../data/seedData'

export interface Filters {
  search: string
  assigneeId: string
  priority: Priority | ''
}

interface TaskStore {
  tasks: Task[]
  filters: Filters
  loading: boolean
  initialized: boolean

  initialize: () => Promise<void>
  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'activity'>) => void
  updateTask: (id: string, data: Partial<Omit<Task, 'id' | 'createdAt' | 'activity'>>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: Status) => void
  reorderTasks: (activeId: string, overId: string) => void
  setSearch: (search: string) => void
  setAssigneeFilter: (assigneeId: string) => void
  setPriorityFilter: (priority: Priority | '') => void
  clearFilters: () => void
  getTasksByStatus: (status: Status) => Task[]
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      filters: { search: '', assigneeId: '', priority: '' },
      loading: false,
      initialized: false,

      initialize: async () => {
        if (get().initialized) return
        set({ loading: true })
        await new Promise((r) => setTimeout(r, 700))
        set((state) => ({
          tasks: state.tasks.length > 0 ? state.tasks : seedTasks,
          loading: false,
          initialized: true,
        }))
      },

      addTask: (data) => {
        const now = new Date().toISOString()
        const task: Task = {
          ...data,
          id: `task-${uuid()}`,
          createdAt: now,
          updatedAt: now,
          activity: [{ id: uuid(), action: 'Task created', timestamp: now }],
        }
        set((s) => ({ tasks: [...s.tasks, task] }))
      },

      updateTask: (id, data) => {
        const now = new Date().toISOString()
        set((s) => ({
          tasks: s.tasks.map((task) => {
            if (task.id !== id) return task

            const entries: ActivityEntry[] = []

            if (data.status && data.status !== task.status) {
              entries.push({
                id: uuid(),
                action: `Status changed from ${STATUS_LABELS[task.status]} → ${STATUS_LABELS[data.status]}`,
                timestamp: now,
              })
            }
            if (data.priority && data.priority !== task.priority) {
              entries.push({
                id: uuid(),
                action: `Priority changed from ${PRIORITY_LABELS[task.priority]} → ${PRIORITY_LABELS[data.priority]}`,
                timestamp: now,
              })
            }
            if (data.assignee !== undefined && data.assignee?.id !== task.assignee?.id) {
              entries.push({
                id: uuid(),
                action: `Assignee changed to ${data.assignee ? data.assignee.name : 'Unassigned'}`,
                timestamp: now,
              })
            }
            if (data.title && data.title !== task.title) {
              entries.push({ id: uuid(), action: 'Title updated', timestamp: now })
            }

            return {
              ...task,
              ...data,
              updatedAt: now,
              activity: [...task.activity, ...entries],
            }
          }),
        }))
      },

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      moveTask: (taskId, newStatus) => {
        const task = get().tasks.find((t) => t.id === taskId)
        if (!task || task.status === newStatus) return
        get().updateTask(taskId, { status: newStatus })
      },

      reorderTasks: (activeId, overId) => {
        if (activeId === overId) return
        set((s) => {
          const tasks = [...s.tasks]
          const activeIdx = tasks.findIndex((t) => t.id === activeId)
          const overIdx   = tasks.findIndex((t) => t.id === overId)
          if (activeIdx === -1 || overIdx === -1) return s

          const activeTask = tasks[activeIdx]
          const overTask   = tasks[overIdx]
          const now = new Date().toISOString()

          if (activeTask.status !== overTask.status) {
            tasks[activeIdx] = {
              ...activeTask,
              status: overTask.status,
              updatedAt: now,
              activity: [
                ...activeTask.activity,
                {
                  id: uuid(),
                  action: `Status changed from ${STATUS_LABELS[activeTask.status]} → ${STATUS_LABELS[overTask.status]}`,
                  timestamp: now,
                },
              ],
            }
          }

          // Move element from activeIdx to overIdx
          const [item] = tasks.splice(activeIdx, 1)
          tasks.splice(overIdx, 0, item)
          return { tasks }
        })
      },

      setSearch: (search) =>
        set((s) => ({ filters: { ...s.filters, search } })),
      setAssigneeFilter: (assigneeId) =>
        set((s) => ({ filters: { ...s.filters, assigneeId } })),
      setPriorityFilter: (priority) =>
        set((s) => ({ filters: { ...s.filters, priority } })),
      clearFilters: () =>
        set({ filters: { search: '', assigneeId: '', priority: '' } }),

      getTasksByStatus: (status) => {
        const { tasks, filters } = get()
        return tasks.filter((t) => {
          if (t.status !== status) return false
          if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase()))
            return false
          if (filters.assigneeId && t.assignee?.id !== filters.assigneeId) return false
          if (filters.priority && t.priority !== filters.priority) return false
          return true
        })
      },
    }),
    { name: 'taskflow-v1' }
  )
)
