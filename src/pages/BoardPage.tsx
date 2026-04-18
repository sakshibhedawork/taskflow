import { useEffect, useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import type { Task, Status } from '../types/task'
import Header from '../components/Header'
import KanbanBoard from '../components/KanbanBoard'
import TaskModal from '../components/TaskModal'

export default function BoardPage() {
  const initialize = useTaskStore((s) => s.initialize)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<Status>('backlog')

  useEffect(() => {
    initialize()
  }, [initialize])

  const openCreate = (status?: Status) => {
    setEditingTask(null)
    setDefaultStatus(status ?? 'backlog')
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="board-page">
      <Header onNewTask={() => openCreate()} />
      <KanbanBoard onNewTask={openCreate} onEdit={openEdit} />
      {modalOpen && (
        <TaskModal
          task={editingTask}
          defaultStatus={defaultStatus}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
