export type Priority = 'low' | 'medium' | 'high';

export type ColumnId = 'todo' | 'in-progress' | 'completed';

export type Theme = 'light' | 'dark';

export type ModalMode = 'create' | 'edit' | null;

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  columnId: ColumnId;
  createdAt: number;
  updatedAt: number;
}

export interface Column {
  id: ColumnId;
  title: string;
  itemIds: string[];
}

export interface BoardState {
  items: Record<string, TodoItem>;
  columns: Record<ColumnId, Column>;
  columnOrder: ColumnId[];
}

export type BoardAction =
  | { type: 'ADD_ITEM'; payload: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_ITEM'; payload: { id: string } & Partial<Omit<TodoItem, 'id' | 'createdAt'>> }
  | { type: 'DELETE_ITEM'; payload: { id: string } }
  | { type: 'MOVE_ITEM'; payload: { itemId: string; fromColumn: ColumnId; toColumn: ColumnId; newIndex: number } }
  | { type: 'REORDER_ITEM'; payload: { columnId: ColumnId; oldIndex: number; newIndex: number } };

export interface ModalState {
  mode: ModalMode;
  targetColumnId: ColumnId | null;
  editingItem: TodoItem | null;
}

export interface TodoFormValues {
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
}
