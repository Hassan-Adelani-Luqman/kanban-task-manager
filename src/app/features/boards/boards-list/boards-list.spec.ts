import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BoardsList } from './boards-list';
import { BoardService } from '../../../core/services/board.service';
import { ModalService } from '../../../core/services/modal.service';

// Build a minimal BoardService mock with a configurable boards() return value
function buildServiceMock(boardIds: string[] = []) {
  const boards = boardIds.map(id => ({ id, name: `Board ${id}`, columns: [] }));
  return {
    boards: jest.fn().mockReturnValue(boards),
    loading: jest.fn().mockReturnValue(false),
    error: jest.fn().mockReturnValue(null),
  };
}

describe('BoardsList (Task 3 — Testing Components with Dependencies)', () => {
  // ── When no boards exist ──────────────────────────────────────────────────────

  describe('when no boards exist', () => {
    let navigateSpy: jest.SpyInstance;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BoardsList],
        providers: [
          { provide: BoardService, useValue: buildServiceMock() },
          { provide: ModalService, useValue: { open: jest.fn() } },
        ],
      }).compileComponents();
      navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    });

    it('shows the empty-state message', () => {
      const fixture = TestBed.createComponent(BoardsList);
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).textContent).toContain(
        'Create a new column to get started'
      );
    });

    it('shows the "+ Create New Board" button', () => {
      const fixture = TestBed.createComponent(BoardsList);
      fixture.detectChanges();
      const btn = (fixture.nativeElement as HTMLElement).querySelector('button');
      expect(btn?.textContent?.trim()).toContain('+ Create New Board');
    });

    it('does NOT navigate on init', () => {
      TestBed.createComponent(BoardsList).detectChanges();
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('calls ModalService.open("add-board") when the button is clicked', () => {
      const fixture = TestBed.createComponent(BoardsList);
      fixture.detectChanges();
      (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')?.click();
      expect(TestBed.inject(ModalService).open).toHaveBeenCalledWith('add-board');
    });
  });

  // ── When boards exist ─────────────────────────────────────────────────────────

  describe('when boards exist', () => {
    let navigateSpy: jest.SpyInstance;

    beforeEach(async () => {
      // Provide boards from the start so ngOnInit can see them immediately
      await TestBed.configureTestingModule({
        imports: [BoardsList],
        providers: [
          { provide: BoardService, useValue: buildServiceMock(['b1', 'b2']) },
          { provide: ModalService, useValue: { open: jest.fn() } },
        ],
      }).compileComponents();
      navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    });

    it('navigates to the first board on init', () => {
      TestBed.createComponent(BoardsList).detectChanges();
      expect(navigateSpy).toHaveBeenCalledWith(['/boards', 'b1'], expect.anything());
    });
  });
});
