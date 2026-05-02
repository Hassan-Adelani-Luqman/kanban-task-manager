import { Component, inject, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';
import { BoardService } from '../../core/services/board.service';
import { ModalService } from '../../core/services/modal.service';
import { ThemeService } from '../../core/services/theme.service';
import { FilterService } from '../../core/services/filter.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly hide = output<void>();

  protected readonly boardService = inject(BoardService);
  protected readonly modalService = inject(ModalService);
  protected readonly themeService = inject(ThemeService);
  protected readonly filterService = inject(FilterService);

  /**
   * filteredBoards$ — combines the search term (BehaviorSubject) with the
   * boards list (NgRx store selector) to produce a filtered Observable.
   *
   * combineLatest emits whenever EITHER source emits, giving us always-fresh data.
   * The template uses the async pipe to subscribe and auto-unsubscribe.
   */
  readonly filteredBoards$ = combineLatest([
    this.filterService.boardSearch,          // Observable<string> from BehaviorSubject
    toObservable(this.boardService.boards),  // Signal<Board[]> → Observable<Board[]>
  ]).pipe(
    map(([search, boards]) =>
      search.trim()
        ? boards.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
        : boards
    )
  );

  openAddBoard(): void {
    this.modalService.open('add-board');
  }
}
