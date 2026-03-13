# Unbroken — Stay Consistent

A modern full-stack productivity app to track daily habits and measure streaks, progress, and completion rates.

---

## Features

- **Task creation** — infinite or fixed-duration tasks
- **Daily completion** — one-tap checkbox per day, per task
- **Streak tracking** — consecutive completed days, auto-resets on miss
- **Progress bars** — animated fraction + percentage display
- **Dashboard stats** — done-today rate, best streak, avg progress
- **Stop / delete tasks** — archive or permanently remove
- **Dark-mode first** — rich, minimal dark UI with Framer Motion animations

---

## Project Structure

```
unbroken/
├── backend/
│   ├── controllers/
│   │   └── taskController.js   # Business logic: progress & streak calc
│   ├── models/
│   │   └── supabase.js         # Supabase client
│   ├── routes/
│   │   └── tasks.js            # Express route definitions
│   ├── server.js               # Express entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── tasks.js        # Fetch wrapper for backend API
│   │   ├── components/
│   │   │   ├── AddTaskModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   └── TaskCard.jsx
│   │   ├── hooks/
│   │   │   └── useTasks.js     # Central data + mutation hook
│   │   ├── pages/
│   │   │   └── Dashboard.jsx   # Single-page root view
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── supabase_schema.sql         # Run once in Supabase SQL editor
```

---

## Local Setup

### 1. Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** and paste + run the contents of `supabase_schema.sql`.
3. From **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret → `SUPABASE_SERVICE_KEY`

---

### 2. Backend

```bash
cd backend
# Fill in SUPABASE_URL and SUPABASE_SERVICE_KEY in .env

npm install
npm run dev       # starts on http://localhost:3001
```

**Available API endpoints:**

| Method | Path                  | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | /api/tasks            | All tasks with progress & streak |
| POST   | /api/tasks            | Create a task                   |
| POST   | /api/tasks/:id/today  | Toggle today's completion        |
| POST   | /api/tasks/:id/stop   | Stop an infinite task            |
| DELETE | /api/tasks/:id        | Permanently delete a task        |

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` → `http://localhost:3001`, so no CORS config needed during development.

---

## Progress & Streak Logic

### Progress

```
Infinite task:
  total_days  = today - start_date + 1
  progress    = completed_days / total_days

Fixed-duration task:
  progress    = completed_days / duration_days
```

### Streak

Count consecutive days going back from **today** where `completed = true`.
Stops at the first gap (even if future days exist).

```
Day1 ✓  Day2 ✓  Day3 ✓  Day4 ✗  Day5 ✓
Current streak = 1   (only Day5 is consecutive from today)
```

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, TailwindCSS, Framer Motion |
| Backend   | Node.js, Express                  |
| Database  | Supabase (PostgreSQL)             |
| Fonts     | Syne (display), DM Sans (body), JetBrains Mono |

---

## Design

- **Theme**: Dark-first, surface layers `#0a0a0f → #1e1e28`
- **Accent**: `#f97316` (brand orange) + `#a78bfa` (violet)
- **Motion**: Framer Motion spring animations on card entry, progress bar fill, modal slide-up
- **Layout**: Responsive CSS Grid — 1 / 2 / 3 columns

---

## Customisation

- Add more preset tasks in `AddTaskModal.jsx` → `PRESETS` array
- Adjust colour palette in `TaskCard.jsx` → `COLORS` array
- Change streak badge threshold in `TaskCard.jsx` (currently 7 days = 🏆 Week!)
