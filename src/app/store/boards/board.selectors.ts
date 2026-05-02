import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoardsState, boardsAdapter } from './board.state';

/**
 * Selectors — pure functions that extract data from the NgRx store.
 *
 * Benefits:
 *   - Components only access the slice of state they need (no over-fetching)
 *   - Memoized: if the input state hasn't changed, the selector returns the
 *     cached result without recomputing
 *   - Composable: build complex selectors from simpler ones
 */

// Step 1: select the entire 'boards' feature slice
export const selectBoardsState = createFeatureSelector<BoardsState>('boards');

// EntityAdapter provides two pre-built selector factories
const { selectAll, selectEntities } = boardsAdapter.getSelectors();

// Step 2: derive the flat array of Board objects from the entity map
export const selectAllBoards = createSelector(selectBoardsState, selectAll);

// Step 3: derive individual scalar values
export const selectActiveBoardId = createSelector(
  selectBoardsState, s => s.activeBoardId
);

export const selectLoading = createSelector(
  selectBoardsState, s => s.loading
);

export const selectError = createSelector(
  selectBoardsState, s => s.error
);

export const selectBoardCount = createSelector(
  selectAllBoards, boards => boards.length
);

// Step 4: compose selectors — find the active board by combining two simpler selectors
export const selectActiveBoard = createSelector(
  selectAllBoards,
  selectActiveBoardId,
  (boards, id) => boards.find(b => b.id === id) ?? null
);
