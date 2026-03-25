# Multi-View Project Tracker UI

A robust, client-side project management dashboard built with React, TypeScript, and Vite. This application provides three distinct views (Kanban, List, and Timeline) to visualize and manage 500+ tasks, complete with custom drag-and-drop, virtual scrolling, live filtering, and collaboration simulation.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Type-check / build check:
   ```bash
   npm run build
   ```

## State Management Decision Justification

A fundamental requirement was to manage a large dataset (500+ tasks) efficiently. Over Context API + `useReducer`, **Zustand** was selected for root state management because:
- **No Provider Wrapper Hell:** Zustand creates a global store outside the React tree, avoiding deeply nested providers.
- **Granular Selectors:** By using atomic selectors (e.g., `useTaskStore(s => s.tasks)`), components only subscribe to the slices of state they actually need. This prevents unnecessary re-renders across the dashboard—vital for performance when simulating 500+ rows or rapid drag-and-drop interactions.
- **Simpler Boilerplate:** It avoids the verbose actions, dispatchers, and reducers pattern while remaining highly predictable.

## Explanation of Virtual Scrolling Implementation

Rendering 500+ DOM nodes concurrently in the List View would severely degrade scrolling performance and cause layout thrashing.
- A custom `<VirtualScroller>` implementation was built inside `ListView.tsx`.
- It calculates the `scrollTop` offset against predefined row heights (`ROW_HEIGHT = 52px`) to only render the exact chunk of rows currently visible inside the viewport, plus a small overscan buffer (±8 rows).
- Empty space above and below the visible chunk is preserved using a single wrapper `div` with a calculated `totalHeight` taking the length of filtered tasks into account. This preserves native scrollbar behavior effortlessly.

## Explanation of Drag-and-Drop Approach

Instead of leveraging heavy libraries like `react-beautiful-dnd` or `dnd-kit`, a fully custom, lightweight drag-and-drop engine (`useDragAndDrop`) was built:
- Relies on pure **Pointer Events** (`pointerdown`, `pointermove`, `pointerup`), making it natively compatible with both mouse and touch devices.
- Uses absolute-positioned floating clones (ghosts) and `document.elementFromPoint` to detect drop zones dynamically based on `data-column` attributes.
- Provides immediate visual feedback without triggering expensive React re-renders mid-drag.



## Explanation

**Hardest UI problem solved:** Building the custom virtual scrolling engine for the List View from scratch. Calculating the dynamic `scrollTop` offsets in a generic way to accurately render the exact DOM slice, while managing scroll events continuously without tearing or unresponsiveness, took careful adjustment of state and math (`BUFFER = 8`, keeping a simulated placeholder container for the missing rows to preserve the scrollbar size). 

**How I handled the drag placeholder without layout shift:** During custom drag-and-drop, when a card is actively dragged, its original DOM node is not removed entirely to avoid instantaneous layout collapse. Instead, a CSS `opacity: 0` strategy is used (rendering an invisible placeholder block). By retaining the dimensional footprint of the original card inside the column while absolute positioning a graphical "ghost" clone under the active pointer, sibling cards do not instantly shift upward. When crossing valid drop zones, the target column simply inserts a matching height placeholder, orchestrating a seamless snap without jarring reflows.

**One thing I'd refactor with more time:** Given more time, I would abstract the drag-and-drop pointer calculations into an independent generic Hook builder (e.g., `useDraggable`, `useDroppable`) rather than a single monolithic `useDragAndDrop` orchestrator, which would increase reusability and decouple it completely from Kanban-specific status logic.

## Lighthouse Screenshot

<img width="1685" height="814" alt="Screenshot 2026-03-23 164834" src="https://github.com/user-attachments/assets/29c88bde-9b80-422b-a39a-019b90281430" />


