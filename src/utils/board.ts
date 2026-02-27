import type { BoardState, ColumnId, TodoItem } from '../types';

export function removeItemFromColumn(state: BoardState, itemId: string, columnId: ColumnId): BoardState {
  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: {
        ...state.columns[columnId],
        itemIds: state.columns[columnId].itemIds.filter((id) => id !== itemId),
      },
    },
  };
}

export function addItemToColumn(
  state: BoardState,
  itemId: string,
  columnId: ColumnId,
  index?: number
): BoardState {
  const column = state.columns[columnId];
  const newItemIds = [...column.itemIds];
  if (index !== undefined && index >= 0 && index <= newItemIds.length) {
    newItemIds.splice(index, 0, itemId);
  } else {
    newItemIds.push(itemId);
  }
  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: {
        ...column,
        itemIds: newItemIds,
      },
    },
  };
}

export function findItemColumn(state: BoardState, itemId: string): ColumnId | null {
  for (const colId of state.columnOrder) {
    if (state.columns[colId].itemIds.includes(itemId)) {
      return colId;
    }
  }
  return null;
}

export function getColumnItems(state: BoardState, columnId: ColumnId): TodoItem[] {
  return state.columns[columnId].itemIds
    .map((id) => state.items[id])
    .filter(Boolean);
}
