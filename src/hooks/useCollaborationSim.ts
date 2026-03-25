import { useEffect, useRef } from 'react';
import { useCollaborationStore } from '../store/collaborationStore';
import { useTaskStore } from '../store/taskStore';
import type { CollaborationUser } from '../types';

const SIMULATED_USERS: Omit<CollaborationUser, 'activeTaskId' | 'cursor'>[] = [
  { id: 'collab-1', name: 'Emma Watson', avatarColor: '#06b6d4' },
  { id: 'collab-2', name: 'Liam Davis', avatarColor: '#d946ef' },
  { id: 'collab-3', name: 'Olivia Jones', avatarColor: '#f97316' },
];

export function useCollaborationSim() {
  const setUsers = useCollaborationStore((s) => s.setUsers);
  const moveUser = useCollaborationStore((s) => s.moveUser);
  const tasks = useTaskStore((s) => s.tasks);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize simulated users on mount
    const initialUsers: CollaborationUser[] = SIMULATED_USERS.map((u, i) => ({
      ...u,
      activeTaskId: tasks[i * 7]?.id || null,
      cursor: null,
    }));
    setUsers(initialUsers);

    // Randomly move a user to a different task every 3-5s
    intervalRef.current = window.setInterval(() => {
      const randomUserIdx = Math.floor(Math.random() * SIMULATED_USERS.length);
      const randomTaskIdx = Math.floor(Math.random() * Math.min(tasks.length, 50));
      const userId = SIMULATED_USERS[randomUserIdx].id;
      const taskId = tasks[randomTaskIdx]?.id || null;

      moveUser(userId, taskId);
    }, 3000 + Math.random() * 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [setUsers, moveUser, tasks]);
}
