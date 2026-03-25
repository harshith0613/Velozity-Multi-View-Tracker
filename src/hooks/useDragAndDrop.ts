import { useEffect, useRef, useCallback } from 'react';
import { STATUSES } from '../types';
import type { Status } from '../types';

interface DragState {
  isDragging: boolean;
  taskId: string | null;
  sourceStatus: Status | null;
  ghost: HTMLElement | null;
  placeholder: HTMLElement | null;
  originalCard: HTMLElement | null;
  startLeft: number;
  startTop: number;
  offsetX: number;
  offsetY: number;
}

export function useDragAndDrop(onDrop: (taskId: string, newStatus: Status) => void) {
  const dragState = useRef<DragState>({
    isDragging: false,
    taskId: null,
    sourceStatus: null,
    ghost: null,
    placeholder: null,
    originalCard: null,
    startLeft: 0,
    startTop: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const snapBack = useCallback(() => {
    const state = dragState.current;
    if (!state.ghost || !state.placeholder) return;

    const targetRect = state.placeholder.getBoundingClientRect();
    state.ghost.style.transition = 'left 0.25s ease, top 0.25s ease, transform 0.25s ease, opacity 0.25s ease';
    state.ghost.style.left = `${targetRect.left}px`;
    state.ghost.style.top = `${targetRect.top}px`;
    state.ghost.style.transform = 'rotate(0deg) scale(1)';
    state.ghost.style.opacity = '1';

    setTimeout(() => {
      cleanup(true);
    }, 250);
  }, []);

  const cleanup = useCallback((showOriginal = true) => {
    const state = dragState.current;
    if (state.ghost) { state.ghost.remove(); state.ghost = null; }
    if (state.placeholder) { state.placeholder.remove(); state.placeholder = null; }
    if (showOriginal && state.originalCard) {
      state.originalCard.style.display = '';
    }
    state.isDragging = false;
    state.taskId = null;
    state.sourceStatus = null;
    state.originalCard = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.querySelectorAll('[data-column-status]').forEach((col) => {
      (col as HTMLElement).style.outline = '';
      (col as HTMLElement).style.background = '';
    });
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    const card = (e.target as HTMLElement).closest('[data-task-id]') as HTMLElement;
    if (!card) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, a, select, input')) return;

    e.preventDefault();
    card.setPointerCapture(e.pointerId);

    const rect = card.getBoundingClientRect();
    const state = dragState.current;
    state.taskId = card.dataset.taskId || null;
    state.sourceStatus = (card.dataset.taskStatus as Status) || null;
    state.offsetX = e.clientX - rect.left;
    state.offsetY = e.clientY - rect.top;
    state.startLeft = rect.left;
    state.startTop = rect.top;
    state.originalCard = card;

    // Create ghost clone
    const ghost = card.cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed';
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '1000';
    ghost.style.opacity = '0.88';
    ghost.style.transform = 'rotate(1.5deg) scale(1.03)';
    ghost.style.boxShadow = '0 16px 40px rgba(0,0,0,0.18)';
    ghost.style.transition = 'transform 0.1s ease';
    ghost.style.cursor = 'grabbing';
    ghost.style.borderRadius = '10px';
    document.body.appendChild(ghost);
    state.ghost = ghost;

    // Create placeholder (same height as card)
    const placeholder = document.createElement('div');
    placeholder.style.height = `${rect.height}px`;
    placeholder.style.borderRadius = '8px';
    placeholder.style.border = '2px dashed #93c5fd';
    placeholder.style.backgroundColor = 'rgba(59,130,246,0.04)';
    placeholder.style.marginBottom = '8px';
    card.parentElement?.insertBefore(placeholder, card);
    state.placeholder = placeholder;

    card.style.display = 'none';
    state.isDragging = true;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const state = dragState.current;
    if (!state.isDragging || !state.ghost) return;

    const x = e.clientX - state.offsetX;
    const y = e.clientY - state.offsetY;
    state.ghost.style.left = `${x}px`;
    state.ghost.style.top = `${y}px`;

    // Detect drop target (hide ghost briefly to hit-test)
    state.ghost.style.visibility = 'hidden';
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    state.ghost.style.visibility = '';

    // Reset all column highlights
    document.querySelectorAll('[data-column-status]').forEach((col) => {
      (col as HTMLElement).style.outline = '';
      (col as HTMLElement).style.backgroundColor = '';
    });

    if (elementBelow) {
      const column = elementBelow.closest('[data-column-status]') as HTMLElement;
      if (column) {
        column.style.outline = '2px dashed #60a5fa';
        column.style.outlineOffset = '-2px';
        column.style.backgroundColor = 'rgba(59,130,246,0.04)';
      }
    }
  }, []);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    const state = dragState.current;
    if (!state.isDragging) return;

    document.querySelectorAll('[data-column-status]').forEach((col) => {
      (col as HTMLElement).style.outline = '';
      (col as HTMLElement).style.backgroundColor = '';
    });

    if (state.ghost) state.ghost.style.visibility = 'hidden';
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (state.ghost) state.ghost.style.visibility = '';

    let dropStatus: Status | null = null;
    if (elementBelow) {
      const column = elementBelow.closest('[data-column-status]') as HTMLElement;
      if (column) dropStatus = column.dataset.columnStatus as Status;
    }

    if (dropStatus && state.taskId && STATUSES.includes(dropStatus)) {
      onDrop(state.taskId, dropStatus);
      cleanup(true);
    } else {
      // Snap back with animation
      snapBack();
    }
  }, [onDrop, cleanup, snapBack]);

  useEffect(() => {
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);
}
