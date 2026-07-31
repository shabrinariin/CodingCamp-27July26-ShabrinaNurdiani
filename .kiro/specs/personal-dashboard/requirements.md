# Requirements — Personal Dashboard

## Overview

A client-side personal dashboard web app built with vanilla HTML, CSS, and JavaScript. It runs entirely in the browser with no backend, using Local Storage for persistence.

---

## Functional Requirements

### FR-1: Greeting
- **FR-1.1** Display the current time, updated every second.
- **FR-1.2** Display the current date (day, month, year).
- **FR-1.3** Show a time-based greeting:
  - 05:00–11:59 → "Good Morning"
  - 12:00–17:59 → "Good Afternoon"
  - 18:00–21:59 → "Good Evening"
  - 22:00–04:59 → "Good Night"
- **FR-1.4** *(Challenge)* Allow the user to set a custom name that appears in the greeting (e.g., "Good Morning, Alex"). Name is saved in Local Storage.

### FR-2: Focus Timer (Pomodoro)
- **FR-2.1** Default timer is set to 25 minutes.
- **FR-2.2** Provide Start, Stop, and Reset buttons.
- **FR-2.3** Countdown updates every second when running.
- **FR-2.4** Display a visual or audio cue when the timer reaches zero.
- **FR-2.5** *(Challenge)* Allow the user to change the Pomodoro duration. The custom duration is saved in Local Storage.

### FR-3: To-Do List
- **FR-3.1** User can add a new task via an input field.
- **FR-3.2** User can edit an existing task inline.
- **FR-3.3** User can mark a task as done (toggle completed state).
- **FR-3.4** User can delete a task.
- **FR-3.5** All tasks are saved to and loaded from Local Storage.
- **FR-3.6** *(Challenge)* Prevent duplicate task entries (case-insensitive check before adding).
- **FR-3.7** *(Challenge)* Allow sorting tasks (e.g., by completion status or alphabetically).

### FR-4: Quick Links
- **FR-4.1** Display a list of favorite website links as clickable buttons.
- **FR-4.2** Each link opens in a new tab.
- **FR-4.3** User can add new links (name + URL).
- **FR-4.4** User can delete existing links.
- **FR-4.5** All links are saved to and loaded from Local Storage.

### FR-5: Light / Dark Mode *(Challenge)*
- **FR-5.1** Toggle between light and dark color themes.
- **FR-5.2** The selected theme is saved in Local Storage and applied on page load.

---

## Selected Challenges

1. **Custom name in greeting** (FR-1.4)
2. **Change Pomodoro time** (FR-2.5)
3. **Prevent duplicate tasks** (FR-3.6)

> Note: The three challenges above are the chosen set. FR-3.7 (sort tasks) and FR-5 (light/dark mode) are optional stretch goals.

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Clean, minimal UI — no complex setup |
| NFR-2 | Fast load time, no noticeable lag |
| NFR-3 | Clear visual hierarchy, readable typography |
| NFR-4 | Works in Chrome, Firefox, Edge, Safari |
| NFR-5 | No test framework required |

---

## Technical Constraints

| ID | Constraint |
|----|------------|
| TC-1 | HTML + CSS + Vanilla JavaScript only (no frameworks) |
| TC-2 | All data stored in browser Local Storage |
| TC-3 | Compatible with modern browsers; usable as standalone web app |
| TC-4 | Only 1 CSS file (`css/style.css`) |
| TC-5 | Only 1 JavaScript file (`js/app.js`) |
