# ToDone — Drag. Drop. Done.

A Kanban-style task management app built with React, TypeScript, and Tailwind CSS. Organize your work across three columns, drag cards between stages, and stay productive — all without a backend.

---

## Features

- **Kanban Board** — Three fixed columns: To Do, In Progress, and Completed
- **Drag & Drop** — Drag cards between columns or reorder within a column; live preview as you drag
- **Task Details** — Each card holds a title, description, priority level, and tags
- **Priority Levels** — Low (blue), Medium (amber), High (red) — color-coded badges
- **Tags** — Inline tag editor; type a tag and press Enter or comma to add, click × to remove
- **Create & Edit** — Modal form with full validation; opens per-column or from any card
- **Delete** — Remove cards with a hover-reveal trash button
- **Dark Mode** — Toggle between light and dark themes from the header
- **Persistence** — All data saved to `localStorage`; survives page refreshes and browser restarts

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| ID Generation | uuid v4 |
| State | useReducer + React Context |
| Persistence | Browser localStorage |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The dev server runs at **http://localhost:5173** by default.

---

## Project Structure

```
src/
├── types/index.ts               # All TypeScript interfaces and types
├── constants/index.ts           # Column definitions, priority config, storage keys
├── hooks/
│   ├── useBoard.ts              # Board state reducer + localStorage sync
│   └── useDarkMode.ts           # Dark mode toggle + persistence
├── context/
│   └── BoardContext.tsx         # React Context for board state and modal state
├── utils/
│   ├── localStorage.ts          # Typed loadFromStorage / saveToStorage helpers
│   └── board.ts                 # Pure board manipulation functions
├── components/
│   ├── layout/
│   │   └── Header.tsx           # App header with title, tagline, and theme toggle
│   ├── board/
│   │   ├── Board.tsx            # DndContext setup and drag event orchestration
│   │   ├── Column.tsx           # Kanban column with SortableContext
│   │   ├── ColumnHeader.tsx     # Column title and card count badge
│   │   └── DroppableZone.tsx    # Drop target for empty columns
│   ├── card/
│   │   ├── TodoCard.tsx         # Draggable card (useSortable)
│   │   ├── TodoCardOverlay.tsx  # Ghost card shown during drag
│   │   ├── PriorityBadge.tsx    # Color-coded priority chip
│   │   └── TagChip.tsx          # Individual tag display chip
│   ├── modal/
│   │   ├── TodoModal.tsx        # Create / Edit modal wrapper
│   │   ├── TodoForm.tsx         # Controlled form (title, desc, priority, tags)
│   │   └── TagInput.tsx         # Inline tag add/remove input
│   └── ui/
│       ├── Button.tsx           # Reusable button with variants
│       └── IconButton.tsx       # Icon-only button (edit, delete, close)
├── App.tsx
├── main.tsx
└── index.css                    # Tailwind import + dark mode custom variant
```

---

## Data Model

```typescript
type Priority = 'low' | 'medium' | 'high';
type ColumnId = 'todo' | 'in-progress' | 'completed';

interface TodoItem {
  id: string;          // UUID v4
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  columnId: ColumnId;
  createdAt: number;   // Date.now() timestamp
  updatedAt: number;
}
```

Board state is stored as a flat item map (`Record<string, TodoItem>`) alongside each column's ordered `itemIds` array — giving O(1) lookups while preserving display order.

---

## localStorage Schema

| Key | Value |
|---|---|
| `kanban_board_v1` | Full board state as JSON |
| `kanban_theme_v1` | `"light"` or `"dark"` |

---

## Keyboard & Interaction

| Action | How |
|---|---|
| Add a task | Click **+ Add task** at the bottom of any column |
| Edit a task | Hover a card → click the pencil icon |
| Delete a task | Hover a card → click the trash icon |
| Move a task | Drag the card to another column or position |
| Add a tag | Type in the tag field, press **Enter** or **,** |
| Remove a tag | Click **×** on the tag chip |
| Close modal | Press **Escape** or click the backdrop |
| Toggle theme | Click the sun / moon icon in the header |

---

## Implementation Plan

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for the full architectural design, component breakdown, drag-and-drop strategy, and scaffolding order used to build this app.
