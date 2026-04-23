import { Injectable, computed, effect, signal } from '@angular/core';
import { Board, Column, Task, Subtask, generateId, COLUMN_COLORS } from '../models/board.models';
import { SEED_DATA } from '../data/seed-data';

const STORAGE_KEY = 'kanban-boards';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly _boards = signal<Board[]>(this.loadFromStorage());
  private readonly _activeBoardId = signal<string | null>(null);

  readonly boards = this._boards.asReadonly();
  readonly activeBoardId = this._activeBoardId.asReadonly();

  readonly activeBoard = computed(
    () => this._boards().find(b => b.id === this._activeBoardId()) ?? null
  );

  readonly boardCount = computed(() => this._boards().length);

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._boards()));
    });
  }

  // ─── Board navigation ──────────────────────────────────────────────────────

  setActiveBoard(id: string): void {
    this._activeBoardId.set(id);
  }

  getBoardById(id: string): Board | undefined {
    return this._boards().find(b => b.id === id);
  }

  // ─── Board CRUD ────────────────────────────────────────────────────────────

  createBoard(name: string, columns: { name: string; color: string }[]): Board {
    const newBoard: Board = {
      id: generateId(),
      name,
      columns: columns.map(c => ({
        id: generateId(),
        name: c.name,
        color: c.color,
        tasks: [],
      })),
    };
    this._boards.update(boards => [...boards, newBoard]);
    return newBoard;
  }

  updateBoard(boardId: string, name: string, columns: { id?: string; name: string; color: string }[]): void {
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;

        const updatedColumns: Column[] = columns.map(c => {
          const existing = b.columns.find(ec => ec.id === c.id);
          if (existing) {
            return { ...existing, name: c.name, color: c.color };
          }
          return { id: generateId(), name: c.name, color: c.color, tasks: [] };
        });

        // Reassign tasks whose status column name changed
        const allTasks = b.columns.flatMap(col => col.tasks);
        const oldColMap = new Map(b.columns.map(col => [col.id, col.name]));

        allTasks.forEach(task => {
          const oldColEntry = b.columns.find(col => col.tasks.some(t => t.id === task.id));
          if (!oldColEntry) return;
          const newColForOld = updatedColumns.find(nc => nc.id === oldColEntry.id);
          if (newColForOld) {
            const targetCol = updatedColumns.find(nc => nc.id === oldColEntry.id);
            if (targetCol && !targetCol.tasks.some(t => t.id === task.id)) {
              targetCol.tasks.push({ ...task, status: newColForOld.name });
            }
          }
        });

        return { ...b, name, columns: updatedColumns };
      })
    );
  }

  deleteBoard(boardId: string): void {
    this._boards.update(boards => boards.filter(b => b.id !== boardId));
    if (this._activeBoardId() === boardId) {
      const remaining = this._boards();
      this._activeBoardId.set(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  addColumn(boardId: string, name: string): void {
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        const colorIndex = b.columns.length % COLUMN_COLORS.length;
        const newCol: Column = {
          id: generateId(),
          name,
          color: COLUMN_COLORS[colorIndex],
          tasks: [],
        };
        return { ...b, columns: [...b.columns, newCol] };
      })
    );
  }

  // ─── Task CRUD ─────────────────────────────────────────────────────────────

  createTask(boardId: string, task: Omit<Task, 'id'>): Task {
    const newTask: Task = { id: generateId(), ...task };
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(col => {
            if (col.name !== task.status) return col;
            return { ...col, tasks: [...col.tasks, newTask] };
          }),
        };
      })
    );
    return newTask;
  }

  updateTask(boardId: string, updatedTask: Task, previousStatus: string): void {
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(col => {
            // Remove from old column
            if (col.name === previousStatus && col.name !== updatedTask.status) {
              return { ...col, tasks: col.tasks.filter(t => t.id !== updatedTask.id) };
            }
            // Add to new column
            if (col.name === updatedTask.status && col.name !== previousStatus) {
              return { ...col, tasks: [...col.tasks, updatedTask] };
            }
            // Update in same column
            if (col.name === updatedTask.status && col.name === previousStatus) {
              return {
                ...col,
                tasks: col.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)),
              };
            }
            return col;
          }),
        };
      })
    );
  }

  deleteTask(boardId: string, taskId: string): void {
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
  }

  toggleSubtask(boardId: string, taskId: string, subtaskId: string): void {
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          columns: b.columns.map(col => ({
            ...col,
            tasks: col.tasks.map(t => {
              if (t.id !== taskId) return t;
              return {
                ...t,
                subtasks: t.subtasks.map(s =>
                  s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s
                ),
              };
            }),
          })),
        };
      })
    );
  }

  moveTask(boardId: string, taskId: string, newStatus: string): void {
    this._boards.update(boards =>
      boards.map(b => {
        if (b.id !== boardId) return b;
        let taskToMove: Task | undefined;
        // Remove task from its current column and capture it
        const columnsWithRemoved = b.columns.map(col => {
          const task = col.tasks.find(t => t.id === taskId);
          if (task) {
            taskToMove = { ...task, status: newStatus };
            return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
          }
          return col;
        });
        if (!taskToMove) return b;
        // Add task to new column
        return {
          ...b,
          columns: columnsWithRemoved.map(col => {
            if (col.name !== newStatus) return col;
            return { ...col, tasks: [...col.tasks, taskToMove!] };
          }),
        };
      })
    );
  }

  resetToSeedData(): void {
    this._boards.set(JSON.parse(JSON.stringify(SEED_DATA)));
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private loadFromStorage(): Board[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore corrupted storage
    }
    return JSON.parse(JSON.stringify(SEED_DATA));
  }
}
