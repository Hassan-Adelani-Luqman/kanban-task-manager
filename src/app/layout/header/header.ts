import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { ModalService } from '../../core/services/modal.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly boardService = inject(BoardService);
  protected readonly modalService = inject(ModalService);
  protected readonly themeService = inject(ThemeService);

  readonly menuOpen = signal(false);
  readonly mobileSelectorOpen = signal(false);
  readonly dropdownPos = signal<{ top: number; left: number } | null>(null);

  toggleMobileSelector(event: Event): void {
    const isOpening = !this.mobileSelectorOpen();
    this.mobileSelectorOpen.update(v => !v);
    this.menuOpen.set(false);

    if (isOpening) {
      const btn = event.currentTarget as HTMLElement;
      const header = btn.closest('header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        this.dropdownPos.set({ top: headerRect.bottom + 8, left: btnRect.left });
      }
    }
  }

  closeMobileSelector(): void {
    this.mobileSelectorOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  openEditBoard(): void {
    const board = this.boardService.activeBoard();
    if (!board) return;
    this.closeMenu();
    this.modalService.open('edit-board', { board });
  }

  openDeleteBoard(): void {
    const board = this.boardService.activeBoard();
    if (!board) return;
    this.closeMenu();
    this.modalService.open('delete-board', {
      type: 'board',
      name: board.name,
      id: board.id,
    });
  }

  openAddTask(): void {
    this.modalService.open('add-task');
  }

  get hasColumns(): boolean {
    return (this.boardService.activeBoard()?.columns.length ?? 0) > 0;
  }
}
