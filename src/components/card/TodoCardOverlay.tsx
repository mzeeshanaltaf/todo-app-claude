import type { TodoItem } from '../../types';
import { PriorityBadge } from './PriorityBadge';
import { TagChip } from './TagChip';

interface TodoCardOverlayProps {
  item: TodoItem;
}

export function TodoCardOverlay({ item }: TodoCardOverlayProps) {
  return (
    <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-2xl border border-slate-200 dark:border-slate-600 rotate-2 scale-105 cursor-grabbing">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
          {item.title}
        </h3>
      </div>

      {item.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={item.priority} />
        {item.tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
