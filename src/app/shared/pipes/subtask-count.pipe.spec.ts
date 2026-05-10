import { SubtaskCountPipe } from './subtask-count.pipe';
import { Task } from '../../core/models/board.models';

// Helper to build a minimal Task with the given subtask completion states
function makeTask(completed: boolean[]): Task {
  return {
    id: 't1',
    title: 'Test',
    description: '',
    status: 'Todo',
    subtasks: completed.map((isCompleted, i) => ({
      id: `s${i}`,
      title: `Subtask ${i}`,
      isCompleted,
    })),
  };
}

describe('SubtaskCountPipe (Task 5 — Pipe Testing)', () => {
  // The pipe has no Angular dependencies — instantiate it directly
  const pipe = new SubtaskCountPipe();

  it('returns "0 of 0 subtasks" for a task with no subtasks', () => {
    expect(pipe.transform(makeTask([]))).toBe('0 of 0 subtasks');
  });

  it('returns "1 of 1 subtask" (singular) when the only subtask is completed', () => {
    expect(pipe.transform(makeTask([true]))).toBe('1 of 1 subtask');
  });

  it('returns "0 of 1 subtask" (singular) when the only subtask is not completed', () => {
    expect(pipe.transform(makeTask([false]))).toBe('0 of 1 subtask');
  });

  it('returns "0 of 3 subtasks" when none of the subtasks are completed', () => {
    expect(pipe.transform(makeTask([false, false, false]))).toBe('0 of 3 subtasks');
  });

  it('returns "2 of 5 subtasks" when 2 of 5 are completed', () => {
    expect(pipe.transform(makeTask([true, false, true, false, false]))).toBe('2 of 5 subtasks');
  });

  it('returns "3 of 3 subtasks" when all are completed', () => {
    expect(pipe.transform(makeTask([true, true, true]))).toBe('3 of 3 subtasks');
  });
});
