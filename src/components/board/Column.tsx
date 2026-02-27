import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType, TodoItem } from '../../types';
import { COLUMN_ACCENT } from '../../constants';
import { ColumnHeader } from './ColumnHeader';
import { DroppableZone } from './DroppableZone';
import { TodoCard } from '../card/TodoCard';
import { useBoardContext } from '../../context/BoardContext';

interface ColumnProps {
  column: ColumnType;
  items: TodoItem[];
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function Column({ column, items }: ColumnProps) {
  const { openCreateModal } = useBoardContext();

  return (
    <div
      className={`flex flex-col w-80 min-w-72 bg-slate-100 dark:bg-slate-800 rounded-xl border-t-4 ${COLUMN_ACCENT[column.id]} shadow-sm`}
    >
      {/* Column inner padding */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <ColumnHeader title={column.title} columnId={column.id} count={items.length} />

        {/* Cards list */}
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 flex-1">
            {items.length === 0 ? (
              <DroppableZone columnId={column.id} />
            ) : (
              items.map((item) => <TodoCard key={item.id} item={item} />)
            )}
          </div>
        </SortableContext>

        {/* Add card button */}
        <button
          onClick={() => openCreateModal(column.id)}
          className="flex items-center gap-1.5 w-full px-2 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-150 mt-1"
        >
          <PlusIcon />
          Add task
        </button>
      </div>
    </div>
  );
}
