import {
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { ModalService } from '../core/services/modal.service';
import { ThemeService } from '../core/services/theme.service';
import { HasUnsavedChanges } from '../core/guards/unsaved-changes.guard';

// Modals (loaded eagerly inside the layout module chunk)
import { ViewTaskModal } from '../features/boards/modals/view-task/view-task-modal';
import { AddEditTaskModal } from '../features/boards/modals/add-edit-task/add-edit-task-modal';
import { AddEditBoardModal } from '../features/boards/modals/add-edit-board/add-edit-board-modal';
import { DeleteConfirmModal } from '../features/boards/modals/delete-confirm/delete-confirm-modal';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    Sidebar,
    Header,
    ViewTaskModal,
    AddEditTaskModal,
    AddEditBoardModal,
    DeleteConfirmModal,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements HasUnsavedChanges {
  protected readonly modalService = inject(ModalService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly sidebarVisible = signal(true);

  /** Thin progress bar shown during router navigation */
  readonly isNavigating = toSignal(
    this.router.events.pipe(
      map(e =>
        e instanceof NavigationStart
          ? true
          : e instanceof NavigationEnd || e instanceof NavigationError
          ? false
          : null
      ),
      filter((v): v is boolean => v !== null),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: false }
  );

  hasUnsavedChanges(): boolean {
    return this.modalService.activeModal() !== null;
  }

  toggleSidebar(): void {
    this.sidebarVisible.update(v => !v);
  }
}
