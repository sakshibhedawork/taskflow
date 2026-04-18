import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import type { Task } from '../types/task'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  isOverlay?: boolean
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDue(dueDate: string) {
  const d = new Date(dueDate)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const due = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000)

  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, overdue: true }
  if (diff === 0) return { label: 'Due today', overdue: false }
  if (diff === 1) return { label: 'Due tomorrow', overdue: false }
  if (diff <= 7) return { label: `Due in ${diff}d`, overdue: false }
  return {
    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue: false,
  }
}

function CardContent({ task, onEdit, onDelete }: Omit<TaskCardProps, 'isOverlay'>) {
  const due = task.dueDate ? formatDue(task.dueDate) : null
  return (
    <>
      <div className="task-card__title">{task.title}</div>

      {task.description && (
        <div className="task-card__desc">{task.description}</div>
      )}

      <div className="task-card__footer">
        {task.assignee ? (
          <div className="task-card__assignee">
            <div
              className="avatar"
              style={{ background: task.assignee.color }}
              title={task.assignee.name}
            >
              {getInitials(task.assignee.name)}
            </div>
            <span className="task-card__assignee-name">
              {task.assignee.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <div className="task-card__assignee">
            <div className="avatar avatar--unassigned" title="Unassigned">—</div>
          </div>
        )}

        <div className="task-card__spacer" />

        <span className={`priority-badge priority-badge--${task.priority}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {due && (
          <span className={`task-card__due ${due.overdue ? 'task-card__due--overdue' : ''}`}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="2" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.1" />
              <path d="M3 1v2M7 1v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M1 5h8" stroke="currentColor" strokeWidth="1.1" />
            </svg>
            {due.label}
          </span>
        )}
      </div>

      <div className="task-card__actions" onPointerDown={(e) => e.stopPropagation()}>
        <button
          className="icon-btn"
          title="Edit task"
          aria-label={`Edit task: ${task.title}`}
          onClick={(e) => { e.stopPropagation(); onEdit(task) }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="icon-btn icon-btn--danger"
          title="Delete task"
          aria-label={`Delete task: ${task.title}`}
          onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1.5 3h9M4 3V2h4v1M5 5.5v4M7 5.5v4M2.5 3l.5 7h6l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default function TaskCard({ task, onEdit, onDelete, isOverlay }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isOverlay })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={`task-card task-card--${task.priority}`}
        style={{ ...style, opacity: 0, pointerEvents: 'none', minHeight: 80 }}
      />
    )
  }

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : { ...attributes, ...listeners })}
      className={`task-card task-card--${task.priority} ${isOverlay ? 'task-card--dragging' : ''}`}
      style={isOverlay ? { cursor: 'grabbing' } : style}
    >
      <CardContent task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}
