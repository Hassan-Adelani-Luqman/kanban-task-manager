import { Component, inject, input } from '@angular/core';
import { Task } from '../../../core/models/board.models';
import { ModalService } from '../../../core/services/modal.service';
import { BoardService } from '../../../core/services/board.service';
import { SubtaskCountPipe } from '../../../shared/pipes/subtask-count.pipe';

@Component({
  selector: 'app-task-card',
  imports: [SubtaskCountPipe],
  template: `
    <div
      (click)="openTask()"
      class="bg-white dark:bg-dark-surface rounded-lg px-4 py-6 shadow-[0_4px_6px_rgba(54,78,126,0.1)]
             cursor-pointer group transition-shadow hover:shadow-md"
      role="button"
      [attr.aria-label]="task().title"
    >
      <h3 class="heading-m text-black dark:text-white group-hover:text-primary transition-colors mb-2">
        {{ task().title }}
      </h3>
      <p class="body-m text-medium-gray">{{ task() | subtaskCount }}</p>
    </div>
  `,
})
export class TaskCard {
  readonly task = input.required<Task>();

  private readonly modalService = inject(ModalService);
  private readonly boardService = inject(BoardService);

  openTask(): void {
    this.modalService.open('view-task', {
      task: this.task(),
      boardId: this.boardService.activeBoardId(),
    });
  }
}
