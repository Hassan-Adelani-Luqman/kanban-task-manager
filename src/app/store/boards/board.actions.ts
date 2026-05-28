import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Board, Task } from '../../core/models/board.models';

/**
 * BoardActions — all events that can happen to board/task state.
 *
 * createActionGroup() groups related actions under one source name.
 */
export const BoardActions = createActionGroup({
  source: 'Boards',
  events: {
    // ── Data loading (handled by Effects) ─────────────────────────────
    'Load Boards':         emptyProps(),
    'Load Boards Success': props<{ boards: Board[] }>(),
    'Load Boards Failure': props<{ error: string }>(),

    // ── Board navigation ──────────────────────────────────────────────
    'Set Active Board': props<{ id: string }>(),

    // ── Board CRUD ────────────────────────────────────────────────────
    'Create Board':       props<{ board: Board }>(),
    'Update Board':       props<{ board: Board }>(),
    'Delete Board':       props<{ boardId: string }>(),
    'Add Column':         props<{ boardId: string; name: string; color: string }>(),
    'Reset To Seed Data': emptyProps(),

    // ── Task CRUD ─────────────────────────────────────────────────────
    'Create Task':    props<{ boardId: string; task: Task }>(),
    'Update Task':    props<{ boardId: string; task: Task; previousStatus: string }>(),
    'Delete Task':    props<{ boardId: string; taskId: string }>(),
    'Toggle Subtask': props<{ boardId: string; taskId: string; subtaskId: string }>(),
    'Move Task':      props<{ boardId: string; taskId: string; newStatus: string }>(),
  },
});
