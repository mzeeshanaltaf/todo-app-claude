# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type-check (tsc -b) then Vite production build
npm run lint       # Run ESLint across all .ts/.tsx files
npm run preview    # Serve the production build locally
```

There are no tests configured. TypeScript type-checking acts as the primary correctness gate — run `npx tsc --noEmit` for a fast check without emitting files.

## Architecture

State is managed entirely client-side with `useReducer` + React Context. There is no backend or external API.

### Data flow

```
useBoard (reducer + localStorage sync)
    └── BoardProvider (context)
            ├── Board (DndContext orchestration)
            │     └── Column × 3 → TodoCard (useSortable)
            └── TodoModal (create / edit form)
```

**`src/hooks/useBoard.ts`** — the core state machine. All mutations (add, update, delete, move, reorder) go through the `boardReducer`. State is persisted to `localStorage` on every change via a `useEffect`.

**`src/context/BoardContext.tsx`** — single context that exposes board `state`, `dispatch`, modal state, and modal open/close helpers. Consumed via `useBoardContext()` throughout the tree — no prop drilling.

**`src/components/board/Board.tsx`** — owns the `DndContext`. Cross-column moves are handled optimistically in `onDragOver` (dispatches `MOVE_ITEM` for a live preview); same-column reorders are finalized in `onDragEnd` (dispatches `REORDER_ITEM`).

### Board state shape

```typescript
{
  items: Record<string, TodoItem>,   // flat map for O(1) lookup
  columns: Record<ColumnId, Column>, // each column holds ordered itemIds[]
  columnOrder: ColumnId[]            // ['todo', 'in-progress', 'completed']
}
```

Columns are fixed: `'todo'`, `'in-progress'`, `'completed'`. Column definitions and display config (accent colors, priority badge colors) live in `src/constants/index.ts`.

### Tailwind v4 dark mode

Dark mode uses a `.dark` class on `<html>` (toggled by `useDarkMode`). This requires the custom variant declaration in `src/index.css`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Without this line, all `dark:` utility classes silently produce no output.

### localStorage keys

| Key | Contents |
|---|---|
| `kanban_board_v1` | Full `BoardState` JSON |
| `kanban_theme_v1` | `"light"` or `"dark"` |
