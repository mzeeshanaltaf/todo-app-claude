import { useReducer, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import type { BoardState, BoardAction } from '../types';
import { INITIAL_BOARD_STATE, STORAGE_KEYS } from '../constants';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { removeItemFromColumn, addItemToColumn } from '../utils/board';

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const id = uuid();
      const now = Date.now();
      const newItem = { ...action.payload, id, createdAt: now, updatedAt: now };
      const col = state.columns[action.payload.columnId];
      return {
        ...state,
        items: { ...state.items, [id]: newItem },
        columns: {
          ...state.columns,
          [action.payload.columnId]: {
            ...col,
            itemIds: [...col.itemIds, id],
          },
        },
      };
    }

    case 'UPDATE_ITEM': {
      const { id, ...updates } = action.payload;
      const existing = state.items[id];
      if (!existing) return state;

      const updatedItem = { ...existing, ...updates, updatedAt: Date.now() };
      let newState: BoardState = {
        ...state,
        items: { ...state.items, [id]: updatedItem },
      };

      // If column changed, move across columns
      if (updates.columnId && updates.columnId !== existing.columnId) {
        newState = removeItemFromColumn(newState, id, existing.columnId);
        newState = addItemToColumn(newState, id, updates.columnId);
      }

      return newState;
    }

    case 'DELETE_ITEM': {
      const { id } = action.payload;
      const item = state.items[id];
      if (!item) return state;

      const newItems = { ...state.items };
      delete newItems[id];

      let newState = { ...state, items: newItems };
      newState = removeItemFromColumn(newState, id, item.columnId);
      return newState;
    }

    case 'MOVE_ITEM': {
      const { itemId, fromColumn, toColumn, newIndex } = action.payload;
      let newState = removeItemFromColumn(state, itemId, fromColumn);
      newState = addItemToColumn(newState, itemId, toColumn, newIndex);
      newState = {
        ...newState,
        items: {
          ...newState.items,
          [itemId]: { ...newState.items[itemId], columnId: toColumn, updatedAt: Date.now() },
        },
      };
      return newState;
    }

    case 'REORDER_ITEM': {
      const { columnId, oldIndex, newIndex } = action.payload;
      const col = state.columns[columnId];
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...col,
            itemIds: arrayMove(col.itemIds, oldIndex, newIndex),
          },
        },
      };
    }

    default:
      return state;
  }
}

export function useBoard() {
  const [state, dispatch] = useReducer(
    boardReducer,
    undefined,
    () => loadFromStorage<BoardState>(STORAGE_KEYS.BOARD, INITIAL_BOARD_STATE)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BOARD, state);
  }, [state]);

  return { state, dispatch };
}
