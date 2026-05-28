import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * FilterService — BehaviorSubject-based shared state
 */
@Injectable({ providedIn: 'root' })
export class FilterService {
  // Private — only this service can push new values
  private readonly boardSearch$ = new BehaviorSubject<string>('');

  // Public read-only observable — components subscribe but cannot call .next() directly
  readonly boardSearch = this.boardSearch$.asObservable();

  /** Push a new search term to all subscribers */
  setBoardSearch(term: string): void {
    this.boardSearch$.next(term);
  }

  /** Reset the search term */
  clearSearch(): void {
    this.boardSearch$.next('');
  }

  /** Synchronous snapshot — useful when you need the current value without subscribing */
  getCurrentSearch(): string {
    return this.boardSearch$.getValue();
  }
}
