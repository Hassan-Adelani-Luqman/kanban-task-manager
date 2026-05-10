import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { BoardService } from './board.service';
import { BoardApiService } from './board-api.service';
import { Board } from '../models/board.models';

// ─── Shared test data ──────────────────────────────────────────────────────────

const mockBoards: Board[] = [
  {
    id: 'b1',
    name: 'Platform Launch',
    columns: [
      {
        id: 'c1', name: 'Todo', color: '#49C4E5',
        tasks: [
          { id: 't1', title: 'Task One', description: '', status: 'Todo', subtasks: [
            { id: 's1', title: 'Subtask A', isCompleted: false },
          ]},
        ],
      },
      { id: 'c2', name: 'Done', color: '#67E2AE', tasks: [] },
    ],
  },
  { id: 'b2', name: 'Marketing Plan', columns: [] },
];

// ─── Helper: build the service with a customizable API mock ───────────────────

function buildMockApi(boards: Board[] = mockBoards) {
  return {
    getBoards: jest.fn().mockReturnValue(of(boards)),
    getBoard: jest.fn(),
    createBoard: jest.fn().mockReturnValue(of({})),
    updateBoard: jest.fn().mockReturnValue(of({})),
    deleteBoard: jest.fn().mockReturnValue(of(undefined)),
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BoardService (Tasks 4 & 6 — Service & Async Testing)', () => {
  let service: BoardService;
  let mockApi: ReturnType<typeof buildMockApi>;

  beforeEach(() => {
    mockApi = buildMockApi();
    TestBed.configureTestingModule({
      providers: [
        BoardService,
        { provide: BoardApiService, useValue: mockApi },
      ],
    });
    // Injecting the service triggers the constructor, which calls loadBoards().
    // Because mockApi.getBoards returns of(mockBoards) (synchronous), the boards
    // signal is populated immediately by the time inject() returns.
    service = TestBed.inject(BoardService);
  });

  // ── Initialisation ───────────────────────────────────────────────────────────

  it('fetches boards from the API on construction', () => {
    expect(mockApi.getBoards).toHaveBeenCalledTimes(1);
    expect(service.boards()).toEqual(mockBoards);
  });

  it('loading() is false after a successful load', () => {
    expect(service.loading()).toBe(false);
  });

  it('error() is null after a successful load', () => {
    expect(service.error()).toBeNull();
  });

  // ── boardCount & activeBoard ──────────────────────────────────────────────────

  it('boardCount() returns the number of boards fetched', () => {
    expect(service.boardCount()).toBe(2);
  });

  it('setActiveBoard() updates activeBoardId()', () => {
    service.setActiveBoard('b1');
    expect(service.activeBoardId()).toBe('b1');
  });

  it('activeBoard() returns the board matching activeBoardId()', () => {
    service.setActiveBoard('b2');
    expect(service.activeBoard()?.name).toBe('Marketing Plan');
  });

  it('activeBoard() returns null when no board is active', () => {
    expect(service.activeBoard()).toBeNull();
  });

  it('getBoardById() returns the matching board', () => {
    expect(service.getBoardById('b1')?.name).toBe('Platform Launch');
  });

  it('getBoardById() returns undefined for an unknown id', () => {
    expect(service.getBoardById('unknown')).toBeUndefined();
  });

  // ── Board CRUD ────────────────────────────────────────────────────────────────

  it('createBoard() adds the new board to the boards signal immediately (optimistic)', () => {
    service.createBoard('New Board', [{ name: 'Backlog', color: '#49C4E5' }]);
    expect(service.boards().some(b => b.name === 'New Board')).toBe(true);
  });

  it('createBoard() calls api.createBoard() with the new board', () => {
    service.createBoard('Test', []);
    expect(mockApi.createBoard).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test' })
    );
  });

  it('createBoard() returns the new board object', () => {
    const board = service.createBoard('Returned', []);
    expect(board.name).toBe('Returned');
    expect(board.id).toBeTruthy();
  });

  it('createBoard() reverts the signal and sets error() when the API call fails', () => {
    const snapshot = service.boards();
    mockApi.createBoard.mockReturnValue(throwError(() => new Error('Server error')));
    service.createBoard('Bad Board', []);
    expect(service.boards()).toEqual(snapshot);
    expect(service.error()).toBe('Server error');
  });

  it('updateBoard() renames the board in the signal immediately', () => {
    service.updateBoard('b1', 'Renamed Board', [
      { id: 'c1', name: 'Todo', color: '#49C4E5' },
    ]);
    expect(service.boards().find(b => b.id === 'b1')?.name).toBe('Renamed Board');
  });

  it('updateBoard() calls api.updateBoard() with the updated board', () => {
    service.updateBoard('b2', 'Updated', []);
    expect(mockApi.updateBoard).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'b2', name: 'Updated' })
    );
  });

  it('deleteBoard() removes the board from the signal immediately', () => {
    service.deleteBoard('b2');
    expect(service.boards().find(b => b.id === 'b2')).toBeUndefined();
  });

  it('deleteBoard() updates activeBoardId to the first remaining board', () => {
    service.setActiveBoard('b1');
    service.deleteBoard('b1');
    expect(service.activeBoardId()).toBe('b2');
  });

  it('deleteBoard() sets activeBoardId to null when all boards are deleted', () => {
    service.setActiveBoard('b1');
    service.deleteBoard('b1');
    service.deleteBoard('b2');
    expect(service.activeBoardId()).toBeNull();
  });

  it('addColumn() appends a new column to the board signal immediately', () => {
    service.addColumn('b2', 'Review');
    const board = service.boards().find(b => b.id === 'b2');
    expect(board?.columns.some(c => c.name === 'Review')).toBe(true);
  });

  // ── Task CRUD ─────────────────────────────────────────────────────────────────

  it('createTask() adds the task to the correct column in the signal', () => {
    service.createTask('b1', {
      title: 'New Task', description: '', status: 'Todo', subtasks: [],
    });
    const board = service.boards().find(b => b.id === 'b1')!;
    const todoCol = board.columns.find(c => c.name === 'Todo')!;
    expect(todoCol.tasks.some(t => t.title === 'New Task')).toBe(true);
  });

  it('updateTask() moves the task when status changes', () => {
    const updated = { ...mockBoards[0].columns[0].tasks[0], status: 'Done' };
    service.updateTask('b1', updated, 'Todo');
    const board = service.boards().find(b => b.id === 'b1')!;
    const doneCol = board.columns.find(c => c.name === 'Done')!;
    expect(doneCol.tasks.some(t => t.id === 't1')).toBe(true);
  });

  it('deleteTask() removes the task from its column', () => {
    service.deleteTask('b1', 't1');
    const board = service.boards().find(b => b.id === 'b1')!;
    const allTasks = board.columns.flatMap(c => c.tasks);
    expect(allTasks.find(t => t.id === 't1')).toBeUndefined();
  });

  it('toggleSubtask() flips the isCompleted state of the target subtask', () => {
    service.toggleSubtask('b1', 't1', 's1');
    const board = service.boards().find(b => b.id === 'b1')!;
    const task = board.columns.flatMap(c => c.tasks).find(t => t.id === 't1')!;
    expect(task.subtasks[0].isCompleted).toBe(true);
  });

  it('moveTask() moves the task to the target column', () => {
    service.moveTask('b1', 't1', 'Done');
    const board = service.boards().find(b => b.id === 'b1')!;
    const doneCol = board.columns.find(c => c.name === 'Done')!;
    expect(doneCol.tasks.some(t => t.id === 't1')).toBe(true);
  });

  // ── Asynchronous testing (Task 6) ─────────────────────────────────────────────
  // Uses a Subject to control when the Observable emits, demonstrating
  // how to test async operations that don't complete immediately.

  it('loading() is true while boards are being fetched, false after completion', () => {
    // Use a Subject so we control exactly when the Observable emits
    const boards$ = new Subject<Board[]>();
    const slowApi = { ...buildMockApi(), getBoards: jest.fn().mockReturnValue(boards$) };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [BoardService, { provide: BoardApiService, useValue: slowApi }],
    });
    const svc = TestBed.inject(BoardService);

    // Before the subject emits, the service is still loading
    expect(svc.loading()).toBe(true);

    // Simulate the API responding with data
    boards$.next(mockBoards);
    boards$.complete();

    // Now loading should be false and boards should be populated
    expect(svc.loading()).toBe(false);
    expect(svc.boards()).toEqual(mockBoards);
  });

  it('loading() is false and error() is set when the API call fails', () => {
    const errorApi = {
      ...buildMockApi(),
      getBoards: jest.fn().mockReturnValue(throwError(() => new Error('Network error'))),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [BoardService, { provide: BoardApiService, useValue: errorApi }],
    });
    const svc = TestBed.inject(BoardService);

    expect(svc.loading()).toBe(false);
    expect(svc.error()).toBe('Network error');
  });
});
