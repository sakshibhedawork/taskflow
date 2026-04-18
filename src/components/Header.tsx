import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '../store/taskStore'
import { ASSIGNEES } from '../data/assignees'
import type { Priority } from '../types/task'

interface HeaderProps {
  onNewTask: () => void
}

export default function Header({ onNewTask }: HeaderProps) {
  const navigate = useNavigate()
  const { filters, setSearch, setAssigneeFilter, setPriorityFilter, clearFilters } = useTaskStore()

  const hasFilters = filters.search || filters.assigneeId || filters.priority

  return (
    <header className="header">
      {/* Logo */}
      <a className="header__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="header__logo-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.65" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.65" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.35" />
          </svg>
        </div>
        TaskFlow
      </a>

      <div className="header__divider" />

      {/* Search */}
      <div className="header__search-wrap">
        <span className="header__search-icon">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          className="header__search"
          type="text"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Assignee filter */}
      <select
        className={`header__select ${filters.assigneeId ? 'header__select--active' : ''}`}
        value={filters.assigneeId}
        onChange={(e) => setAssigneeFilter(e.target.value)}
      >
        <option value="">All assignees</option>
        {ASSIGNEES.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        className={`header__select ${filters.priority ? 'header__select--active' : ''}`}
        value={filters.priority}
        onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
      >
        <option value="">All priorities</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {hasFilters && (
        <button className="header__clear" onClick={clearFilters}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Clear
        </button>
      )}

      <div className="header__spacer" />

      {/* New Task */}
      <button className="btn-new-task" onClick={onNewTask}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        New Task
      </button>
    </header>
  )
}
