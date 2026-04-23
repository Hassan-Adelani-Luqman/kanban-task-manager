import { Component, input, model, signal } from '@angular/core';

interface DropdownPos {
  top: string;
  left: string;
  width: string;
}

@Component({
  selector: 'app-dropdown',
  template: `
    <div class="flex flex-col gap-2">
      @if (label()) {
        <label class="heading-s text-medium-gray dark:text-white">{{ label() }}</label>
      }
      <div class="relative">
        <!-- Trigger -->
        <button
          type="button"
          (click)="toggle($event)"
          class="w-full flex items-center justify-between border border-lines-light dark:border-dark-lines
                 rounded px-4 py-2 bg-white dark:bg-dark-surface text-black dark:text-white
                 body-l outline-none focus:border-primary transition-colors cursor-pointer"
          [class.border-primary]="open()"
        >
          <span>{{ selected() }}</span>
          <svg
            width="10" height="7" viewBox="0 0 10 7" fill="none"
            class="transition-transform duration-150 shrink-0"
            [class.rotate-180]="open()"
          >
            <path d="M1 1L5 5L9 1" stroke="#635FC7" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Options — rendered with fixed positioning so it escapes overflow:hidden/auto containers -->
        @if (open()) {
          <!-- Click-away -->
          <div class="fixed inset-0 z-[90]" (click)="close()"></div>

          <ul
            class="fixed bg-white dark:bg-dark-bg rounded-lg shadow-lg z-[100] py-2 overflow-y-auto max-h-60"
            [style.top]="pos()!.top"
            [style.left]="pos()!.left"
            [style.width]="pos()!.width"
          >
            @for (opt of options(); track opt) {
              <li>
                <button
                  type="button"
                  (click)="select(opt)"
                  class="w-full text-left px-4 py-2 body-l cursor-pointer
                         text-medium-gray hover:text-primary transition-colors"
                  [class.text-primary]="opt === selected()"
                >
                  {{ opt }}
                </button>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
})
export class Dropdown {
  readonly label = input('');
  readonly options = input.required<string[]>();
  readonly selected = model.required<string>();

  readonly open = signal(false);
  readonly pos = signal<DropdownPos | null>(null);

  toggle(event: MouseEvent): void {
    if (!this.open()) {
      const btn = event.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      this.pos.set({
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      });
    }
    this.open.update(v => !v);
  }

  close(): void {
    this.open.set(false);
  }

  select(opt: string): void {
    this.selected.set(opt);
    this.close();
  }
}
