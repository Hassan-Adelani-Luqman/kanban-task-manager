import { Component, computed, inject, signal } from '@angular/core';
import { BoardService } from '../../../../core/services/board.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ModalOverlay } from '../../../../shared/components/modal-overlay/modal-overlay';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { Task } from '../../../../core/models/board.models';

@Component({
  selector: 'app-view-task-modal',
  imports: [ModalOverlay, Dropdown],
  templateUrl: './view-task-modal.html',
})
export class ViewTaskModal {
  protected readonly modalService = inject(ModalService);
  protected readonly boardService = inject(BoardService);

  readonly menuOpen = signal(false);

  readonly task = computed(() => {
    const p = this.modalService.payload() as { task: Task; boardId: string } | null;
    return p?.task ?? null;
  });

  readonly boardId = computed(() => {
    const p = this.modalService.payload() as { task: Task; boardId: string } | null;
    return p?.boardId ?? null;
  });

  /** The latest version of the task from the store (reflects subtask toggles live) */
  readonly liveTask = computed(() => {
    const id = this.task()?.id;
    if (!id) return null;
    const board = this.boardService.activeBoard();
    if (!board) return null;
    for (const col of board.columns) {
      const found = col.tasks.find(t => t.id === id);
      if (found) return found;
    }
    return null;
  });

  readonly columnNames = computed(() =>
    this.boardService.activeBoard()?.columns.map(c => c.name) ?? []
  );

  readonly currentStatus = computed(() => this.liveTask()?.status ?? '');

  toggleSubtask(subtaskId: string): void {
    const bid = this.boardId();
    const tid = this.task()?.id;
    if (!bid || !tid) return;
    this.boardService.toggleSubtask(bid, tid, subtaskId);
  }

  changeStatus(newStatus: string): void {
    const bid = this.boardId();
    const t = this.liveTask();
    if (!bid || !t) return;
    this.boardService.moveTask(bid, t.id, newStatus);
  }

  openEdit(): void {
    const t = this.liveTask();
    const bid = this.boardId();
    if (!t || !bid) return;
    this.menuOpen.set(false);
    this.modalService.open('edit-task', { task: t, boardId: bid });
  }

  openDelete(): void {
    const t = this.liveTask();
    if (!t) return;
    this.menuOpen.set(false);
    this.modalService.open('delete-task', {
      type: 'task',
      name: t.title,
      id: t.id,
      boardId: this.boardId(),
    });
  }

  get completedCount(): number {
    return this.liveTask()?.subtasks.filter(s => s.isCompleted).length ?? 0;
  }
}
