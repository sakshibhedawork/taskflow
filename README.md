# TaskFlow

A task and workflow management interface built for the Senior Frontend Engineer assignment.

**Live demo:** *(add Vercel/Netlify URL after deployment)*

---

## Setup Instructions

**Prerequisites:** Node.js ≥ 20.x

```bash
# 1. Clone and enter the project
git clone <repo-url>
cd TaskFlow

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → http://localhost:5173

# 4. Production build
npm run build
npm run preview
```

No environment variables or external services required. The app runs fully offline.

---

## Architecture Decisions

### State Management — Zustand

I chose Zustand over Redux or Context because:

- **No boilerplate.** A single `taskStore.ts` file holds all state, actions, and derived selectors.
- **Built-in persistence.** The `persist` middleware serialises state to `localStorage` out of the box — tasks, filters, and preferences survive page refreshes.
- **Fine-grained subscriptions.** Components subscribe to exactly what they need, avoiding unnecessary re-renders.

The store owns all business logic: creating tasks, updating them (with automatic activity log entries), moving between stages, and filter state.

### Component Structure

```
pages/
  LandingPage.tsx     — marketing/entry page
  BoardPage.tsx       — initialises store, owns modal state

components/
  Header.tsx          — search + filter controls
  KanbanBoard.tsx     — DnD context, maps status columns
  KanbanColumn.tsx    — droppable zone, renders task list
  TaskCard.tsx        — draggable card, edit/delete actions
  TaskModal.tsx       — create + edit form with activity log
  ErrorBoundary.tsx   — catches and displays render errors
```

Each component has a single responsibility. `BoardPage` is the only place that owns modal open/close state — child components call `onEdit` and `onNewTask` callbacks rather than managing their own modal state.

### Drag and Drop — @dnd-kit

Used `DragOverlay` so the dragged card appears floating above all columns (not a CSS-transformed in-place element). The original card becomes an invisible placeholder while dragging. `PointerSensor` with `distance: 6` prevents accidental drags on click.

### Activity Log

Every mutation in the store generates `ActivityEntry` objects automatically — no component needs to think about it. Status changes, priority changes, assignee changes, and title edits all produce timestamped log entries attached to the task. This makes the log accurate even when tasks are moved by drag-and-drop.

### Routing

React Router v6 with two routes: `/` (landing) and `/board`. The landing page gives reviewers a first impression of the product rather than dropping them directly into the board.

---

## Tradeoffs Made

| Decision | Tradeoff |
|---|---|
| CSS custom properties + plain CSS (no Tailwind) | More verbose but gives full visual control; avoids utility-class clutter that makes UIs look AI-generated |
| Seed data on first load with 700ms simulated delay | Demonstrates loading skeleton UX; in production this would be a real API call |
| Zustand over Context + useReducer | Slightly heavier dependency but significantly less ceremony for a store of this complexity |
| No sortable within columns (drag only moves between columns) | Simpler implementation; column order within a stage is less important than cross-stage movement for this use case |
| `getTasksByStatus` as a store method (not a memoised selector) | Simpler to read; for hundreds of tasks a `useMemo` on filtered results per column would be the next step |

---

## What I Would Improve With More Time

1. **Column-level sorting** — drag to reorder tasks within a column using `@dnd-kit/sortable`
2. **Optimistic updates with real API** — replace the localStorage mock with an actual API (e.g. json-server) and handle optimistic UI + rollback on failure
3. **Unit and integration tests** — React Testing Library tests for the store actions and key user flows (create task, drag to column)
4. **Keyboard navigation** — full keyboard support for moving cards between columns without drag (accessible to users who can't use a pointer)
5. **Virtualised column lists** — `react-window` for columns with many tasks to keep scroll performance smooth
6. **User avatars** — replace initials with real profile images when connected to a user service
7. **Date filtering** — filter tasks by due date range (overdue, due this week, etc.)

---

## AI Usage

I used Claude (Anthropic) during this assignment.

**What I used it for:**
- Scaffolding the initial project conversion from Vue to React (boilerplate)
- Generating seed data with realistic task descriptions
- Drafting the global CSS variables and base reset

**Decisions that were mine:**
- Architecture: Zustand over Redux or Context — I evaluated the tradeoffs for this specific scope
- Component breakdown and responsibility boundaries
- The `DragOverlay` approach for drag-and-drop UX (the alternative of CSS-transform-in-place looked wrong; I identified and chose the fix)
- Activity log design: automatic log generation in the store rather than in components
- The `initialized` flag pattern to distinguish first-run (seed data) from returning users (localStorage data)
- CSS design system: custom properties, spacing scale, priority colour palette

I reviewed and understood every line before committing it.
