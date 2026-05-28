import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Board } from '../../core/models/board.models';


export interface BoardsState extends EntityState<Board> {
  activeBoardId: string | null;
  loading: boolean;
  error: string | null;
}


export const boardsAdapter = createEntityAdapter<Board>();

/** Starting state — empty collection, no active board, not loading */
export const initialState: BoardsState = boardsAdapter.getInitialState({
  activeBoardId: null,
  loading: false,
  error: null,
});
