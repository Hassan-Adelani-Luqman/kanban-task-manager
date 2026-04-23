import { Component, inject, output } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-modal-overlay',
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      (click)="onBackdropClick($event)"
      role="dialog"
      aria-modal="true"
    >
      <!-- Modal card — stop propagation so clicks inside don't close it -->
      <div
        class="modal-card bg-white dark:bg-dark-surface rounded-lg w-full max-w-[480px] max-h-[90vh] overflow-y-auto relative z-50"
        (click)="$event.stopPropagation()"
      >
        <ng-content />
      </div>
    </div>
  `,
})
export class ModalOverlay {
  private readonly modalService = inject(ModalService);

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.modalService.close();
    }
  }
}
