import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const boardsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./boards-list/boards-list').then(m => m.BoardsList),
    title: 'Kanban',
  },
  {
    path: 'boards/:boardId',
    loadComponent: () =>
      import('./board-detail/board-detail').then(m => m.BoardDetail),
    canDeactivate: [unsavedChangesGuard],
    title: 'Board — Kanban',
  },
];
