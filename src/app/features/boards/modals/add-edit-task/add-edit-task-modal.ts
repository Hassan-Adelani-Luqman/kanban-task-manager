import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../../../core/services/board.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ModalOverlay } from '../../../../shared/components/modal-overlay/modal-overlay';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { generateId, Subtask, Task } from '../../../../core/models/board.models';

@Component({
  selector: 'app-add-edit-task-modal',
  imports: [ModalOverlay, Dropdown, FormsModule],
  templateUrl: './add-edit-task-modal.html',
})
export class AddEditTaskModal implements OnInit {
  readonly mode = input.required<'add' | 'edit'>();

  protected readonly modalService = inject(ModalService);
  protected readonly boardService = inject(BoardService);

  readonly title = signal('');
  readonly description = signal('');
  readonly subtasks = signal<Array<{ id: string; title: string; isCompleted: boolean; error: string }>>([]);
  readonly status = signal('');
  readonly titleError = signal('');

  readonly boardId = computed(() => {
    const p = this.modalService.payload() as { task?: Task; boardId?: string } | null;
    return p?.boardId ?? this.boardService.activeBoardId() ?? '';
  });

  readonly existingTask = computed(() => {
    const p = this.modalService.payload() as { task?: Task } | null;
    return p?.task ?? null;
  });

  readonly columnNames = computed(() =>
    this.boardService.activeBoard()?.columns.map(c => c.name) ?? []
  );

  ngOnInit(): void {
    const firstCol = this.columnNames()[0] ?? '';

    if (this.mode() === 'edit' && this.existingTask()) {
      const t = this.existingTask()!;
      this.title.set(t.title);
      this.description.set(t.description);
      this.status.set(t.status);
      this.subtasks.set(
        t.subtasks.map(s => ({ ...s, error: '' }))
      );
    } else {
      this.status.set(firstCol);
      this.subtasks.set([
        { id: generateId(), title: '', isCompleted: false, error: '' },
        { id: generateId(), title: '', isCompleted: false, error: '' },
      ]);
    }
  }

  addSubtask(): void {
    this.subtasks.update(list => [
      ...list,
      { id: generateId(), title: '', isCompleted: false, error: '' },
    ]);
  }

  removeSubtask(id: string): void {
    this.subtasks.update(list => list.filter(s => s.id !== id));
  }

  updateSubtaskTitle(id: string, value: string): void {
    this.subtasks.update(list =>
      list.map(s => (s.id === id ? { ...s, title: value, error: '' } : s))
    );
  }

  submit(): void {
    let valid = true;

    if (!this.title().trim()) {
      this.titleError.set("Can't be empty");
      valid = false;
    } else {
      const allTasks = this.boardService.activeBoard()?.columns.flatMap(c => c.tasks) ?? [];
      const duplicate = allTasks.some(
        t => t.title.toLowerCase() === this.title().trim().toLowerCase() &&
             t.id !== this.existingTask()?.id
      );
      this.titleError.set(duplicate ? 'Must be unique' : '');
      if (duplicate) valid = false;
    }

    this.subtasks.update(list =>
      list.map(s => {
        if (!s.title.trim()) {
          valid = false;
          return { ...s, error: "Can't be empty" };
        }
        return { ...s, error: '' };
      })
    );

    if (!valid) return;

    const subtasks: Subtask[] = this.subtasks().map(s => ({
      id: s.id,
      title: s.title.trim(),
      isCompleted: s.isCompleted,
    }));

    const bid = this.boardId();

    if (this.mode() === 'edit' && this.existingTask()) {
      const updated: Task = {
        ...this.existingTask()!,
        title: this.title().trim(),
        description: this.description().trim(),
        status: this.status(),
        subtasks,
      };
      this.boardService.updateTask(bid, updated, this.existingTask()!.status);
    } else {
      this.boardService.createTask(bid, {
        title: this.title().trim(),
        description: this.description().trim(),
        status: this.status(),
        subtasks,
      });
    }

    this.modalService.close();
  }
}
