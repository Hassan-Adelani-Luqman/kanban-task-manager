import { TestBed, NO_ERRORS_SCHEMA } from '@angular/core/testing';
import { Column } from './column';
import { Column as ColumnModel } from '../../../core/models/board.models';

const sampleColumn: ColumnModel = {
  id: 'c1',
  name: 'In Progress',
  color: '#8471F2',
  tasks: [
    { id: 't1', title: 'Task Alpha', description: '', status: 'In Progress', subtasks: [] },
    { id: 't2', title: 'Task Beta', description: '', status: 'In Progress', subtasks: [] },
  ],
};

describe('Column (Task 2 — Component Testing Fundamentals)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Column],
      // NO_ERRORS_SCHEMA suppresses unknown child element errors (app-task-card)
      // so we can test Column in isolation without its child component dependencies
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('renders the column name in the header', () => {
    const fixture = TestBed.createComponent(Column);
    fixture.componentRef.setInput('col', sampleColumn);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    // CSS `uppercase` is visual only — DOM textContent contains the original casing
    expect(el.querySelector('h2')?.textContent).toContain('In Progress');
  });

  it('renders the task count in the header', () => {
    const fixture = TestBed.createComponent(Column);
    fixture.componentRef.setInput('col', sampleColumn);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('(2)');
  });

  it('renders one app-task-card element per task in the column', () => {
    const fixture = TestBed.createComponent(Column);
    fixture.componentRef.setInput('col', sampleColumn);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('app-task-card');
    expect(cards.length).toBe(2);
  });

  it('renders zero task cards for a column with no tasks', () => {
    const emptyColumn: ColumnModel = { ...sampleColumn, tasks: [] };
    const fixture = TestBed.createComponent(Column);
    fixture.componentRef.setInput('col', emptyColumn);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-task-card').length).toBe(0);
  });
});
