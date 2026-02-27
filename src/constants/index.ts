import type { BoardState, ColumnId } from '../types';

export const STORAGE_KEYS = {
  BOARD: 'kanban_board_v1',
  THEME: 'kanban_theme_v1',
} as const;

export const COLUMN_ORDER: ColumnId[] = ['todo', 'in-progress', 'completed'];

export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  high: {
    label: 'High',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  },
} as const;

export const COLUMN_ACCENT: Record<ColumnId, string> = {
  'todo': 'border-t-slate-400',
  'in-progress': 'border-t-blue-500',
  'completed': 'border-t-emerald-500',
};

export const COLUMN_ACCENT_BG: Record<ColumnId, string> = {
  'todo': 'bg-slate-400',
  'in-progress': 'bg-blue-500',
  'completed': 'bg-emerald-500',
};

export const INITIAL_BOARD_STATE: BoardState = {
  items: {},
  columns: {
    'todo': { id: 'todo', title: 'To Do', itemIds: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', itemIds: [] },
    'completed': { id: 'completed', title: 'Completed', itemIds: [] },
  },
  columnOrder: COLUMN_ORDER,
};
