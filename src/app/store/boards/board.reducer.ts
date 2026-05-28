import { createReducer, on } from '@ngrx/store';
import { generateId, COLUMN_COLORS, Board, Column } from '../../core/models/board.models';
import { SEED_DATA } from '../../core/data/seed-data';
import { BoardActions } from './board.actions';
import { boardsAdapter, initialState } from './board.state';

export const boardsReducer = createReducer(
  initialState,

  // ── Loading ──────────────────────────────────────────────────────────────

  on(BoardActions.loadBoards, state =>
    ({ ...state, loading: true, error: null })
  ),

  // setAll() replaces the entire entity collection with the loaded boards
  on(BoardActions.loadBoardsSuccess, (state, { boards }) =>
    boardsAdapter.setAll(boards, { ...state, loading: false })
  ),

  on(BoardActions.loadBoardsFailure, (state, { error }) =>
    ({ ...state, loading: false, error })
  ),

  // ── Board navigation ─────────────────────────────────────────────────────

  on(BoardActions.setActiveBoard, (state, { id }) =>
    ({ ...state, activeBoardId: id })
  ),

  // ── Board CRUD ───────────────────────────────────────────────────────────

  // addOne() inserts a new board into the entity collection
  on(BoardActions.createBoard, (state, { board }) =>
    boardsAdapter.addOne(board, state)
  ),

  // updateOne() replaces the matching board (by id) with the new version
  on(BoardActions.updateBoard, (state, { board }) =>
    boardsAdapter.updateOne({ id: board.id, changes: board }, state)
  ),

  // removeOne() deletes the board; if it was active, point to first remaining board
  on(BoardActions.deleteBoard, (state, { boardId }) => {
    const next = boardsAdapter.removeOne(boardId, state);
    const activeBoardId = state.activeBoardId === boardId
      ? (next.ids[0] as string ?? null)
      : state.activeBoardId;
    return { ...next, activeBoardId };
  }),

  // Add a new column to a specific board
  on(BoardActions.addColumn, (state, { boardId, name, color }) => {
    const board = state.entities[boardId];
    if (!board) return state;
    const newCol: Column = { id: generateId(), name, color, tasks: [] };
    const updatedBoard: Board = { ...board, columns: [...board.columns, newCol] };
    return boardsAdapter.updateOne({ id: boardId, changes: updatedBoard }, state);
  }),

  // Reset — replace all entities with seed data, clear active board
  on(BoardActions.resetToSeedData, state =>
    boardsAdapter.setAll(
      JSON.parse(JSON.stringify(SEED_DATA)),
      { ...state, activeBoardId: null }
    )
  ),

  // ── Task CRUD ────────────────────────────────────────────────────────────
  // Tasks are nested inside Board.columns[].tasks, so we update the parent board
  on(BoardActions.createTask, (state, { boardId, task }) => {
    const board = state.entities[boardId];
    if (!board) return state;
    const updatedBoard: Board = {
      ...board,
      columns: board.columns.map(col =>
        col.name === task.status
          ? { ...col, tasks: [...col.tasks, task] }
          : col
      ),
    };
    return boardsAdapter.updateOne({ id: boardId, changes: updatedBoard }, state);
  }),

  on(BoardActions.updateTask, (state, { boardId, task, previousStatus }) => {
    const board = state.entities[boardId];
    if (!board) return state;
    const updatedBoard: Board = {
      ...board,
      columns: board.columns.map(col => {
        // Remove from old column when status changed
        if (col.name === previousStatus && col.name !== task.status)
          return { ...col, tasks: col.tasks.filter(t => t.id !== task.id) };
        // Add to new column
        if (col.name === task.status && col.name !== previousStatus)
          return { ...col, tasks: [...col.tasks, task] };
        // Update in same column
        if (col.name === task.status)
          return { ...col, tasks: col.tasks.map(t => t.id === task.id ? task : t) };
        return col;
      }),
    };
    return boardsAdapter.updateOne({ id: boardId, changes: updatedBoard }, state);
  }),

  on(BoardActions.deleteTask, (state, { boardId, taskId }) => {
    const board = state.entities[boardId];
    if (!board) return state;
    const updatedBoard: Board = {
      ...board,
      columns: board.columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => t.id !== taskId),
      })),
    };
    return boardsAdapter.updateOne({ id: boardId, changes: updatedBoard }, state);
  }),

  on(BoardActions.toggleSubtask, (state, { boardId, taskId, subtaskId }) => {
    const board = state.entities[boardId];
    if (!board) return state;
    const updatedBoard: Board = {
      ...board,
      columns: board.columns.map(col => ({
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
    return boardsAdapter.updateOne({ id: boardId, changes: updatedBoard }, state);
  }),

  on(BoardActions.moveTask, (state, { boardId, taskId, newStatus }) => {
    const board = state.entities[boardId];
    if (!board) return state;
    const movedTask = board.columns.flatMap(c => c.tasks).find(t => t.id === taskId);
    if (!movedTask) return state;
    const taskWithNewStatus = { ...movedTask, status: newStatus };
    const updatedBoard: Board = {
      ...board,
      columns: board.columns.map(col => {
        if (col.tasks.some(t => t.id === taskId) && col.name !== newStatus)
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        if (col.name === newStatus)
          return { ...col, tasks: [...col.tasks, taskWithNewStatus] };
        return col;
      }),
    };
    return boardsAdapter.updateOne({ id: boardId, changes: updatedBoard }, state);
  }),
);
