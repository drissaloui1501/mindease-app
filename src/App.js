import React, { useState } from 'react';
import { getTopThreeTasks, getTodayISO } from './utils/tasks';
import logo from './assets/Mindease_LOGO.png'; 
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekDays(baseDate) {
  // Week from Sunday to Saturday containing baseDate
  const start = new Date(baseDate);
  const dayIndex = start.getDay(); // 0..6
  start.setDate(start.getDate() - dayIndex);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function getMonthMatrix(baseDate) {
  // Returns array of weeks, each week = array of 7 items (Date or null)
  const year = baseDate.getFullYear();
  const monthIndex = baseDate.getMonth();

  const firstOfMonth = new Date(year, monthIndex, 1);
  const firstDayIndex = firstOfMonth.getDay(); // 0..6
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const weeks = [];
  let currentWeek = [];

  // Empty cells before the first of the month
  for (let i = 0; i < firstDayIndex; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    currentWeek.push(date);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining cells
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}



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

    const [profile, setProfile] = useState({
    firstName: 'Driss',
    lastName: 'Aloui',
    gender: 'male',
    age: 24,
    email: 'd.aloui@aui.ma',
    password: 'drissaloui@1234',
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('week');

  const [showDone, setShowDone] = useState(true);
  const [taskFilter, setTaskFilter] = useState('all');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('medium');

  const initials =
    (profile.firstName?.[0] || '') + (profile.lastName?.[0] || '');
  const profileInitials = initials || 'ME';
    function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value,
    }));
  }

  function handleProfileSubmit(event) {
    event.preventDefault();
    // here you could also do validation or show a toast
    setIsProfileOpen(false);
  }

  const topThree = getTopThreeTasks(tasks);
  const today = new Date(getTodayISO());

  const pendingTodayCount = tasks.filter(
    (t) =>
      t.status === 'pending' &&
      new Date(t.dueDate).toDateString() === today.toDateString()
  ).length;

  const doneTodayCount = tasks.filter(
    (t) =>
      t.status === 'done' &&
      new Date(t.dueDate).toDateString() === today.toDateString()
  ).length;

  const totalTodayCount = pendingTodayCount + doneTodayCount;
  
  const hasStreak = doneTodayCount >= 3;
  const tasksRemainingForStreak = Math.max(0, 3 - doneTodayCount);
  

  const tasksByDate = tasks.reduce((acc, task) => {
    if (!acc[task.dueDate]) {
      acc[task.dueDate] = [];
    }
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  const weekDays = getWeekDays(today);
  const monthMatrix = getMonthMatrix(today);

    let filteredTasks = tasks;

  if (!showDone) {
    filteredTasks = filteredTasks.filter((t) => t.status !== 'done');
  }

  if (taskFilter === 'today') {
    filteredTasks = filteredTasks.filter(
      (t) => new Date(t.dueDate).toDateString() === today.toDateString()
    );
  } else if (taskFilter === 'upcoming') {
    filteredTasks = filteredTasks.filter(
      (t) => new Date(t.dueDate) > today
    );
  }

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

    function startEditingTask(task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  }

  function cancelEditingTask() {
    setEditingTaskId(null);
    setEditTitle('');
    setEditPriority('medium');
  }

  function saveEditingTask(event) {
    event.preventDefault();
    if (!editTitle.trim()) {
      return;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTaskId
          ? { ...t, title: editTitle.trim(), priority: editPriority }
          : t
      )
    );
    cancelEditingTask();
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingTaskId === id) {
      cancelEditingTask();
    }
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
              <h1>
      <img src={logo} alt="MindEase logo" className="app-logo" />
      Hi, {profile.firstName || 'there'}
    </h1>
  
        </div>
        <div className="header-right">
            <button
      type="button"
      className="header-date date-button"
      onClick={() => setIsCalendarOpen((prev) => !prev)}
    >
      Today: {getTodayISO()}
    </button>
        <button
  type="button"
  className="profile-button"
  onClick={() => setIsProfileOpen((prev) => !prev)}
>
  <div className="avatar-wrapper">
    <div className="avatar-circle">{profileInitials}</div>
    {hasStreak && <span className="avatar-streak-badge">🔥</span>}
  </div>
</button>
      </div>
      </header>
          <div className="summary-bar">
      <span className="summary-chip summary-chip-main">
        Today: {totalTodayCount} task{totalTodayCount !== 1 ? 's' : ''}
      </span>
      <span className="summary-chip">
        Done: {doneTodayCount}
      </span>
      <span className="summary-chip">
        Remaining: {pendingTodayCount}
      </span>
    </div>

    <div className="streak-banner">
      <span className="streak-icon">
        {hasStreak ? '🔥' : '✨'}
      </span>
      <span className="streak-text">
        {hasStreak ? (
          <>
            <strong>Focus streak active!</strong> You completed at least 3
            tasks today.
          </>
        ) : (
          <>
            Complete{' '}
            <strong>
              {tasksRemainingForStreak}{' '}
              task{tasksRemainingForStreak === 1 ? '' : 's'}
            </strong>{' '}
            today to activate your streak.
          </>
        )}
      </span>
    </div>
{isProfileOpen && (
        <div className="profile-panel">
          <div className="profile-panel-header">
            <div className="profile-header-main">
              <div className="avatar-circle avatar-circle-large">
                {profileInitials}
              </div>
              <div>
                <div className="profile-name">
                  {profile.firstName} {profile.lastName}
                </div>
                <div className="profile-email">{profile.email}</div>
              </div>
            </div>
            <button
              type="button"
              className="profile-close"
              onClick={() => setIsProfileOpen(false)}
            >
              ✕
            </button>
          </div>

          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <div className="profile-form-row">
              <div className="profile-field">
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="profile-field">
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="profile-field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleProfileChange}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="">Prefer not to say</option>
                </select>
              </div>
              <div className="profile-field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  min="0"
                  value={profile.age}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
              />
            </div>

            <div className="profile-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleProfileChange}
                placeholder="••••••••"
              />
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={() => setIsProfileOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary btn-small">
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
            {isCalendarOpen && (
        <div className="calendar-panel">
          <div className="calendar-header">
            <div className="calendar-title">Schedule</div>
            <div className="calendar-toggle">
              <button
                type="button"
                className={
                  'calendar-toggle-btn' +
                  (calendarView === 'week' ? ' active' : '')
                }
                onClick={() => setCalendarView('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={
                  'calendar-toggle-btn' +
                  (calendarView === 'month' ? ' active' : '')
                }
                onClick={() => setCalendarView('month')}
              >
                Month
              </button>
            </div>
          </div>

          {calendarView === 'week' && (
            <div className="calendar-week">
              {weekDays.map((day) => {
                const iso = formatDateISO(day);
                const isToday = iso === getTodayISO();
                const dayTasks = tasksByDate[iso] || [];
                const visibleTasks = dayTasks.slice(0, 3);
                const extraCount = dayTasks.length - visibleTasks.length;

                return (
                  <div
                    key={iso}
                    className={
                      'calendar-day' + (isToday ? ' calendar-day-today' : '')
                    }
                  >
                    <div className="calendar-day-label">
                      {weekdayLabels[day.getDay()]}
                    </div>
                    <div className="calendar-day-number">{day.getDate()}</div>
                    <div className="calendar-dots">
                      {visibleTasks.map((task) => (
                        <span
                          key={task.id}
                          className={
                            'priority-dot priority-dot-' + task.priority
                          }
                        />
                      ))}
                      {extraCount > 0 && (
                        <span className="calendar-more">+{extraCount}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {calendarView === 'month' && (
            <div className="calendar-month">
              <div className="calendar-week calendar-week-header">
                {weekdayLabels.map((label) => (
                  <div key={label} className="calendar-day header-cell">
                    <div className="calendar-day-label">{label}</div>
                  </div>
                ))}
              </div>
              {monthMatrix.map((week, index) => (
                <div key={index} className="calendar-week">
                  {week.map((day, i) => {
                    if (!day) {
                      return (
                        <div
                          key={i}
                          className="calendar-day calendar-day-empty"
                        />
                      );
                    }
                    const iso = formatDateISO(day);
                    const isToday = iso === getTodayISO();
                    const dayTasks = tasksByDate[iso] || [];
                    const visibleTasks = dayTasks.slice(0, 3);
                    const extraCount = dayTasks.length - visibleTasks.length;

                    return (
                      <div
                        key={iso}
                        className={
                          'calendar-day' +
                          (isToday ? ' calendar-day-today' : '')
                        }
                      >
                        <div className="calendar-day-number">
                          {day.getDate()}
                        </div>
                        <div className="calendar-dots">
                          {visibleTasks.map((task) => (
                            <span
                              key={task.id}
                              className={
                                'priority-dot priority-dot-' + task.priority
                              }
                            />
                          ))}
                          {extraCount > 0 && (
                            <span className="calendar-more">+{extraCount}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="layout">
        {/* Left: all tasks + add form */}
        <section className="card">
          <h2>All Tasks</h2>
            <div className="tasks-toolbar">
    <div className="filter-pills">
      <button
        type="button"
        className={
          'filter-pill' + (taskFilter === 'all' ? ' active' : '')
        }
        onClick={() => setTaskFilter('all')}
      >
        All
      </button>
      <button
        type="button"
        className={
          'filter-pill' + (taskFilter === 'today' ? ' active' : '')
        }
        onClick={() => setTaskFilter('today')}
      >
        Today
      </button>
      <button
        type="button"
        className={
          'filter-pill' + (taskFilter === 'upcoming' ? ' active' : '')
        }
        onClick={() => setTaskFilter('upcoming')}
      >
        Upcoming
      </button>
    </div>

    <div className="tasks-toggle">
      <span>Show completed</span>
      <button
        type="button"
        className={
          'toggle-switch' + (showDone ? ' toggle-switch-on' : '')
        }
        onClick={() => setShowDone((prev) => !prev)}
      >
        <span className="toggle-knob" />
      </button>
    </div>
  </div>
           <div className="tasks-list" style={{ marginTop: '8px' }}>
    {filteredTasks.length === 0 && (
      <div className="task-meta">No tasks for this view yet.</div>
    )}

    {filteredTasks.map((task) => (
      <div key={task.id} className="task-item-wrapper">
        <div className="task-item">
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

          <div className="task-actions">
            <button
              className="btn-small btn-secondary icon-button"
              onClick={() => toggleTaskStatus(task.id)}
              aria-label={
                task.status === 'pending'
                  ? 'Mark task as done'
                  : 'Mark task as pending'
              }
            >
              {task.status === 'pending' ? '✅' : '↩️'}
            </button>

            <button
              type="button"
              className="btn-small btn-secondary icon-button edit-button"
              onClick={() => startEditingTask(task)}
              aria-label="Edit task"
            >
              ✏️
            </button>
          </div>
        </div>

        {editingTaskId === task.id && (
          <form className="task-edit-panel" onSubmit={saveEditingTask}>
            <div className="task-edit-row">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>

            <div className="task-edit-row">
              <label className="task-edit-label">Priority</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="high">High priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="task-edit-actions">
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={cancelEditingTask}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary btn-small">
                Save
              </button>
              <button
                type="button"
                className="btn-secondary btn-small delete-button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </form>
        )}
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
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button className="btn-secondary btn-small" onClick={rescheduleMissed}>
              Reschedule missed tasks
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3>Wellness</h3>
            <p className="wellness-message">{getWellnessMessage()}</p>
          </div>

          
        </section>
      </div>
    </div>
  );
}

export default App;