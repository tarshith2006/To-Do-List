# Interactive To-Do List

> Stay organized. Stay productive. Deep work enabled.

A modern, responsive, and realistic task-management application featuring **Subtask Checklists**, a **Pomodoro Deep Work Focus Timer**, **Kanban Board & List Views**, **Workload Duration Estimates**, **Harmonic Audio Chimes**, and permanent browser **LocalStorage** persistence.

---

## 🚀 Key Features

### 1. Granular Subtask Checklists
- Break complex goals into actionable sub-steps.
- Track progress dynamically on each task card (e.g. `2/3 subtasks`).
- Quick inline addition and instant completion toggles.

### 2. Pomodoro Deep Work Focus Mode
- Launch a distraction-free countdown session for any task.
- Presets for **Focus (25m)**, **Short Break (5m)**, and **Long Break (15m)**.
- Tracks completed pomodoros (`🍅`) per task.
- Synthesized Web Audio alert chime when sessions conclude.

### 3. Kanban Board & List Views
- Toggle seamlessly between standard **List View** and a 3-column **Kanban Board** (*To Do*, *In Progress*, *Completed*).
- 1-click status transitions across stages.

### 4. Workload Time Estimation & Overdue Alerts
- Assign estimated durations (`15m`, `30m`, `45m`, `60m`).
- **Visual Alert System**: Tasks that are **Overdue** or **Due Today** are highlighted with distinct colored left-accent borders, soft background tints, and alert badges (`⚠️ OVERDUE`, `⏰ DUE TODAY`).
- **Dedicated Overdue Count**: The TaskStats dashboard includes a real-time `Overdue` counter card and warning banners with priority recommendations.

### 5. Smart Quick-Schedule Presets
- Single-click scheduling for `Today`, `Tomorrow`, and `Next Week`.
- Relative due date indicators (`Due Today`, `Due Tomorrow`, or `Overdue`).

### 6. Dynamic Search & Multi-Criteria Filtering
- Real-time search scanning titles, categories, notes, and subtasks.
- Filter by workflow status (*All*, *To Do*, *In Progress*, *Completed*) and priority (*High*, *Medium*, *Low*).
- Sort by Newest, Oldest, Due Date, Priority, Estimated Duration, or Alphabetical.

### 7. Harmonic Audio Feedback
- Subtle Web Audio API chime plays upon task or subtask completion (zero external audio files).
- Mute/unmute toggle in the top navigation bar.

### 8. Keyboard Shortcuts & Power Navigation
- Press `?` to open the shortcuts cheat sheet.
- `V`: Switch between List view and Kanban Board.
- `T`: Toggle Light / Dark mode.
- `/`: Jump directly to the search input.
- `Enter`: Submit new task or save active edit.
- `Esc`: Cancel active edit or dismiss dialogs.

### 9. LocalStorage & Backup
- All tasks, subtasks, notes, estimates, status, sound preferences, and themes persist in browser storage.
- JSON backup export and restore anytime.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Plus Jakarta Sans, JetBrains Mono
- **Icons**: Lucide Icons
- **Audio**: Web Audio API (`AudioContext` synthesizer)
- **Storage**: Browser `window.localStorage` (100% client-side, zero backend or paid APIs required)
- **Bundler**: Vite

---

## 💻 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

Open `http://localhost:3000` in your web browser.
