import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Board } from '../../core/models/board.models';

/**
 * BoardsState — the shape of the 'boards' slice in the NgRx store.
 *
 * EntityState<Board> adds two fields automatically:
 *   ids:      string[]          — ordered array of board IDs
 *   entities: Record<string, Board> — boards keyed by ID for O(1) lookup
 *
 * We extend it with three more fields for our app needs.
 */
export interface BoardsState extends EntityState<Board> {
  activeBoardId: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * EntityAdapter — provides helper methods for the reducer:
 *   adapter.setAll()     — replace entire collection
 *   adapter.addOne()     — add one entity
 *   adapter.updateOne()  — update one entity by id
 *   adapter.removeOne()  — delete one entity by id
 *   adapter.getSelectors() — derive selectAll, selectEntities from state
 */
export const boardsAdapter = createEntityAdapter<Board>();

/** Starting state — empty collection, no active board, not loading */
export const initialState: BoardsState = boardsAdapter.getInitialState({
  activeBoardId: null,
  loading: false,
  error: null,
});
