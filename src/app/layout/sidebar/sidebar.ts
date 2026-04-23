import { Component, inject, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { ModalService } from '../../core/services/modal.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly hide = output<void>();

  protected readonly boardService = inject(BoardService);
  protected readonly modalService = inject(ModalService);
  protected readonly themeService = inject(ThemeService);

  openAddBoard(): void {
    this.modalService.open('add-board');
  }
}
