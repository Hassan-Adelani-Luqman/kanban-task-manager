import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BoardService } from '../../../../core/services/board.service';
import { Task } from '../../../../core/models/board.models';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';

// Custom validator: title must not start or end with whitespace
function noLeadingTrailingSpaces(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (value !== value.trim()) {
    return { whitespace: true };
  }
  return null;
}

@Component({
  selector: 'app-edit-task',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-task.html',
})
export class EditTask implements OnInit, HasUnsavedChanges {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly boardService = inject(BoardService);

  form!: FormGroup;
  boardId = '';
  taskId = '';
  originalTask!: Task;
  columns: string[] = [];
  submitted = false;
  duplicateTitleError = false;

  ngOnInit(): void {
    this.boardId = this.route.snapshot.params['boardId'];
    this.taskId = this.route.snapshot.params['taskId'];
    this.boardService.setActiveBoard(this.boardId);

    const board = this.boardService.activeBoard();
    this.columns = board?.columns.map(c => c.name) ?? [];

    // Find the task to edit across all columns
    this.originalTask = board?.columns
      .flatMap(col => col.tasks)
      .find(t => t.id === this.taskId)!;

    // Build the reactive form with validators
    this.form = this.fb.group({
      title: [
        this.originalTask.title,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          noLeadingTrailingSpaces,
        ],
      ],
      description: [this.originalTask.description],
      status: [this.originalTask.status, Validators.required],
      dueDate: [this.originalTask.dueDate ?? ''],
    });
  }

  // Called by the CanDeactivate guard — warn if form is dirty and not yet submitted
  hasUnsavedChanges(): boolean {
    return !this.submitted && (this.form?.dirty ?? false);
  }

  // Convenience getter for cleaner template access
  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.duplicateTitleError = false;

    // Mark all fields touched so errors show up
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const values = this.form.value;

    // Custom check: no duplicate title (excluding the task being edited)
    const existingTitles = this.boardService.activeBoard()
      ?.columns.flatMap(col => col.tasks)
      .filter(t => t.id !== this.taskId)
      .map(t => t.title.toLowerCase()) ?? [];

    if (existingTitles.includes(values.title.trim().toLowerCase())) {
      this.duplicateTitleError = true;
      return;
    }

    // Save the updated task
    const updatedTask: Task = {
      ...this.originalTask,
      title: values.title.trim(),
      description: values.description?.trim() ?? '',
      status: values.status,
      dueDate: values.dueDate || undefined,
    };

    this.boardService.updateTask(this.boardId, updatedTask, this.originalTask.status);

    this.submitted = true;
    this.router.navigate(['/boards', this.boardId]);
  }

  cancel(): void {
    this.router.navigate(['/boards', this.boardId]);
  }
}
