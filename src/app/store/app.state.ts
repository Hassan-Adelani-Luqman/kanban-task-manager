import { BoardsState } from './boards/board.state';

/** Root state interface — maps feature keys to their state shapes */
export interface AppState {
  boards: BoardsState;
}
