import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../../../../core/services/board.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ModalOverlay } from '../../../../shared/components/modal-overlay/modal-overlay';

interface DeletePayload {
  type: 'board' | 'task';
  name: string;
  id: string;
  boardId?: string;
}

@Component({
  selector: 'app-delete-confirm-modal',
  imports: [ModalOverlay],
  templateUrl: './delete-confirm-modal.html',
})
export class DeleteConfirmModal {
  protected readonly modalService = inject(ModalService);
  protected readonly boardService = inject(BoardService);
  private readonly router = inject(Router);

  readonly payload = computed(() => this.modalService.payload() as DeletePayload | null);

  confirm(): void {
    const p = this.payload();
    if (!p) return;

    if (p.type === 'board') {
      this.boardService.deleteBoard(p.id);
      this.modalService.close();
      const remaining = this.boardService.boards();
      if (remaining.length > 0) {
        this.router.navigate(['/boards', remaining[0].id]);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      const boardId = p.boardId ?? this.boardService.activeBoardId() ?? '';
      this.boardService.deleteTask(boardId, p.id);
      this.modalService.close();
    }
  }

  cancel(): void {
    this.modalService.close();
  }
}
