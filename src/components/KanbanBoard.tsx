import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useTaskStore } from '../store/taskStore'
import { STATUS_ORDER } from '../types/task'
import type { Status, Task } from '../types/task'
import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'

interface KanbanBoardProps {
  onNewTask: (status?: Status) => void
  onEdit: (task: Task) => void
}

export default function KanbanBoard({ onNewTask, onEdit }: KanbanBoardProps) {
  const { loading, tasks, deleteTask, moveTask, reorderTasks, getTasksByStatus } = useTaskStore()
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId   = over.id as string

    // Dropped on an empty column area
    if (STATUS_ORDER.includes(overId as Status)) {
      moveTask(activeId, overId as Status)
      return
    }

    // Dropped on another task — reorder or cross-column move
    reorderTasks(activeId, overId)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            loading={loading}
            draggingId={activeTaskId}
            onNewTask={(s) => onNewTask(s)}
            onEdit={onEdit}
            onDelete={deleteTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }} style={{ zIndex: 9999 }}>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={onEdit}
            onDelete={deleteTask}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
