import React, { useState } from 'react';
import { getTopThreeTasks, getTodayISO } from './utils/tasks';

const initialTasks = [
  {
    id: 1,
    title: 'Finish MindEase report',
    dueDate: getTodayISO(),
    priority: 'high',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Study for database quiz',
    dueDate: getTodayISO(),
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Go for 20-minute walk',
    dueDate: getTodayISO(),
    priority: 'low',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Send email to professor',
    dueDate: getTodayISO(),
    priority: 'medium',
    status: 'done',
  },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(getTodayISO());
  const [newPriority, setNewPriority] = useState('medium');

  const topThree = getTopThreeTasks(tasks);
  const today = new Date(getTodayISO());

  const pendingTodayCount = tasks.filter(
    (t) =>
      t.status === 'pending' &&
      new Date(t.dueDate).toDateString() === today.toDateString()
  ).length;

  function addTask(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTitle.trim(),
      dueDate: newDate,
      priority: newPriority,
      status: 'pending',
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle('');
    setNewDate(getTodayISO());
    setNewPriority('medium');
  }

  function toggleTaskStatus(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'pending' ? 'done' : 'pending' }
          : t
      )
    );
  }

  function rescheduleMissed() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().slice(0, 10);

    setTasks((prev) =>
      prev.map((t) => {
        const due = new Date(t.dueDate);
        if (t.status === 'pending' && due < today) {
          return {
            ...t,
            dueDate: tomorrowISO,
            priority: 'high', // simulate "smart" reschedule
          };
        }
        return t;
      })
    );
  }

  function getWellnessMessage() {
    if (pendingTodayCount >= 5) {
      return "Big day ahead. Don't forget to breathe and take short breaks 🧘‍♀️";
    }
    if (pendingTodayCount === 0) {
      return 'You are on top of things today. Maybe time for a walk or some stretching? 🚶‍♂️';
    }
    return 'Stay focused on your top three. A 5-minute break after each task can boost your energy ☕️';
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>MindEase Planner</h1>
          <span>Lightweight student planner – Top 3 + Wellness</span>
        </div>
        <span>Today: {getTodayISO()}</span>
      </header>

      <div className="layout">
        {/* Left: all tasks + add form */}
        <section className="card">
          <h2>All Tasks</h2>
          <div className="tasks-list" style={{ marginTop: '8px' }}>
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div>
                  <div className="task-title">
                    {task.status === 'done' ? '✅ ' : ''}
                    {task.title}
                  </div>
                  <div className="task-meta">
                    Due: {task.dueDate} · Priority:{' '}
                    <span
                      className={
                        'badge ' +
                        (task.priority === 'high'
                          ? 'badge-high'
                          : task.priority === 'medium'
                          ? 'badge-medium'
                          : 'badge-low')
                      }
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
                <button
                  className="btn-small btn-secondary"
                  onClick={() => toggleTaskStatus(task.id)}
                >
                  {task.status === 'pending' ? 'Mark done' : 'Mark pending'}
                </button>
              </div>
            ))}
          </div>

          <form className="form" onSubmit={addTask}>
            <h3 style={{ marginTop: '8px' }}>Add task</h3>
            <input
              type="text"
              placeholder="Task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="form-row">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="high">High priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button className="btn-primary" type="submit">
              Add task
            </button>
          </form>
        </section>

        {/* Right: Top 3 + wellness + reschedule */}
        <section className="card">
          <h2>Today&apos;s Top 3</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: 8 }}>
            Automatically sorted by priority and due date.
          </p>
          <div className="tasks-list">
            {topThree.length === 0 && (
              <div className="task-meta">No pending tasks 🎉</div>
            )}
            {topThree.map((task) => (
              <div key={task.id} className="task-item">
                <div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    Due: {task.dueDate} ·{' '}
                    <span
                      className={
                        'badge ' +
                        (task.priority === 'high'
                          ? 'badge-high'
                          : task.priority === 'medium'
                          ? 'badge-medium'
                          : 'badge-low')
                      }
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <h3>Wellness</h3>
            <p className="wellness-message">{getWellnessMessage()}</p>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button className="btn-secondary btn-small" onClick={rescheduleMissed}>
              Reschedule missed tasks
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;