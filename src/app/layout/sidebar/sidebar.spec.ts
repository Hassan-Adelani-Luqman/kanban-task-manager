import { TestBed, NO_ERRORS_SCHEMA } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { Sidebar } from './sidebar';
import { BoardService } from '../../core/services/board.service';
import { ModalService } from '../../core/services/modal.service';
import { ThemeService } from '../../core/services/theme.service';

const sampleBoards = [
  { id: 'b1', name: 'Platform Launch', columns: [] },
  { id: 'b2', name: 'Marketing Plan', columns: [] },
];

describe('Sidebar (Task 3 — Testing Components with Dependencies)', () => {
  let mockModalService: { open: jest.Mock };

  beforeEach(async () => {
    mockModalService = { open: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        {
          provide: BoardService,
          useValue: {
            boards: signal(sampleBoards),
            boardCount: signal(sampleBoards.length),
          },
        },
        { provide: ModalService, useValue: mockModalService },
        { provide: ThemeService, useValue: { isDark: signal(false), toggle: jest.fn() } },
        // RouterLink inside the sidebar template requires a router provider
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('renders one nav link per board', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const links = el.querySelectorAll('a[href*="/boards/"]');
    expect(links.length).toBe(2);
  });

  it('renders each board name in the nav', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Platform Launch');
    expect(el.textContent).toContain('Marketing Plan');
  });

  it('calls ModalService.open("add-board") when "+ Create New Board" is clicked', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const btn = Array.from(el.querySelectorAll('button')).find(b =>
      b.textContent?.includes('Create New Board')
    ) as HTMLButtonElement;
    btn.click();
    expect(mockModalService.open).toHaveBeenCalledWith('add-board');
  });

  it('emits the hide output when "Hide Sidebar" is clicked', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    let emitted = false;
    outputToObservable(fixture.componentInstance.hide).subscribe(() => (emitted = true));

    const el = fixture.nativeElement as HTMLElement;
    const hideBtn = Array.from(el.querySelectorAll('button')).find(b =>
      b.textContent?.includes('Hide Sidebar')
    ) as HTMLButtonElement;
    hideBtn.click();

    expect(emitted).toBe(true);
  });
});
