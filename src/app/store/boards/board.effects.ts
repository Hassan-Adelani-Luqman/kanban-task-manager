import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom, tap } from 'rxjs';
import { BoardDataService } from '../../core/services/board-data.service';
import { BoardActions } from './board.actions';
import { selectAllBoards } from './board.selectors';

/**
 * BoardEffects — handles side effects triggered by actions.
 *
 * Effects listen for specific actions, do async work (API calls, localStorage, etc.),
 * then dispatch new actions with the results.
 *
 * Data flow:
 *   Action dispatched → Effect intercepts → async work → new action dispatched
 *                                                       ↓
 *                                                  Reducer updates state
 *                                                       ↓
 *                                               Components re-render
 */
@Injectable()
export class BoardEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly dataService = inject(BoardDataService);

  /**
   * loadBoards$ — triggered by BoardActions.loadBoards
   *
   * Reads boards from localStorage (via BoardDataService) and dispatches
   * loadBoardsSuccess with the result, or loadBoardsFailure on error.
   *
   * switchMap cancels any previous in-flight load if a new one starts.
   */
  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoards),
      switchMap(() =>
        this.dataService.getBoards().pipe(
          map(boards => BoardActions.loadBoardsSuccess({ boards })),
          catchError(err =>
            of(BoardActions.loadBoardsFailure({ error: err?.message ?? 'Failed to load boards' }))
          )
        )
      )
    )
  );

  /**
   * saveBoards$ — triggered by any action that modifies board/task data
   *
   * After the reducer has already updated the store, this effect reads the
   * current boards from the store (withLatestFrom) and saves them to localStorage.
   *
   * dispatch: false — this effect does NOT dispatch a follow-up action.
   * tap() — used for side effects that don't change the stream value.
   */
  saveBoards$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BoardActions.createBoard,
          BoardActions.updateBoard,
          BoardActions.deleteBoard,
          BoardActions.addColumn,
          BoardActions.resetToSeedData,
          BoardActions.createTask,
          BoardActions.updateTask,
          BoardActions.deleteTask,
          BoardActions.toggleSubtask,
          BoardActions.moveTask
        ),
        // withLatestFrom reads the store AFTER the reducer has already processed the action
        withLatestFrom(this.store.select(selectAllBoards)),
        switchMap(([_, boards]) => this.dataService.saveBoards(boards))
      ),
    { dispatch: false }
  );
}
