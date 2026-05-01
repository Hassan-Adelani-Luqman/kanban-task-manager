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
  {
    path: 'boards/:boardId/new-task',
    loadComponent: () =>
      import('./task-form/add-task/add-task').then(m => m.AddTask),
    canDeactivate: [unsavedChangesGuard],
    title: 'Add Task — Kanban',
  },
  {
    path: 'boards/:boardId/edit/:taskId',
    loadComponent: () =>
      import('./task-form/edit-task/edit-task').then(m => m.EditTask),
    canDeactivate: [unsavedChangesGuard],
    title: 'Edit Task — Kanban',
  },
];
