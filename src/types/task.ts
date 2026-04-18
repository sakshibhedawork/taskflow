export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type Status = 'backlog' | 'in-progress' | 'in-review' | 'done'

export const STATUS_LABELS: Record<Status, string> = {
  backlog: 'Backlog',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  done: 'Done',
}

export const STATUS_ORDER: Status[] = ['backlog', 'in-progress', 'in-review', 'done']

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const PRIORITY_ORDER: Priority[] = ['urgent', 'high', 'medium', 'low']

export interface Assignee {
  id: string
  name: string
  color: string
}

export interface ActivityEntry {
  id: string
  action: string
  timestamp: string
}

export interface Task {
  id: string
  title: string
  description: string
  assignee: Assignee | null
  priority: Priority
  status: Status
  dueDate: string | null
  createdAt: string
  updatedAt: string
  activity: ActivityEntry[]
}
