# Design — Personal Dashboard

## Architecture Overview

Single-page application with no build step and no dependencies. Everything runs in one HTML file, one CSS file, and one JavaScript file.

```
coding-html-css/
├── index.html        ← structure and layout
├── css/
│   └── style.css     ← all styling, including theme variables
└── js/
    └── app.js        ← all logic, state, and Local Storage I/O
```

---

## UI Layout

The page is divided into a responsive grid of four widget cards:

```
┌─────────────────────────────────────┐
│           GREETING / CLOCK          │
│     Good Morning, Alex — 08:45      │
│        Friday, 31 July 2026         │
├──────────────────┬──────────────────┤
│   FOCUS TIMER    │    TO-DO LIST    │
│    25:00  ▶ ■ ↺  │  [ add task... ] │
│  [change time]   │  • Task 1  ✓ 🗑  │
│                  │  • Task 2    🗑  │
├──────────────────┴──────────────────┤
│              QUICK LINKS            │
│  [YouTube] [GitHub] [Gmail]  [+ Add]│
└─────────────────────────────────────┘
```

Layout uses CSS Grid on desktop and stacks to a single column on mobile (below 600px).

---

## Component Design

### 1. Greeting Widget
- A `<section id="greeting">` containing:
  - `<h1 id="clock">` — live time display
  - `<p id="date">` — current date
  - `<p id="greeting-text">` — greeting message + custom name
  - An inline edit button/icon to set the custom name
- `setInterval` runs every 1000ms to update clock and greeting.
- Custom name stored under key `dashboard_name` in Local Storage.

### 2. Focus Timer Widget
- A `<section id="timer">` containing:
  - `<div id="timer-display">` — MM:SS countdown
  - Three buttons: Start (`▶`), Stop (`■`), Reset (`↺`)
  - An input + button to set a custom duration (saved under `dashboard_pomodoro_duration`)
- State variables: `totalSeconds`, `remainingSeconds`, `timerInterval`
- On reaching 0: clear interval, play a short beep via the Web Audio API, and show a "Time's up!" message.

### 3. To-Do List Widget
- A `<section id="todo">` containing:
  - `<input id="todo-input">` + Add button
  - `<ul id="todo-list">` — dynamically rendered list items
- Each task object: `{ id: string, text: string, completed: boolean }`
- Stored as a JSON array under key `dashboard_todos`.
- **Add**: trim input, check for duplicates (case-insensitive), push to array, re-render, save.
- **Edit**: replace task text with an `<input>`, save on blur or Enter key.
- **Complete**: toggle `completed` boolean, re-render.
- **Delete**: filter task out of array, re-render, save.

### 4. Quick Links Widget
- A `<section id="quicklinks">` containing:
  - `<div id="links-container">` — rendered link buttons
  - An "Add Link" form: name input + URL input + Add button
- Each link object: `{ id: string, name: string, url: string }`
- Stored as a JSON array under key `dashboard_links`.
- Links open via `window.open(url, '_blank')`.
- Default links pre-loaded on first visit if Local Storage is empty.

---

## State & Local Storage Schema

| Key | Type | Description |
|-----|------|-------------|
| `dashboard_name` | `string` | User's custom greeting name |
| `dashboard_pomodoro_duration` | `number` | Timer duration in minutes |
| `dashboard_todos` | `JSON array` | Array of task objects |
| `dashboard_links` | `JSON array` | Array of quick link objects |

---

## CSS Design

- CSS custom properties (variables) on `:root` for theming:
  ```css
  :root {
    --bg: #f5f5f5;
    --surface: #ffffff;
    --text: #1a1a1a;
    --accent: #4f6ef7;
  }
  ```
- Font: system font stack for fast load (no external font imports required, but `Inter` or `Poppins` via Google Fonts is acceptable as a stretch).
- Cards use `border-radius`, `box-shadow`, and consistent `padding` for a clean look.
- Completed tasks get a `text-decoration: line-through` and reduced opacity.

---

## JavaScript Module Structure (inside app.js)

app.js is organized into clearly separated sections with comments:

```
// === UTILS ===
// === LOCAL STORAGE ===
// === GREETING & CLOCK ===
// === FOCUS TIMER ===
// === TO-DO LIST ===
// === QUICK LINKS ===
// === INIT ===
```

No classes or modules — plain functions grouped by feature. `init()` is called on `DOMContentLoaded`.

---

## Browser Compatibility Notes

- `localStorage`, `setInterval`, `addEventListener`, `Date` — all baseline APIs, supported everywhere.
- Web Audio API (`AudioContext`) for the timer beep — supported in all modern browsers; wrapped in a try/catch for safety.
- No polyfills needed.
