import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import type { ColumnId } from '../../types';
import { useBoardContext } from '../../context/BoardContext';
import { findItemColumn, getColumnItems } from '../../utils/board';
import { Column } from './Column';
import { TodoCardOverlay } from '../card/TodoCardOverlay';
import { TodoModal } from '../modal/TodoModal';

export function Board() {
  const { state, dispatch } = useBoardContext();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  }, []);

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      if (!over) return;
      const activeItemId = active.id as string;
      const overId = over.id as string;

      const activeColumn = findItemColumn(state, activeItemId);
      if (!activeColumn) return;

      // Determine the target column
      let targetColumn: ColumnId | null = null;

      // Check if hovering over a droppable zone (empty column)
      if (overId.startsWith('droppable-')) {
        targetColumn = overId.replace('droppable-', '') as ColumnId;
      }
      // Check if hovering over another card
      else if (state.items[overId]) {
        targetColumn = findItemColumn(state, overId);
      }
      // Check if hovering over a column id directly
      else if (state.columns[overId as ColumnId]) {
        targetColumn = overId as ColumnId;
      }

      if (!targetColumn || targetColumn === activeColumn) return;

      // Find the index to insert at (before the over item if in the same column)
      const targetColItems = state.columns[targetColumn].itemIds;
      const overIndex = targetColItems.indexOf(overId);
      const newIndex = overIndex >= 0 ? overIndex : targetColItems.length;

      dispatch({
        type: 'MOVE_ITEM',
        payload: {
          itemId: activeItemId,
          fromColumn: activeColumn,
          toColumn: targetColumn,
          newIndex,
        },
      });
    },
    [state, dispatch]
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveId(null);
      if (!over) return;

      const activeItemId = active.id as string;
      const overId = over.id as string;

      // Skip if dropped on empty zone or already handled by onDragOver
      if (overId.startsWith('droppable-')) return;

      const activeColumn = findItemColumn(state, activeItemId);
      if (!activeColumn) return;

      // Same-column reorder
      if (state.items[overId]) {
        const overColumn = findItemColumn(state, overId);
        if (overColumn === activeColumn) {
          const colItems = state.columns[activeColumn].itemIds;
          const oldIndex = colItems.indexOf(activeItemId);
          const newIndex = colItems.indexOf(overId);
          if (oldIndex !== newIndex) {
            dispatch({ type: 'REORDER_ITEM', payload: { columnId: activeColumn, oldIndex, newIndex } });
          }
        }
      }
    },
    [state, dispatch]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeItem = activeId ? state.items[activeId] : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-5 items-start overflow-x-auto pb-4">
          {state.columnOrder.map((colId) => {
            const column = state.columns[colId];
            const items = getColumnItems(state, colId);
            return <Column key={colId} column={column} items={items} />;
          })}
        </div>

        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {activeItem ? <TodoCardOverlay item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      <TodoModal />
    </>
  );
}
