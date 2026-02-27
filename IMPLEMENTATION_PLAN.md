# Kanban ToDo App — Implementation Plan

## Context
Building a fresh Kanban-style ToDo application in an empty directory. The app needs a 3-column board (To Do, In Progress, Completed) with draggable cards, full CRUD for todo items (title, description, priority, tags), dark mode, and localStorage persistence. No backend required.

## Tech Stack
- **React + TypeScript + Vite** — component-based UI with type safety
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin) — utility-first styling with dark mode
- **@dnd-kit/core + @dnd-kit/sortable** — modern drag-and-drop (React 18 compatible, unlike `react-beautiful-dnd`)
- **uuid** — collision-resistant ID generation for todo items

## npm Packages to Install
```
npm create vite@latest . -- --template react-ts
npm install tailwindcss @tailwindcss/vite
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers
npm install uuid
npm install -D @types/uuid
```

## Folder Structure
```
src/
├── types/index.ts               # All TypeScript interfaces/types
├── constants/index.ts           # Column defs, priority config, storage keys
├── hooks/
│   ├── useBoard.ts              # Board reducer + localStorage sync
│   └── useDarkMode.ts           # Dark mode toggle + persistence
├── context/BoardContext.tsx     # React Context for board state + modal state
├── utils/
│   ├── localStorage.ts          # Typed read/write helpers
│   └── board.ts                 # Pure board manipulation functions
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # App title + dark mode toggle
│   │   └── BoardLayout.tsx      # 3-column responsive grid
│   ├── board/
│   │   ├── Board.tsx            # DndContext provider + drag orchestration
│   │   ├── Column.tsx           # Column with SortableContext
│   │   ├── ColumnHeader.tsx     # Column title + card count badge
│   │   └── DroppableZone.tsx    # Empty column drop target
│   ├── card/
│   │   ├── TodoCard.tsx         # Draggable card (useSortable)
│   │   ├── TodoCardOverlay.tsx  # DragOverlay ghost card
│   │   ├── PriorityBadge.tsx    # Colored priority chip
│   │   └── TagChip.tsx          # Individual tag chip
│   ├── modal/
│   │   ├── TodoModal.tsx        # Create/Edit modal wrapper
│   │   ├── TodoForm.tsx         # Controlled form component
│   │   └── TagInput.tsx         # Inline tag add/remove input
│   └── ui/
│       ├── Button.tsx           # Reusable button with variants
│       ├── Badge.tsx            # Reusable badge/chip
│       └── IconButton.tsx       # Icon-only buttons (edit, delete, close)
├── App.tsx
├── main.tsx
└── index.css                    # Tailwind @import + dark mode custom variant
```

## Key TypeScript Types (`src/types/index.ts`)
```typescript
type Priority = 'low' | 'medium' | 'high';
type ColumnId = 'todo' | 'in-progress' | 'completed';
type Theme = 'light' | 'dark';
type ModalMode = 'create' | 'edit' | null;

interface TodoItem {
  id: string;          // UUID v4
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  columnId: ColumnId;
  createdAt: number;   // Date.now()
  updatedAt: number;
}

interface Column {
  id: ColumnId;
  title: string;
  itemIds: string[];   // Ordered list of item IDs
}

interface BoardState {
  items: Record<string, TodoItem>;    // ID -> item lookup map
  columns: Record<ColumnId, Column>;
  columnOrder: ColumnId[];
}

type BoardAction =
  | { type: 'ADD_ITEM'; payload: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_ITEM'; payload: { id: string } & Partial<Omit<TodoItem, 'id' | 'createdAt'>> }
  | { type: 'DELETE_ITEM'; payload: { id: string } }
  | { type: 'MOVE_ITEM'; payload: { itemId: string; fromColumn: ColumnId; toColumn: ColumnId; newIndex: number } }
  | { type: 'REORDER_ITEM'; payload: { columnId: ColumnId; oldIndex: number; newIndex: number } }
  | { type: 'LOAD_BOARD'; payload: BoardState };
```

## localStorage Schema
- **Key `kanban_board_v1`**: Full `BoardState` JSON object
- **Key `kanban_theme_v1`**: `"light"` or `"dark"` string

## Dark Mode Implementation
- Tailwind v4 requires `@custom-variant dark (&:where(.dark, .dark *));` in `src/index.css`
- `useDarkMode` hook toggles `dark` class on `document.documentElement`
- Persists to localStorage on change

## Drag & Drop Strategy (Board.tsx)
- `PointerSensor` with `activationConstraint: { distance: 5 }` to prevent accidental drags on card click
- `KeyboardSensor` for accessibility
- `onDragOver`: dispatch `MOVE_ITEM` for cross-column moves (live preview)
- `onDragEnd`: dispatch `REORDER_ITEM` for same-column reorders; reset `activeId`
- `onDragCancel`: reset `activeId` (state already consistent from `onDragOver`)
- `<DragOverlay>` renders `<TodoCardOverlay>` with `rotate-2 shadow-2xl scale-105` for "lifted" feel
- `<DroppableZone>` via `useDroppable` handles drops onto empty columns

## Tag Input UX (TagInput.tsx)
- Inline `<input>` with placeholder "Add tag, press Enter"
- Enter or comma key: trim value, deduplicate, add to tags array, clear input
- Each tag renders as a removable chip inline
- Limit: 10 tags, 20 chars each

## Priority Config (constants/index.ts)
```typescript
const PRIORITY_CONFIG = {
  low:    { label: 'Low',    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  medium: { label: 'Medium', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  high:   { label: 'High',   classes: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
}
```

## Column Accent Colors
- To Do: `border-t-slate-400`
- In Progress: `border-t-blue-500`
- Completed: `border-t-emerald-500`

## Scaffolding Order
1. Bootstrap Vite project + install packages
2. Configure `vite.config.ts` (Tailwind plugin) + `src/index.css` (dark variant)
3. `src/types/index.ts` → `src/constants/index.ts`
4. `src/utils/localStorage.ts` → `src/utils/board.ts`
5. `src/hooks/useDarkMode.ts` → `src/hooks/useBoard.ts`
6. `src/context/BoardContext.tsx`
7. UI primitives: `Button`, `Badge`, `IconButton`
8. Card components: `PriorityBadge`, `TagChip`, `TodoCard`, `TodoCardOverlay`
9. Modal components: `TagInput`, `TodoForm`, `TodoModal`
10. Board components: `DroppableZone`, `ColumnHeader`, `Column`, `Board`
11. Layout: `Header`, `BoardLayout`
12. Wire `App.tsx` + update `index.html` title

## Critical Files
- `src/types/index.ts` — must exist before any other file
- `src/hooks/useBoard.ts` — core state machine, all transitions
- `src/components/board/Board.tsx` — DnD orchestration (most complex component)
- `src/index.css` — MUST contain `@custom-variant dark` or dark mode silently breaks

## Verification
1. Run `npm run dev` — app opens at localhost:5173
2. Create a todo item in each column — verify localStorage `kanban_board_v1` updates
3. Drag a card between columns — verify live preview and final state
4. Drag a card within a column — verify reorder
5. Edit an existing card — verify changes persist after page refresh
6. Delete a card — verify removed from state and localStorage
7. Toggle dark mode — verify all components switch theme, persists on refresh
8. Drop a card onto an empty column — verify it lands correctly
9. Add multiple tags, remove individual tags — verify TagInput behavior
