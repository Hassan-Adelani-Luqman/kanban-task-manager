import { Component, input } from '@angular/core';
import { Column as ColumnModel } from '../../../core/models/board.models';
import { TaskCard } from '../task-card/task-card';

@Component({
  selector: 'app-column',
  imports: [TaskCard],
  template: `
    <div class="column-container flex flex-col gap-5 w-[280px] shrink-0">
      <!-- Column header -->
      <div class="flex items-center gap-3">
        <span
          class="w-[15px] h-[15px] rounded-full shrink-0"
          [style.background-color]="col().color"
        ></span>
        <h2 class="heading-s text-medium-gray tracking-[2.4px] uppercase">
          {{ col().name }} ({{ col().tasks.length }})
        </h2>
      </div>

      <!-- Tasks -->
      <div class="flex flex-col gap-5">
        @for (task of col().tasks; track task.id) {
          <app-task-card [task]="task" />
        }
      </div>
    </div>
  `,
})
export class Column {
  readonly col = input.required<ColumnModel>();
}
