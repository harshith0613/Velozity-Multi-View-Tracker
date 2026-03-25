import { STATUSES, PRIORITIES } from '../types';
import type { Task, User, Status, Priority } from '../types';

const USERS: User[] = [
  { id: 'u1', name: 'Alex Chen', avatarColor: '#6366f1' },
  { id: 'u2', name: 'Sarah Kim', avatarColor: '#ec4899' },
  { id: 'u3', name: 'Jordan Lee', avatarColor: '#f59e0b' },
  { id: 'u4', name: 'Morgan Patel', avatarColor: '#10b981' },
  { id: 'u5', name: 'Casey Rivera', avatarColor: '#8b5cf6' },
  { id: 'u6', name: 'Taylor Nguyen', avatarColor: '#ef4444' },
];

const TASK_PREFIXES = [
  'Implement', 'Design', 'Fix', 'Update', 'Refactor', 'Optimize',
  'Create', 'Add', 'Remove', 'Test', 'Review', 'Debug', 'Deploy',
  'Configure', 'Integrate', 'Migrate', 'Document', 'Research',
];

const TASK_SUBJECTS = [
  'user authentication flow', 'dashboard analytics', 'payment gateway',
  'notification system', 'search functionality', 'file upload module',
  'caching layer', 'API rate limiting', 'database indexing',
  'CI/CD pipeline', 'error boundary handling', 'responsive navigation',
  'dark mode toggle', 'email verification', 'password reset flow',
  'user profile page', 'settings panel', 'data export feature',
  'audit logging', 'webhook integration', 'SSO integration',
  'performance monitoring', 'load balancer config', 'backup strategy',
  'mobile layout', 'accessibility audit', 'SEO optimization',
  'GraphQL schema', 'REST endpoint', 'WebSocket connection',
  'unit test coverage', 'E2E test suite', 'integration tests',
  'code splitting', 'lazy loading', 'image compression',
  'form validation', 'input sanitization', 'CSRF protection',
  'session management', 'role-based access', 'two-factor auth',
  'real-time sync', 'offline support', 'push notifications',
  'drag-and-drop UI', 'infinite scroll', 'virtual list',
  'chart visualizations', 'PDF generation', 'CSV import',
];

const DESCRIPTIONS = [
  'This task needs careful planning and execution.',
  'High priority item for the current sprint.',
  'Follow the existing patterns in the codebase.',
  'Make sure to add tests for edge cases.',
  'Coordinating with the backend team on this.',
  'Breaking this down into smaller subtasks.',
  'Performance implications need to be measured.',
  'Requires design review before implementation.',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startDaysAgo: number, endDaysAhead: number): string {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - startDaysAgo);
  const end = new Date(today);
  end.setDate(end.getDate() + endDaysAhead);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

export function getUsers(): User[] {
  return USERS;
}

export function generateTasks(count: number = 500): Task[] {
  const tasks: Task[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    let title: string;
    do {
      title = `${randomItem(TASK_PREFIXES)} ${randomItem(TASK_SUBJECTS)}`;
    } while (usedTitles.has(title) && usedTitles.size < TASK_PREFIXES.length * TASK_SUBJECTS.length);
    usedTitles.add(title);

    // Make title unique if collision
    if (tasks.some(t => t.title === title)) {
      title = `${title} #${i + 1}`;
    }

    const status: Status = randomItem(STATUSES);
    const priority: Priority = randomItem(PRIORITIES);
    const assignee = randomItem(USERS);
    const createdAt = randomDate(60, 0);

    // 15% of tasks have no start date
    const hasStartDate = Math.random() > 0.15;
    const startDate = hasStartDate ? randomDate(30, 7) : null;

    let dueDate: string;
    const today = new Date().toISOString().split('T')[0];

    if (i < 10) {
      // First 10: due today edge case
      dueDate = today;
    } else if (i < 30) {
      // Next 20: overdue edge case
      dueDate = randomDate(14, -1);
    } else {
      dueDate = randomDate(-3, 30);
    }

    // Ensure startDate is before dueDate
    const finalStartDate = startDate && startDate > dueDate ? dueDate : startDate;

    tasks.push({
      id: `task-${i + 1}`,
      title,
      description: randomItem(DESCRIPTIONS),
      status,
      priority,
      assignee,
      startDate: finalStartDate,
      dueDate,
      createdAt,
    });
  }

  return tasks;
}
