import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TodoItem } from '../../types';
import { PriorityBadge } from './PriorityBadge';
import { TagChip } from './TagChip';
import { IconButton } from '../ui/IconButton';
import { useBoardContext } from '../../context/BoardContext';

interface TodoCardProps {
  item: TodoItem;
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function TodoCard({ item }: TodoCardProps) {
  const { dispatch, openEditModal } = useBoardContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_ITEM', payload: { id: item.id } });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(item);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-600 cursor-grab active:cursor-grabbing transition-shadow duration-150 hover:shadow-md ${isDragging ? 'opacity-40' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Header: title + action buttons */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 flex-1">
          {item.title}
        </h3>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
          <IconButton label="Edit task" onClick={handleEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label="Delete task" variant="danger" onClick={handleDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Footer: priority + tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={item.priority} />
        {item.tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
