import { Injectable, computed, inject, signal } from '@angular/core';
import { Board, Column, Task, generateId, COLUMN_COLORS } from '../models/board.models';
import { BoardApiService } from './board-api.service';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly api = inject(BoardApiService);

  private readonly _boards = signal<Board[]>([]);
  private readonly _activeBoardId = signal<string | null>(null);

  readonly boards = this._boards.asReadonly();
  readonly activeBoardId = this._activeBoardId.asReadonly();

  readonly activeBoard = computed(
    () => this._boards().find(b => b.id === this._activeBoardId()) ?? null
  );

  readonly boardCount = computed(() => this._boards().length);

  // New signals for HTTP feedback — components can read these to show loading/error UI
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadBoards();
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private loadBoards(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getBoards().subscribe({
      next: (boards) => {
        this._boards.set(boards);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  // ─── Board navigation ──────────────────────────────────────────────────────

  setActiveBoard(id: string): void {
    this._activeBoardId.set(id);
  }

  getBoardById(id: string): Board | undefined {
    return this._boards().find(b => b.id === id);
  }

  // ─── Board CRUD — optimistic update pattern ────────────────────────────────
  // Each mutating method:
  //   1. Saves a snapshot of the current state
  //   2. Updates the signal immediately so the UI reflects the change at once
  //   3. Calls the API in the background
  //   4. On API error: reverts the signal to the snapshot and shows the error

  createBoard(name: string, columns: { name: string; color: string }[]): Board {
    const newBoard: Board = {
      id: generateId(),
      name,
      columns: columns.map(c => ({ id: generateId(), name: c.name, color: c.color, tasks: [] })),
    };
    const snapshot = this._boards();
    this._boards.update(boards => [...boards, newBoard]);

    this.api.createBoard(newBoard).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
    return newBoard;
  }

  updateBoard(boardId: string, name: string, columns: { id?: string; name: string; color: string }[]): void {
    const snapshot = this._boards();
    const updated = this._boards().map(b => {
      if (b.id !== boardId) return b;

      const updatedColumns: Column[] = columns.map(c => {
        const existing = b.columns.find(ec => ec.id === c.id);
        if (existing) return { ...existing, name: c.name, color: c.color };
        return { id: generateId(), name: c.name, color: c.color, tasks: [] };
      });

      // Reassign tasks whose column was renamed (preserve the task/column association by id)
      const allTasks = b.columns.flatMap(col => col.tasks);
      allTasks.forEach(task => {
        const oldCol = b.columns.find(col => col.tasks.some(t => t.id === task.id));
        if (!oldCol) return;
        const newCol = updatedColumns.find(nc => nc.id === oldCol.id);
        if (newCol && !newCol.tasks.some(t => t.id === task.id)) {
          newCol.tasks.push({ ...task, status: newCol.name });
        }
      });

      return { ...b, name, columns: updatedColumns };
    });
    this._boards.set(updated);

    const board = updated.find(b => b.id === boardId)!;
    this.api.updateBoard(board).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
  }

  deleteBoard(boardId: string): void {
    const snapshot = this._boards();
    this._boards.update(boards => boards.filter(b => b.id !== boardId));
    if (this._activeBoardId() === boardId) {
      const remaining = this._boards();
      this._activeBoardId.set(remaining.length > 0 ? remaining[0].id : null);
    }

    this.api.deleteBoard(boardId).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
  }

  addColumn(boardId: string, name: string): void {
    const snapshot = this._boards();
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        const color = COLUMN_COLORS[b.columns.length % COLUMN_COLORS.length];
        return { ...b, columns: [...b.columns, { id: generateId(), name, color, tasks: [] }] };
      })
    );

    const board = this._boards().find(b => b.id === boardId)!;
    this.api.updateBoard(board).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
  }

  // ─── Task CRUD ─────────────────────────────────────────────────────────────

  createTask(boardId: string, task: Omit<Task, 'id'>): Task {
    const newTask: Task = { id: generateId(), ...task };
    const snapshot = this._boards();
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(col =>
            col.name === task.status ? { ...col, tasks: [...col.tasks, newTask] } : col
          ),
        };
      })
    );

    const board = this._boards().find(b => b.id === boardId)!;
    this.api.updateBoard(board).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
    return newTask;
  }

  updateTask(boardId: string, updatedTask: Task, previousStatus: string): void {
    const snapshot = this._boards();
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(col => {
            if (col.name === previousStatus && col.name !== updatedTask.status)
              return { ...col, tasks: col.tasks.filter(t => t.id !== updatedTask.id) };
            if (col.name === updatedTask.status && col.name !== previousStatus)
              return { ...col, tasks: [...col.tasks, updatedTask] };
            if (col.name === updatedTask.status)
              return { ...col, tasks: col.tasks.map(t => t.id === updatedTask.id ? updatedTask : t) };
            return col;
          }),
        };
      })
    );

    const board = this._boards().find(b => b.id === boardId)!;
    this.api.updateBoard(board).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
  }

  deleteTask(boardId: string, taskId: string): void {
    const snapshot = this._boards();
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(col => ({
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId),
          })),
        };
      })
    );

    const board = this._boards().find(b => b.id === boardId)!;
    this.api.updateBoard(board).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
  }

  toggleSubtask(boardId: string, taskId: string, subtaskId: string): void {
    const snapshot = this._boards();
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(col => ({
            ...col,
            tasks: col.tasks.map(t =>
              t.id !== taskId ? t : {
                ...t,
                subtasks: t.subtasks.map(s =>
                  s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s
                ),
              }
            ),
          })),
        };
      })
    );

    const board = this._boards().find(b => b.id === boardId)!;
    this.api.updateBoard(board).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
  }

  moveTask(boardId: string, taskId: string, newStatus: string): void {
    const snapshot = this._boards();
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        let taskToMove: Task | undefined;
        const columnsWithRemoved = b.columns.map(col => {
          const task = col.tasks.find(t => t.id === taskId);
          if (task) {
            taskToMove = { ...task, status: newStatus };
            return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
          }
          return col;
        });
        if (!taskToMove) return b;
        return {
          ...b,
          columns: columnsWithRemoved.map(col =>
            col.name === newStatus ? { ...col, tasks: [...col.tasks, taskToMove!] } : col
          ),
        };
      })
    );

    const board = this._boards().find(b => b.id === boardId)!;
    this.api.updateBoard(board).subscribe({
      error: (err: Error) => {
        this._boards.set(snapshot);
        this.error.set(err.message);
      },
    });
  }

  resetToSeedData(): void {
    this.loadBoards();
  }
}
