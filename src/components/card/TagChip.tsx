interface TagChipProps {
  tag: string;
}

export function TagChip({ tag }: TagChipProps) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300">
      #{tag}
    </span>
  );
}
