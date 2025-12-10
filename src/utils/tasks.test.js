// src/utils/tasks.test.js
import { getTopThreeTasks } from './tasks';

describe('getTopThreeTasks', () => {
  test('returns up to three highest-priority pending tasks ordered by priority then due date', () => {
    const tasks = [
      {
        id: 1,
        title: 'Low priority later',
        priority: 'low',
        status: 'pending',
        dueDate: '2025-12-20',
      },
      {
        id: 2,
        title: 'High priority later',
        priority: 'high',
        status: 'pending',
        dueDate: '2025-12-15',
      },
      {
        id: 3,
        title: 'Medium priority sooner',
        priority: 'medium',
        status: 'pending',
        dueDate: '2025-12-10',
      },
      {
        id: 4,
        title: 'High priority sooner',
        priority: 'high',
        status: 'pending',
        dueDate: '2025-12-05',
      },
      {
        id: 5,
        title: 'Done task (should be ignored)',
        priority: 'high',
        status: 'done',
        dueDate: '2025-12-01',
      },
    ];

    const result = getTopThreeTasks(tasks);

    // Should ignore done task and return exactly 3
    expect(result).toHaveLength(3);

    // First should be high priority with earliest date (id 4)
    expect(result[0].id).toBe(4);
    // Second should be other high priority (id 2)
    expect(result[1].id).toBe(2);
    // Third should be medium priority (id 3)
    expect(result[2].id).toBe(3);
  });
});