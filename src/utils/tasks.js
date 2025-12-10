// src/utils/tasks.js

const PRIORITY_RANK = {
  high: 3,
  medium: 2,
  low: 1,
};

// Pure function = perfect for unit tests
export function getTopThreeTasks(tasks) {
  return [...tasks]
    .filter((t) => t.status === 'pending')
    .sort((a, b) => {
      const prioDiff = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
      if (prioDiff !== 0) return prioDiff;
      // earlier due date first
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 3);
}

export function getTodayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}