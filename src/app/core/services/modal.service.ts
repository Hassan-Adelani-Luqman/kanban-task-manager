import { Injectable, signal } from '@angular/core';

export type ModalType =
  | 'view-task'
  | 'add-task'
  | 'edit-task'
  | 'add-board'
  | 'edit-board'
  | 'delete-board'
  | 'delete-task'
  | null;

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly _activeModal = signal<ModalType>(null);
  private readonly _payload = signal<unknown>(null);

  readonly activeModal = this._activeModal.asReadonly();
  readonly payload = this._payload.asReadonly();

  open(modal: ModalType, payload?: unknown): void {
    this._payload.set(payload ?? null);
    this._activeModal.set(modal);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this._activeModal.set(null);
    this._payload.set(null);
    document.body.style.overflow = '';
  }
}
