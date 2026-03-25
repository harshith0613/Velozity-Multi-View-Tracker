**Multi-View Project Tracker**
A client-side project management dashboard built with React, TypeScript, and Vite. Handles 500+ tasks across three distinct views — Kanban, List, and Timeline — with custom drag-and-drop, virtual scrolling, live filtering, and a collaboration simulation layer.

**Setup**
**1. Install dependencies**
bashnpm install
**2. Start the dev server**
bashnpm run dev
**3. Type-check / build check**
bashnpm run build

**Why Zustand Over Context API**
Managing 500+ tasks efficiently ruled out a naive Context API + useReducer approach early on. Zustand was the right call for a few specific reasons:

No provider nesting — the store lives outside the React tree entirely, so there's no wrapping hell to maintain
Granular selectors — components subscribe to exactly the slice they need (e.g. useTaskStore(s => s.tasks)), which cuts down unnecessary re-renders dramatically — especially important when 500+ rows are updating or cards are being dragged
Less boilerplate — no actions, dispatchers, or reducers to wire up; the store stays lean and predictable


**Virtual Scrolling (List View)**
Rendering 500+ DOM nodes at once would cause serious performance issues — layout thrashing, sluggish scrolling, the works. The fix was a custom <VirtualScroller> built directly inside ListView.tsx.
**How it works:**

Tracks scrollTop and maps it against a fixed ROW_HEIGHT of 52px to figure out which rows are currently in view
Only renders that visible slice, plus an overscan buffer of ±8 rows on either side
A wrapper div with a calculated totalHeight holds the full scroll height, so the native scrollbar behaves exactly as expected without rendering every row


**Drag-and-Drop**
Rather than pulling in react-beautiful-dnd or dnd-kit, a lightweight custom hook (useDragAndDrop) handles everything using the native Pointer Events API (pointerdown, pointermove, pointerup). This makes it work on both mouse and touch devices without any extra configuration.
**Key details:**

Drop zones are detected dynamically via document.elementFromPoint reading data-column attributes — no hardcoded coordinates
A floating ghost clone follows the pointer while dragging, giving instant visual feedback with zero React re-renders mid-drag
The original card stays in the DOM at opacity: 0 during a drag, so its layout footprint is preserved and sibling cards don't jump around
The target column inserts a matching-height placeholder when a card hovers over it, making the drop feel smooth and predictable

