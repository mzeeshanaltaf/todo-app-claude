import { useDroppable } from '@dnd-kit/core';
import type { ColumnId } from '../../types';

interface DroppableZoneProps {
  columnId: ColumnId;
}

export function DroppableZone({ columnId }: DroppableZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `droppable-${columnId}` });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[80px] rounded-lg border-2 border-dashed transition-colors duration-150 ${
        isOver
          ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
          : 'border-slate-200 dark:border-slate-600'
      }`}
    />
  );
}
