# MindEase Planner

A lightweight student-focused planner that highlights **Today’s Top 3 tasks**, supports basic task management, and shows simple **wellness prompts** to encourage healthy study habits.

Live demo: https://mindease-app.netlify.app/

> This project is part of the Implementation & Testing milestone for the MindEase product.

---

## Core Features (Implementation)

- ✅ Task list with ability to **add tasks** (title, due date, priority)
- ✅ Toggle tasks between **pending / done**
- ✅ “**Today’s Top 3**” section
  - Uses a pure function `getTopThreeTasks(tasks)`  
  - Sorts by **priority** (high → medium → low) and **due date**
- ✅ Simple **“Reschedule missed tasks”** button
  - Moves past-due pending tasks to **tomorrow**
  - Bumps them to **high priority** to simulate “smart” rescheduling
- ✅ Context-aware **wellness message** based on how many pending tasks you have today

---

## Tech Stack

- **React** (Create React App)
- **JavaScript (ES6)**
- **Jest** (built-in with CRA) for unit testing
- **Netlify** for deployment
- **GitHub** for version control and public repository

---

## Project Structure (key parts)

```text
mindease-app/
  src/
    App.js              # Main UI and core MindEase logic
    index.js            # React entry point
    index.css           # Styling
    utils/
      tasks.js          # Pure functions: getTopThreeTasks, getTodayISO
      tasks.test.js     # Unit test for getTopThreeTasks


    
## Running the Project Locally

1. Install dependencies
    npm install

2. Start the development server
    npm start

The app will be available at http://localhost:3000.


## Running tests

This project includes at least one automated unit test:
	•	File: src/utils/tasks.test.js
	•	What it tests:
	•	getTopThreeTasks(tasks)
	•	ignores tasks with status: "done"
	•	returns at most 3 tasks
	•	orders by priority (high > medium > low) and then by nearest due date

To run tests:
    npm test

Jest will run and you should see:
    PASS src/utils/tasks.test.js
    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total


## Links for the Milestone

	•	Figma high-fidelity prototype: -to be added later-
	•	Public repository: https://github.com/drissaloui1501/mindease-app
	•	Hosted app (Netlify): https://mindease-app.netlify.app/

