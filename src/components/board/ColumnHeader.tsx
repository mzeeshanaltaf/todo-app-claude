import type { ColumnId } from '../../types';
import { COLUMN_ACCENT_BG } from '../../constants';

interface ColumnHeaderProps {
  title: string;
  columnId: ColumnId;
  count: number;
}

export function ColumnHeader({ title, columnId, count }: ColumnHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${COLUMN_ACCENT_BG[columnId]}`} />
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300">
        {count}
      </span>
    </div>
  );
}
