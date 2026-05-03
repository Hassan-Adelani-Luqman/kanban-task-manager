# Kanban Task Manager

A full-featured Kanban board application built with Angular 21 and Tailwind CSS v4. Manage tasks across customisable columns, switch between light and dark themes, and persist your data across sessions — all in a responsive single-page app that works on desktop, tablet, and mobile.

**Live demo:** _https://heroic-dusk-5bf28d.netlify.app/_

---

## Features

- **Board management** — create, edit, and delete boards with custom columns
- **Task management** — add, edit, delete, and move tasks between columns
- **Subtasks** — break tasks down into subtasks with a completion toggle
- **Status change** — reassign a task's column directly from the task detail modal
- **Dark / light theme** — persisted to `localStorage`, respects system preference on first load
- **Mobile-first responsive layout** — collapsible sidebar on desktop; dedicated board-selector dropdown on mobile
- **Data persistence** — all boards and tasks are saved to `localStorage`
- **Lazy-loaded routing** — board feature module loads on demand; route guards protect navigation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| Styling | Tailwind CSS v4 |
| State management | Angular Signals (`signal`, `computed`, `effect`) |
| Routing | Angular Router with lazy loading, `withComponentInputBinding`, `withViewTransitions` |
| Persistence | `localStorage` |
| Testing | Vitest |
| Language | TypeScript 5.9 |

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── data/          # Seed data (demo boards)
│   │   ├── guards/        # Auth guard, unsaved-changes guard
│   │   ├── models/        # Board, Column, Task, Subtask interfaces
│   │   └── services/      # BoardService, ModalService, ThemeService
│   ├── features/
│   │   └── boards/
│   │       ├── board-detail/
│   │       ├── boards-list/
│   │       ├── column/
│   │       ├── task-card/
│   │       └── modals/    # View/add/edit task, add/edit board, delete confirm
│   ├── layout/
│   │   ├── header/
│   │   └── sidebar/
│   ├── pages/
│   │   ├── not-found/
│   │   └── settings/
│   └── shared/
│       ├── components/    # Dropdown, ModalOverlay, TextField
│       └── pipes/         # SubtaskCountPipe
└── assets/
    └── icons/             # SVG icon set
```

---

## Getting Started

**Prerequisites:** Node.js 20+ and npm 10+

```bash
# Install dependencies
npm install

# Start the development server
npm start
# Open http://localhost:4200

# Production build
npm run build
# Output: dist/kanban-task-manager/browser/

# Run tests
npm test
```
