import { computed, Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Board, Column, Task, generateId, COLUMN_COLORS } from '../models/board.models';
import { BoardActions } from '../../store/boards/board.actions';
import {
  selectAllBoards,
  selectActiveBoardId,
  selectActiveBoard,
} from '../../store/boards/board.selectors';

/**
 * Pure helper — rebuilds a board's column list after an edit, preserving tasks
 * in renamed columns. Kept outside the class so it is easy to test independently.
 */
function buildUpdatedBoard(
  existing: Board,
  name: string,
  columns: { id?: string; name: string; color: string }[]
): Board {
  const updatedColumns: Column[] = columns.map(c => {
    const old = existing.columns.find(ec => ec.id === c.id);
    if (old) return { ...old, name: c.name, color: c.color };
    return { id: generateId(), name: c.name, color: c.color, tasks: [] };
  });

  // Re-attach tasks from old columns into their matching updated columns
  existing.columns.forEach(oldCol => {
    const matched = updatedColumns.find(nc => nc.id === oldCol.id);
    if (!matched) return;
    oldCol.tasks.forEach(task => {
      if (!matched.tasks.some(t => t.id === task.id)) {
        matched.tasks.push({ ...task, status: matched.name });
      }
    });
  });

  return { ...existing, name, columns: updatedColumns };
}

/**
 * BoardService — NgRx Façade
 *
 * Public API is IDENTICAL to the original signal-based version,
 * so no component or template needs to change.
 *
 * Internally:
 *   - Reads state via store selectors, converted to Angular signals with toSignal()
 *   - Writes state by dispatching NgRx actions
 *   - Effects in board.effects.ts handle the localStorage side effects
 */
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly store = inject(Store);

  // ── Public signals (same shape as before — all components work unchanged) ──

  readonly boards = toSignal(
    this.store.select(selectAllBoards),
    { initialValue: [] as Board[] }
  );

  readonly activeBoardId = toSignal(
    this.store.select(selectActiveBoardId),
    { initialValue: null }
  );

  readonly activeBoard = toSignal(
    this.store.select(selectActiveBoard),
    { initialValue: null }
  );

  readonly boardCount = computed(() => this.boards().length);

  /** boards$ as an Observable — used by FilterService in Sidebar */
  readonly boards$ = this.store.select(selectAllBoards);

  constructor() {
    // Trigger the loadBoards$ Effect which reads localStorage and populates the store
    this.store.dispatch(BoardActions.loadBoards());
  }

  // ── Board navigation ───────────────────────────────────────────────────────

  setActiveBoard(id: string): void {
    this.store.dispatch(BoardActions.setActiveBoard({ id }));
  }

  getBoardById(id: string): Board | undefined {
    return this.boards().find(b => b.id === id);
  }

  // ── Board CRUD ─────────────────────────────────────────────────────────────

  createBoard(name: string, columns: { name: string; color: string }[]): Board {
    const board: Board = {
      id: generateId(),
      name,
      columns: columns.map(c => ({ id: generateId(), name: c.name, color: c.color, tasks: [] })),
    };
    this.store.dispatch(BoardActions.createBoard({ board }));
    return board;
  }

  updateBoard(boardId: string, name: string, columns: { id?: string; name: string; color: string }[]): void {
    const existing = this.boards().find(b => b.id === boardId);
    if (!existing) return;
    const board = buildUpdatedBoard(existing, name, columns);
    this.store.dispatch(BoardActions.updateBoard({ board }));
  }

  deleteBoard(boardId: string): void {
    this.store.dispatch(BoardActions.deleteBoard({ boardId }));
  }

  addColumn(boardId: string, name: string): void {
    const board = this.boards().find(b => b.id === boardId);
    if (!board) return;
    const color = COLUMN_COLORS[board.columns.length % COLUMN_COLORS.length];
    this.store.dispatch(BoardActions.addColumn({ boardId, name, color }));
  }

  // ── Task CRUD ──────────────────────────────────────────────────────────────

  createTask(boardId: string, taskData: Omit<Task, 'id'>): Task {
    const task: Task = { id: generateId(), ...taskData };
    this.store.dispatch(BoardActions.createTask({ boardId, task }));
    return task;
  }

  updateTask(boardId: string, task: Task, previousStatus: string): void {
    this.store.dispatch(BoardActions.updateTask({ boardId, task, previousStatus }));
  }

  deleteTask(boardId: string, taskId: string): void {
    this.store.dispatch(BoardActions.deleteTask({ boardId, taskId }));
  }

  toggleSubtask(boardId: string, taskId: string, subtaskId: string): void {
    this.store.dispatch(BoardActions.toggleSubtask({ boardId, taskId, subtaskId }));
  }

  moveTask(boardId: string, taskId: string, newStatus: string): void {
    this.store.dispatch(BoardActions.moveTask({ boardId, taskId, newStatus }));
  }

  resetToSeedData(): void {
    this.store.dispatch(BoardActions.resetToSeedData());
  }
}
