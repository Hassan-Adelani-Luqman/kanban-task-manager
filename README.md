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
| Testing | Jest + jest-preset-angular |
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

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
# HTML report: coverage/lcov-report/index.html
```

---

## Testing

This project uses [Jest](https://jestjs.io/) with [jest-preset-angular](https://thymikee.github.io/jest-preset-angular/) as the test runner.

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run in interactive watch mode |
| `npm run test:coverage` | Run with HTML coverage report |

### What is tested

| File | Tests | Coverage focus |
|------|-------|----------------|
| `subtask-count.pipe.ts` | 6 | Task 5 — Pipe Testing |
| `modal.service.ts` | 8 | Task 4 — Service Testing |
| `theme.service.ts` | 8 | Task 4 + Task 6 (effects + fakeAsync) |
| `board.service.ts` | 22 | Task 4 + Task 6 (async loading with Subject) |
| `auth.guard.ts` | 1 | Task 2 — Guard |
| `unsaved-changes.guard.ts` | 4 | Task 2 — Guard |
| `task-card.ts` | 3 | Task 2 — Component Fundamentals |
| `column.ts` | 4 | Task 2 — Component Fundamentals |
| `boards-list.ts` | 5 | Task 3 — Components with Dependencies |
| `sidebar.ts` | 4 | Task 3 — Components with Dependencies |
| `board-detail.ts` | 6 | Task 7 — Integration Testing |

### Test file conventions

- Test files live alongside their source: `foo.ts` → `foo.spec.ts`
- **Pipe tests**: instantiate the class directly — no TestBed needed
- **Service tests**: `TestBed.inject(ServiceName)` with mocked dependencies
- **Component tests**: `TestBed.createComponent()` with `NO_ERRORS_SCHEMA` for isolation
- **Integration tests**: use real services backed by mocked API layer
- **Async tests**: use `Subject` to control Observable timing, `fakeAsync` + `TestBed.flushEffects()` for signal effects

### Coverage thresholds

Thresholds are set in `jest.config.ts`. Run `npm run test:coverage` to see a full breakdown. The report is generated at `coverage/lcov-report/index.html`.

