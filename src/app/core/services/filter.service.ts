import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * FilterService — Task 2: BehaviorSubject-based shared state
 *
 * BehaviorSubject is a special type of RxJS Subject that:
 *   1. Requires an initial value ('' here)
 *   2. Stores the current value — new subscribers immediately receive it
 *   3. All subscribers get every future value pushed via .next()
 *
 * Compare with:
 *   - Subject         → no initial value, no replay for late subscribers
 *   - ReplaySubject(1)→ no initial value, replays the last emission to new subscribers
 *   - BehaviorSubject → initial value required, always has "current value"
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
