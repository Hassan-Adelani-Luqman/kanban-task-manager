import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardService } from '../../../../core/services/board.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ModalOverlay } from '../../../../shared/components/modal-overlay/modal-overlay';
import { Board, COLUMN_COLORS, generateId } from '../../../../core/models/board.models';

interface ColumnDraft {
  id: string;
  name: string;
  color: string;
  error: string;
}

@Component({
  selector: 'app-add-edit-board-modal',
  imports: [ModalOverlay, FormsModule],
  templateUrl: './add-edit-board-modal.html',
})
export class AddEditBoardModal implements OnInit {
  readonly mode = input.required<'add' | 'edit'>();

  protected readonly modalService = inject(ModalService);
  protected readonly boardService = inject(BoardService);
  private readonly router = inject(Router);

  readonly boardName = signal('');
  readonly boardNameError = signal('');
  readonly columns = signal<ColumnDraft[]>([]);

  readonly existingBoard = computed(() => {
    const p = this.modalService.payload() as { board?: Board } | null;
    return p?.board ?? null;
  });

  ngOnInit(): void {
    if (this.mode() === 'edit' && this.existingBoard()) {
      const b = this.existingBoard()!;
      this.boardName.set(b.name);
      this.columns.set(
        b.columns.map(c => ({ id: c.id, name: c.name, color: c.color, error: '' }))
      );
    } else {
      this.columns.set([
        { id: generateId(), name: '', color: COLUMN_COLORS[0], error: '' },
        { id: generateId(), name: '', color: COLUMN_COLORS[1], error: '' },
      ]);
    }
  }

  addColumn(): void {
    this.columns.update(list => {
      const colorIndex = list.length % COLUMN_COLORS.length;
      return [
        ...list,
        { id: generateId(), name: '', color: COLUMN_COLORS[colorIndex], error: '' },
      ];
    });
  }

  removeColumn(id: string): void {
    this.columns.update(list => list.filter(c => c.id !== id));
  }

  updateColumnName(id: string, value: string): void {
    this.columns.update(list =>
      list.map(c => (c.id === id ? { ...c, name: value, error: '' } : c))
    );
  }

  submit(): void {
    let valid = true;

    if (!this.boardName().trim()) {
      this.boardNameError.set("Can't be empty");
      valid = false;
    } else {
      this.boardNameError.set('');
    }

    this.columns.update(list =>
      list.map(c => {
        if (!c.name.trim()) {
          valid = false;
          return { ...c, error: "Can't be empty" };
        }
        return { ...c, error: '' };
      })
    );

    if (!valid) return;

    const columnDrafts = this.columns().map(c => ({
      id: c.id,
      name: c.name.trim(),
      color: c.color,
    }));

    if (this.mode() === 'edit' && this.existingBoard()) {
      this.boardService.updateBoard(this.existingBoard()!.id, this.boardName().trim(), columnDrafts);
      this.modalService.close();
    } else {
      const newBoard = this.boardService.createBoard(this.boardName().trim(), columnDrafts);
      this.modalService.close();
      this.router.navigate(['/boards', newBoard.id]);
    }
  }
}
