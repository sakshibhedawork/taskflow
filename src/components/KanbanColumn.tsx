import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, Status } from '../types/task'
import { STATUS_LABELS } from '../types/task'
import TaskCard from './TaskCard'

const STATUS_COLORS: Record<Status, string> = {
  backlog: '#94a3b8',
  'in-progress': '#3b82f6',
  'in-review': '#7c3aed',
  done: '#16a34a',
}

interface KanbanColumnProps {
  status: Status
  tasks: Task[]
  draggingId: string | null
  loading: boolean
  onNewTask: (status: Status) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-line skeleton-line--medium" style={{ marginBottom: 8 }} />
      <div className="skeleton skeleton-line skeleton-line--long" style={{ marginBottom: 6 }} />
      <div className="skeleton skeleton-line skeleton-line--short" />
    </div>
  )
}

export default function KanbanColumn({
  status,
  tasks,
  loading,
  draggingId: _draggingId,
  onNewTask,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status })

  return (
    <div className="column">
      <div className="column__header">
        <div
          className="column__dot"
          style={{ background: STATUS_COLORS[status] }}
        />
        <span className="column__title">{STATUS_LABELS[status]}</span>
        <span className="column__count">{loading ? '—' : tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`column__body ${isOver ? 'column__body--over' : ''}`}
      >
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            {status === 'in-progress' && <SkeletonCard />}
          </>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2.5 2" />
              </svg>
            </div>
            <div className="empty-state__title">No tasks</div>
            <div className="empty-state__sub">Drop here or add one</div>
          </div>
        ) : (
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
        )}
      </div>

      {!loading && (
        <button className="column__add-btn" onClick={() => onNewTask(status)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add task
        </button>
      )}
    </div>
  )
}
