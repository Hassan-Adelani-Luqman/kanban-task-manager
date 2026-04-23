export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
}

export interface Column {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

export function generateId(): string {
  return crypto.randomUUID();
}

/** Ordered list of dot colors cycled when adding new columns */
export const COLUMN_COLORS = [
  '#49C4E5',
  '#8471F2',
  '#67E2AE',
  '#F4B400',
  '#EA5555',
];
