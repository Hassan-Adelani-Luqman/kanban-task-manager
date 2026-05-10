import { TestBed, NO_ERRORS_SCHEMA } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BoardDetail } from './board-detail';
import { BoardService } from '../../../core/services/board.service';
import { BoardApiService } from '../../../core/services/board-api.service';
import { ModalService } from '../../../core/services/modal.service';
import { Board } from '../../../core/models/board.models';

// ─── Test data ────────────────────────────────────────────────────────────────

const testBoard: Board = {
  id: 'b1',
  name: 'Integration Test Board',
  columns: [
    { id: 'c1', name: 'Todo', color: '#49C4E5', tasks: [
      { id: 't1', title: 'Task A', description: '', status: 'Todo', subtasks: [] },
    ]},
    { id: 'c2', name: 'Done', color: '#67E2AE', tasks: [] },
  ],
};

const mockApi = {
  getBoards: jest.fn().mockReturnValue(of([testBoard])),
  getBoard: jest.fn(),
  createBoard: jest.fn().mockReturnValue(of({})),
  updateBoard: jest.fn().mockReturnValue(of({})),
  deleteBoard: jest.fn().mockReturnValue(of(undefined)),
};

// ─── Shared setup factory ─────────────────────────────────────────────────────

async function setup(queryParams: Record<string, string> = {}) {
  await TestBed.configureTestingModule({
    imports: [BoardDetail],
    providers: [
      BoardService,
      { provide: BoardApiService, useValue: mockApi },
      ModalService,
      { provide: ActivatedRoute, useValue: { queryParams: of(queryParams) } },
    ],
    // NO_ERRORS_SCHEMA prevents errors from Column child component dependencies
    schemas: [NO_ERRORS_SCHEMA],
  }).compileComponents();
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BoardDetail (Task 7 — Integration Testing with TestBed)', () => {
  // ── No query filter ────────────────────────────────────────────────────────

  describe('without a filter query param', () => {
    beforeEach(() => setup());

    it('calls boardService.setActiveBoard() with the boardId input on init', () => {
      const setActiveSpy = jest.spyOn(TestBed.inject(BoardService), 'setActiveBoard');
      const fixture = TestBed.createComponent(BoardDetail);
      fixture.componentRef.setInput('boardId', 'b1');
      fixture.detectChanges();
      expect(setActiveSpy).toHaveBeenCalledWith('b1');
    });

    it('filteredColumns() returns all columns when no filter is active', () => {
      const fixture = TestBed.createComponent(BoardDetail);
      fixture.componentRef.setInput('boardId', 'b1');
      TestBed.inject(BoardService).setActiveBoard('b1');
      fixture.detectChanges();
      expect(fixture.componentInstance.filteredColumns.length).toBe(2);
    });

    it('renders one app-column element per column in the active board', () => {
      const fixture = TestBed.createComponent(BoardDetail);
      fixture.componentRef.setInput('boardId', 'b1');
      TestBed.inject(BoardService).setActiveBoard('b1');
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelectorAll('app-column').length).toBe(2);
    });

    it('hasUnsavedChanges() returns false when no modal is open', () => {
      const fixture = TestBed.createComponent(BoardDetail);
      fixture.componentRef.setInput('boardId', 'b1');
      fixture.detectChanges();
      expect(fixture.componentInstance.hasUnsavedChanges()).toBe(false);
    });

    it('hasUnsavedChanges() returns true when a modal is currently open', () => {
      const fixture = TestBed.createComponent(BoardDetail);
      fixture.componentRef.setInput('boardId', 'b1');
      fixture.detectChanges();
      // Open a modal through the real ModalService — this is the integration proof:
      // the component reads ModalService state directly, and the test verifies that
      // a state change in the service is reflected in the component's guard method
      TestBed.inject(ModalService).open('add-board');
      expect(fixture.componentInstance.hasUnsavedChanges()).toBe(true);
    });
  });

  // ── With a filter query param ──────────────────────────────────────────────

  describe('with a ?filter=Todo query param', () => {
    beforeEach(() => setup({ filter: 'Todo' }));

    it('filteredColumns() returns only the column matching the filter', () => {
      const fixture = TestBed.createComponent(BoardDetail);
      fixture.componentRef.setInput('boardId', 'b1');
      TestBed.inject(BoardService).setActiveBoard('b1');
      fixture.detectChanges();

      const cols = fixture.componentInstance.filteredColumns;
      expect(cols.length).toBe(1);
      expect(cols[0].name).toBe('Todo');
    });
  });
});
