import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../core/models/board.models';

@Pipe({ name: 'subtaskCount' })
export class SubtaskCountPipe implements PipeTransform {
  transform(task: Task): string {
    const total = task.subtasks.length;
    const completed = task.subtasks.filter(s => s.isCompleted).length;
    return `${completed} of ${total} subtask${total !== 1 ? 's' : ''}`;
  }
}
