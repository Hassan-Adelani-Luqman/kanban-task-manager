import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { boardsReducer } from './store/boards/board.reducer';
import { BoardEffects } from './store/boards/board.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    // NgRx Store — registers the 'boards' slice with its reducer
    provideStore({ boards: boardsReducer }),
    // NgRx Effects — registers side-effect classes
    provideEffects(BoardEffects),
    // NgRx DevTools — install the Redux DevTools Chrome extension to use
    provideStoreDevtools({
      maxAge: 25,            // keep last 25 actions in DevTools history
      logOnly: !isDevMode(), // disable time-travel in production builds
    }),
  ],
};
