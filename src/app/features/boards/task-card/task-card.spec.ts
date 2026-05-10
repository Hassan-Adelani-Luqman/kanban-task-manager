import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TaskCard } from './task-card';
import { ModalService } from '../../../core/services/modal.service';
import { BoardService } from '../../../core/services/board.service';
import { Task } from '../../../core/models/board.models';

const sampleTask: Task = {
  id: 't1',
  title: 'Write unit tests',
  description: 'Cover all services and components',
  status: 'Todo',
  subtasks: [
    { id: 's1', title: 'Set up Jest', isCompleted: true },
    { id: 's2', title: 'Write specs', isCompleted: false },
  ],
};

describe('TaskCard (Task 2 — Component Testing Fundamentals)', () => {
  let openSpy: jest.SpyInstance;

  beforeEach(async () => {
    const mockModalService = { open: jest.fn() };
    const mockBoardService = { activeBoardId: jest.fn().mockReturnValue('b1') };

    await TestBed.configureTestingModule({
      imports: [TaskCard],
      providers: [
        { provide: ModalService, useValue: mockModalService },
        { provide: BoardService, useValue: mockBoardService },
      ],
    }).compileComponents();

    openSpy = jest.spyOn(TestBed.inject(ModalService), 'open');
  });

  it('renders the task title in the template', () => {
    const fixture = TestBed.createComponent(TaskCard);
    fixture.componentRef.setInput('task', sampleTask);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.textContent).toContain('Write unit tests');
  });

  it('renders the subtask count via SubtaskCountPipe', () => {
    const fixture = TestBed.createComponent(TaskCard);
    fixture.componentRef.setInput('task', sampleTask);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    // 1 of 2 subtasks completed
    expect(el.querySelector('p')?.textContent).toContain('1 of 2 subtasks');
  });

  it('calls ModalService.open("view-task", ...) when the card is clicked', () => {
    const fixture = TestBed.createComponent(TaskCard);
    fixture.componentRef.setInput('task', sampleTask);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('div[role="button"]') as HTMLElement)?.click();
    expect(openSpy).toHaveBeenCalledWith('view-task', expect.objectContaining({ task: sampleTask }));
  });
});
