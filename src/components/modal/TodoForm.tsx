import { useState } from 'react';
import type { TodoFormValues, Priority } from '../../types';
import { TagInput } from './TagInput';
import { Button } from '../ui/Button';

interface TodoFormProps {
  initialValues: TodoFormValues;
  onSubmit: (values: TodoFormValues) => void;
  onCancel: () => void;
  submitLabel: 'Create' | 'Save Changes';
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const priorityButtonClass = (selected: boolean, priority: Priority): string => {
  const base = 'flex-1 py-1.5 text-xs font-medium rounded-md border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-blue-500';
  if (!selected) {
    return `${base} border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500`;
  }
  const selectedColors: Record<Priority, string> = {
    low: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-400',
    medium: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-400',
    high: 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300 dark:border-red-400',
  };
  return `${base} ${selectedColors[priority]}`;
};

export function TodoForm({ initialValues, onSubmit, onCancel, submitLabel }: TodoFormProps) {
  const [values, setValues] = useState<TodoFormValues>(initialValues);
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setTitleError('Title is required');
      return;
    }
    onSubmit({ ...values, title: values.title.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          autoFocus
          value={values.title}
          onChange={(e) => {
            setValues((v) => ({ ...v, title: e.target.value }));
            if (e.target.value.trim()) setTitleError('');
          }}
          placeholder="What needs to be done?"
          maxLength={100}
          className={`px-3 py-2 rounded-lg border text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${titleError ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
        />
        {titleError && <p className="text-xs text-red-500">{titleError}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          placeholder="Add more details..."
          maxLength={500}
          rows={3}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none resize-none transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
          {values.description.length}/500
        </p>
      </div>

      {/* Priority */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Priority
        </label>
        <div className="flex gap-2">
          {PRIORITIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValues((v) => ({ ...v, priority: value }))}
              className={priorityButtonClass(values.priority === value, value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Tags
          <span className="ml-1 text-xs font-normal text-slate-400">(up to 10)</span>
        </label>
        <TagInput
          tags={values.tags}
          onChange={(tags) => setValues((v) => ({ ...v, tags }))}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
