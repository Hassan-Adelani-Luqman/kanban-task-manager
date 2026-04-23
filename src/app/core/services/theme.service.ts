import { Injectable, effect, signal } from '@angular/core';

const STORAGE_KEY = 'kanban-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _isDark = signal<boolean>(this.readPreference());

  readonly isDark = this._isDark.asReadonly();

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', this._isDark());
      localStorage.setItem(STORAGE_KEY, this._isDark() ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this._isDark.update(v => !v);
  }

  private readPreference(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
