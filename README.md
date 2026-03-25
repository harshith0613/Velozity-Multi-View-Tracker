Multi-View Project Tracker UI

This is a frontend project management dashboard built using React, TypeScript, and Vite. The app supports three different views—Kanban, List, and Timeline—to work with the same set of 500+ tasks. It includes features like custom drag-and-drop (built from scratch), virtual scrolling, filtering, and simulated collaboration indicators.

Setup Instructions
Install dependencies:
npm install
Start the development server:
npm run dev
Build the project:
npm run build
State Management Decision

For managing a fairly large dataset (500+ tasks), I chose Zustand instead of Context API with useReducer.

The main reason is simplicity and performance. Zustand doesn’t require wrapping the app with providers, which keeps the component tree clean. Also, it allows selecting only the specific part of the state a component needs. This helped reduce unnecessary re-renders, especially during drag-and-drop operations and when handling large lists.

Compared to useReducer, Zustand has much less boilerplate and is easier to scale for this kind of UI-heavy application.

Virtual Scrolling Implementation

Rendering all 500+ tasks at once in the List View would hurt performance, so I implemented a custom virtual scrolling solution.

Instead of rendering everything, the app calculates which rows are visible based on the scroll position. Only those rows (plus a small buffer of extra rows above and below) are rendered.

To keep the scrollbar behaving naturally, I used a container with a calculated total height based on all tasks. The visible rows are then positioned correctly inside that space.

This approach keeps scrolling smooth and avoids performance issues caused by too many DOM elements.

Drag-and-Drop Approach

The drag-and-drop system was built from scratch using pointer events, without any external libraries.

When a user starts dragging:

A floating “ghost” element follows the cursor
The original card stays in place but becomes invisible to avoid layout shift

To detect where the card is dropped, I used document.elementFromPoint and custom attributes (data-column) to identify valid drop zones.

This approach avoids unnecessary React re-renders during dragging and keeps interactions smooth on both mouse and touch devices.

Explanation

Hardest problem:
The most challenging part was implementing virtual scrolling properly. Getting the calculations right for which items to render—while keeping scrolling smooth and accurate—took some trial and error. Small mistakes in buffer size or height calculations caused flickering or incorrect positioning, so I had to fine-tune those values.

Handling drag placeholder without layout shift:
Instead of removing the dragged element from the layout, I kept it in place and just made it invisible using CSS. This way, the layout doesn’t collapse or shift suddenly. The actual movement is handled by a floating clone that follows the cursor. When dragging across columns, placeholders are inserted to show where the item will land.
