import type { Task } from '../types/task'
import { ASSIGNEES } from './assignees'

const d = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86400000).toISOString()

const dueDate = (daysFromNow: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}

export const seedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Set up authentication flow',
    description:
      'Implement OAuth2 login with Google and GitHub. Include token refresh logic and session management.',
    assignee: ASSIGNEES[0],
    priority: 'high',
    status: 'done',
    dueDate: dueDate(-2),
    createdAt: d(7),
    updatedAt: d(2),
    activity: [
      { id: 'act-1', action: 'Task created', timestamp: d(7) },
      { id: 'act-2', action: 'Status changed from Backlog → In Progress', timestamp: d(5) },
      { id: 'act-3', action: 'Status changed from In Progress → Done', timestamp: d(2) },
    ],
  },
  {
    id: 'task-2',
    title: 'Design system audit',
    description:
      'Review all existing UI components and document inconsistencies. Create a component inventory spreadsheet.',
    assignee: ASSIGNEES[1],
    priority: 'medium',
    status: 'done',
    dueDate: dueDate(-1),
    createdAt: d(6),
    updatedAt: d(1),
    activity: [
      { id: 'act-4', action: 'Task created', timestamp: d(6) },
      { id: 'act-5', action: 'Assignee changed to Sarah Kim', timestamp: d(4) },
      { id: 'act-6', action: 'Status changed from In Progress → Done', timestamp: d(1) },
    ],
  },
  {
    id: 'task-3',
    title: 'API rate limiting implementation',
    description:
      'Add rate limiting middleware to all public endpoints. Use Redis for distributed request tracking across instances.',
    assignee: ASSIGNEES[2],
    priority: 'urgent',
    status: 'in-review',
    dueDate: dueDate(2),
    createdAt: d(4),
    updatedAt: d(0),
    activity: [
      { id: 'act-7', action: 'Task created', timestamp: d(4) },
      { id: 'act-8', action: 'Priority changed from High → Urgent', timestamp: d(2) },
      { id: 'act-9', action: 'Status changed from In Progress → In Review', timestamp: d(0) },
    ],
  },
  {
    id: 'task-4',
    title: 'Mobile responsive navigation',
    description:
      'Fix the sidebar navigation for mobile viewports. Implement a hamburger menu with smooth slide-in transitions.',
    assignee: ASSIGNEES[1],
    priority: 'high',
    status: 'in-review',
    dueDate: dueDate(4),
    createdAt: d(3),
    updatedAt: d(0),
    activity: [
      { id: 'act-10', action: 'Task created', timestamp: d(3) },
      { id: 'act-11', action: 'Status changed from Backlog → In Review', timestamp: d(0) },
    ],
  },
  {
    id: 'task-5',
    title: 'Database query optimization',
    description:
      'Profile and fix N+1 query issues in the dashboard endpoints. Add indexes to the tasks and users tables.',
    assignee: ASSIGNEES[0],
    priority: 'high',
    status: 'in-progress',
    dueDate: dueDate(7),
    createdAt: d(2),
    updatedAt: d(0),
    activity: [
      { id: 'act-12', action: 'Task created', timestamp: d(2) },
      { id: 'act-13', action: 'Status changed from Backlog → In Progress', timestamp: d(0) },
    ],
  },
  {
    id: 'task-6',
    title: 'Email notification service',
    description:
      'Build transactional email service with SendGrid. Support templates for signup, password reset, and task assignments.',
    assignee: ASSIGNEES[3],
    priority: 'medium',
    status: 'in-progress',
    dueDate: dueDate(10),
    createdAt: d(1),
    updatedAt: d(0),
    activity: [
      { id: 'act-14', action: 'Task created', timestamp: d(1) },
    ],
  },
  {
    id: 'task-7',
    title: 'Onboarding flow redesign',
    description:
      'Redesign the 4-step onboarding wizard to improve completion rate. Base changes on drop-off data from analytics.',
    assignee: ASSIGNEES[4],
    priority: 'medium',
    status: 'backlog',
    dueDate: dueDate(14),
    createdAt: d(1),
    updatedAt: d(1),
    activity: [
      { id: 'act-15', action: 'Task created', timestamp: d(1) },
    ],
  },
  {
    id: 'task-8',
    title: 'Write unit tests for auth module',
    description:
      'Achieve 80%+ test coverage for the authentication module. Focus on edge cases and token expiry handling.',
    assignee: null,
    priority: 'low',
    status: 'backlog',
    dueDate: null,
    createdAt: d(0),
    updatedAt: d(0),
    activity: [
      { id: 'act-16', action: 'Task created', timestamp: d(0) },
    ],
  },
]
