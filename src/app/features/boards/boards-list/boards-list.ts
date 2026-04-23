import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../../../core/services/board.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-boards-list',
  template: `
    <div class="flex flex-col items-center justify-center h-full text-center p-8">
      <p class="heading-l text-medium-gray mb-8">
        This board is empty. Create a new column to get started.
      </p>
      <button
        (click)="openAddBoard()"
        class="bg-primary hover:bg-primary-light text-white heading-m rounded-full px-6 py-4 transition-colors cursor-pointer"
      >
        + Create New Board
      </button>
    </div>
  `,
})
export class BoardsList implements OnInit {
  private readonly boardService = inject(BoardService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  ngOnInit(): void {
    const boards = this.boardService.boards();
    if (boards.length > 0) {
      this.router.navigate(['/boards', boards[0].id], { replaceUrl: true });
    }
  }

  openAddBoard(): void {
    this.modalService.open('add-board');
  }
}
