import { useEffect } from 'react';
import type { TodoFormValues } from '../../types';
import { useBoardContext } from '../../context/BoardContext';
import { TodoForm } from './TodoForm';
import { IconButton } from '../ui/IconButton';

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function TodoModal() {
  const { modalState, closeModal, dispatch } = useBoardContext();
  const { mode, targetColumnId, editingItem } = modalState;

  useEffect(() => {
    if (!mode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, closeModal]);

  if (!mode) return null;

  const isEdit = mode === 'edit';

  const initialValues: TodoFormValues = isEdit && editingItem
    ? {
        title: editingItem.title,
        description: editingItem.description,
        priority: editingItem.priority,
        tags: [...editingItem.tags],
      }
    : { title: '', description: '', priority: 'medium', tags: [] };

  const handleSubmit = (values: TodoFormValues) => {
    if (isEdit && editingItem) {
      dispatch({ type: 'UPDATE_ITEM', payload: { id: editingItem.id, ...values } });
    } else if (targetColumnId) {
      dispatch({ type: 'ADD_ITEM', payload: { ...values, columnId: targetColumnId } });
    }
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit task' : 'Create task'}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <IconButton label="Close modal" onClick={closeModal}>
            <XIcon />
          </IconButton>
        </div>

        {/* Modal body */}
        <div className="px-5 py-4">
          <TodoForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitLabel={isEdit ? 'Save Changes' : 'Create'}
          />
        </div>
      </div>
    </div>
  );
}
