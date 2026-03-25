import { useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useFilterStore } from '../../store/filterStore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { KanbanColumn } from './KanbanColumn';
import { STATUSES } from '../../types';
import type { Status } from '../../types';

export function KanbanBoard() {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const statuses = useFilterStore((s) => s.statuses);
  const priorities = useFilterStore((s) => s.priorities);
  const assigneeIds = useFilterStore((s) => s.assigneeIds);
  const dateRange = useFilterStore((s) => s.dateRange);

  useDragAndDrop(updateTaskStatus);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statuses.length > 0 && !statuses.includes(task.status)) return false;
      if (priorities.length > 0 && !priorities.includes(task.priority)) return false;
      if (assigneeIds.length > 0 && !assigneeIds.includes(task.assignee.id)) return false;
      if (dateRange.start && task.dueDate < dateRange.start) return false;
      if (dateRange.end && task.dueDate > dateRange.end) return false;
      return true;
    });
  }, [tasks, statuses, priorities, assigneeIds, dateRange]);

  const columnData = useMemo(() => {
    const map = new Map<Status, typeof filteredTasks>();
    for (const status of STATUSES) {
      map.set(status, filteredTasks.filter((t) => t.status === status));
    }
    return map;
  }, [filteredTasks]);

  return (
    <div
      className="flex-1 flex gap-3 p-4 overflow-x-auto scrollbar-thin"
      id="kanban-board"
      style={{ minHeight: 0 }}
    >
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={columnData.get(status) || []}
        />
      ))}
    </div>
  );
}
