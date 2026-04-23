import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { BoardService } from '../../../core/services/board.service';
import { ModalService } from '../../../core/services/modal.service';
import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { Column } from '../column/column';

@Component({
  selector: 'app-board-detail',
  imports: [Column],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
})
export class BoardDetail implements OnInit, OnChanges, HasUnsavedChanges {
  /** Auto-bound from the :boardId route param via withComponentInputBinding() */
  @Input() boardId!: string;

  protected readonly boardService = inject(BoardService);
  protected readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);

  /** Optional column-name filter from query params, e.g. ?filter=Todo */
  readonly filterStatus = toSignal(
    this.route.queryParams.pipe(map(p => p['filter'] ?? null)),
    { initialValue: null }
  );

  ngOnInit(): void {
    if (this.boardId) {
      this.boardService.setActiveBoard(this.boardId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['boardId']?.currentValue) {
      this.boardService.setActiveBoard(changes['boardId'].currentValue);
    }
  }

  hasUnsavedChanges(): boolean {
    return this.modalService.activeModal() !== null;
  }

  openAddBoard(): void {
    this.modalService.open('edit-board');
  }

  get filteredColumns() {
    const board = this.boardService.activeBoard();
    if (!board) return [];
    const filter = this.filterStatus();
    if (!filter) return board.columns;
    return board.columns.filter(c => c.name === filter);
  }
}
