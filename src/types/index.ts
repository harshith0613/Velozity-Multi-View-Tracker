export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';
export type ViewType = 'kanban' | 'list' | 'timeline';
export type SortDirection = 'asc' | 'desc';
export type SortField = 'title' | 'priority' | 'dueDate' | 'createdAt';

export interface User {
  id: string;
  name: string;
  avatarColor: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: User;
  startDate: string | null; // ISO date string
  dueDate: string;          // ISO date string
  createdAt: string;        // ISO date string
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatarColor: string;
  activeTaskId: string | null;
  cursor: { x: number; y: number } | null;
}

export const STATUS_LABELS: Record<Status, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  'critical': 'Critical',
  'high': 'High',
  'medium': 'Medium',
  'low': 'Low',
};

export const STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];
export const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
