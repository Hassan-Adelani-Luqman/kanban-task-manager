import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextField),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-2">
      @if (label()) {
        <label class="heading-s text-medium-gray dark:text-white">{{ label() }}</label>
      }
      <div class="relative">
        <input
          [type]="type()"
          [placeholder]="placeholder()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onTouched()"
          class="w-full border rounded px-4 py-2 body-l bg-white dark:bg-dark-surface
                 text-black dark:text-white placeholder:text-medium-gray/40
                 outline-none focus:border-primary transition-colors"
          [class.border-destructive]="error()"
          [class.border-lines-light]="!error()"
          [class.dark:border-dark-lines]="!error()"
        />
        @if (error()) {
          <span class="absolute right-4 top-1/2 -translate-y-1/2 body-l text-destructive">
            {{ error() }}
          </span>
        }
      </div>
    </div>
  `,
})
export class TextField implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('');
  readonly type = input('text');
  readonly error = input('');

  readonly value = signal('');

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  writeValue(v: string): void {
    this.value.set(v ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
