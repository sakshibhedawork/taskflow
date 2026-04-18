import { useState, useEffect, useRef } from 'react'
import type { Task, Status, Priority, Assignee } from '../types/task'
import { STATUS_LABELS, STATUS_ORDER, PRIORITY_ORDER, PRIORITY_LABELS } from '../types/task'
import { ASSIGNEES } from '../data/assignees'
import { useTaskStore } from '../store/taskStore'

interface TaskModalProps {
  task?: Task | null
  defaultStatus?: Status
  onClose: () => void
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskModal({ task, defaultStatus = 'backlog', onClose }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore()
  const isEdit = Boolean(task)
  const titleRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<Status>(task?.status ?? defaultStatus)
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [assigneeId, setAssigneeId] = useState(task?.assignee?.id ?? '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const selectedAssignee: Assignee | null =
    ASSIGNEES.find((a) => a.id === assigneeId) ?? null

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required.')
      titleRef.current?.focus()
      return
    }

    const data = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee: selectedAssignee,
      dueDate: dueDate || null,
    }

    if (isEdit && task) {
      updateTask(task.id, data)
    } else {
      addTask(data)
    }
    onClose()
  }

  const { deleteTask } = useTaskStore()

  const handleDelete = () => {
    if (!task) return
    deleteTask(task.id)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`modal ${isEdit ? 'modal--wide' : ''}`} role="dialog" aria-modal aria-labelledby="modal-title">
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">
            {isEdit ? 'Edit task' : 'New task'}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal__body">
          {/* Form */}
          <div className="modal__form">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Title *</label>
              <input
                ref={titleRef}
                id="task-title"
                className="form-input"
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError('') }}
              />
              {error && (
                <div style={{ marginTop: 5, fontSize: 12, color: 'var(--p-urgent)' }}>{error}</div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                className="form-input form-textarea"
                placeholder="Add more context, acceptance criteria, or notes…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Status + Priority */}
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className="form-input form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  className="form-input form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                >
                  {PRIORITY_ORDER.map((p) => (
                    <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 18 }} />

            {/* Assignee + Due date */}
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="task-assignee">Assignee</label>
                <select
                  id="task-assignee"
                  className="form-input form-select"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {ASSIGNEES.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="task-due">Due date</label>
                <input
                  id="task-due"
                  className="form-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Assignee preview */}
            {selectedAssignee && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  className="avatar avatar--lg"
                  style={{ background: selectedAssignee.color }}
                >
                  {getInitials(selectedAssignee.name)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-1)' }}>
                    {selectedAssignee.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-3)' }}>Assignee</div>
                </div>
              </div>
            )}
          </div>

          {/* Activity log — edit mode only */}
          {isEdit && task && task.activity.length > 0 && (
            <div className="activity-log">
              <div className="activity-log__title">Activity</div>
              {[...task.activity].reverse().map((entry) => (
                <div key={entry.id} className="activity-entry">
                  <div className="activity-entry__dot" />
                  <div>
                    <div className="activity-entry__action">{entry.action}</div>
                    <div className="activity-entry__time">{timeAgo(entry.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal__footer">
          {isEdit && (
            <button className="btn-delete" onClick={handleDelete}>
              Delete task
            </button>
          )}
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit}>
            {isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </div>
    </div>
  )
}
