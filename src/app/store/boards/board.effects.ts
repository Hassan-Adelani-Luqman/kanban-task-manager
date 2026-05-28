import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom, tap } from 'rxjs';
import { BoardDataService } from '../../core/services/board-data.service';
import { BoardActions } from './board.actions';
import { selectAllBoards } from './board.selectors';

@Injectable()
export class BoardEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly dataService = inject(BoardDataService);

  /**
   * loadBoards$ — triggered by BoardActions.loadBoards
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
   * saveBoards$ — triggered by any action that modifies board/task data */
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
