import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { BoardState, BoardAction, ModalState, ModalMode, TodoItem, ColumnId } from '../types';

interface BoardContextValue {
  state: BoardState;
  dispatch: Dispatch<BoardAction>;
  modalState: ModalState;
  openCreateModal: (columnId: ColumnId) => void;
  openEditModal: (item: TodoItem) => void;
  closeModal: () => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);

const INITIAL_MODAL: ModalState = {
  mode: null,
  targetColumnId: null,
  editingItem: null,
};

interface BoardProviderProps {
  children: ReactNode;
  state: BoardState;
  dispatch: Dispatch<BoardAction>;
}

export function BoardProvider({ children, state, dispatch }: BoardProviderProps) {
  const [modalState, setModalState] = useState<ModalState>(INITIAL_MODAL);

  const openCreateModal = (columnId: ColumnId) => {
    setModalState({ mode: 'create' as ModalMode, targetColumnId: columnId, editingItem: null });
  };

  const openEditModal = (item: TodoItem) => {
    setModalState({ mode: 'edit' as ModalMode, targetColumnId: null, editingItem: item });
  };

  const closeModal = () => {
    setModalState(INITIAL_MODAL);
  };

  return (
    <BoardContext.Provider value={{ state, dispatch, modalState, openCreateModal, openEditModal, closeModal }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardContext(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoardContext must be used within BoardProvider');
  return ctx;
}
