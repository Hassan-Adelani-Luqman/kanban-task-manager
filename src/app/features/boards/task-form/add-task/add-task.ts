import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardService } from '../../../../core/services/board.service';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule],
  templateUrl: './add-task.html',
})
export class AddTask implements OnInit, HasUnsavedChanges {
  // Reference to the form so we can check if it is dirty
  @ViewChild('taskForm') taskForm!: NgForm;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly boardService = inject(BoardService);

  boardId = '';
  submitted = false;
  duplicateTitleError = false;

  // All form field values in one object
  task = {
    title: '',
    description: '',
    status: '',
    dueDate: '',
  };

  // Column names for the status dropdown
  columns: string[] = [];

  ngOnInit(): void {
    this.boardId = this.route.snapshot.params['boardId'];
    this.boardService.setActiveBoard(this.boardId);
    this.columns = this.boardService.activeBoard()?.columns.map(c => c.name) ?? [];
    // Pre-select the first column as the default status
    this.task.status = this.columns[0] ?? '';
  }

  // Called by the CanDeactivate guard — warn if form is dirty and not yet submitted
  hasUnsavedChanges(): boolean {
    return !this.submitted && (this.taskForm?.dirty ?? false);
  }

  onSubmit(form: NgForm): void {
    this.duplicateTitleError = false;

    // Stop here if any built-in validator failed
    if (form.invalid) return;

    // Custom check: title must not already exist on this board
    const existingTitles = this.boardService.activeBoard()
      ?.columns.flatMap(col => col.tasks)
      .map(t => t.title.toLowerCase()) ?? [];

    if (existingTitles.includes(this.task.title.trim().toLowerCase())) {
      this.duplicateTitleError = true;
      return;
    }

    // All validation passed — save the task
    this.boardService.createTask(this.boardId, {
      title: this.task.title.trim(),
      description: this.task.description.trim(),
      status: this.task.status,
      dueDate: this.task.dueDate || undefined,
      subtasks: [],
    });

    this.submitted = true;
    this.router.navigate(['/boards', this.boardId]);
  }

  cancel(): void {
    this.router.navigate(['/boards', this.boardId]);
  }
}
