# Tasks — Personal Dashboard

## Implementation Checklist

---

### Phase 1: Project Setup

- [ ] **T-01** Set up `index.html` with semantic HTML skeleton (header, main, sections for each widget)
- [ ] **T-02** Link `css/style.css` and `js/app.js` in `index.html`
- [ ] **T-03** Define CSS custom properties (color variables) in `:root` inside `style.css`
- [ ] **T-04** Set up base styles: reset, body font, background, box-sizing
- [ ] **T-05** Set up CSS Grid layout for the four widget cards
- [ ] **T-06** Add responsive breakpoint (single column below 600px)
- [ ] **T-07** Style each widget card (border-radius, box-shadow, padding)

---

### Phase 2: Greeting & Clock (FR-1)

- [ ] **T-08** Add HTML structure for greeting section (`#clock`, `#date`, `#greeting-text`)
- [ ] **T-09** Write `updateClock()` — updates time display every second using `setInterval`
- [ ] **T-10** Write `updateGreeting()` — returns correct greeting string based on hour
- [ ] **T-11** Write `updateDate()` — formats and displays current date
- [ ] **T-12** *(Challenge)* Add name input UI (inline edit button + input field)
- [ ] **T-13** *(Challenge)* Save and load custom name from `dashboard_name` in Local Storage
- [ ] **T-14** *(Challenge)* Inject custom name into greeting text (e.g., "Good Morning, Alex")

---

### Phase 3: Focus Timer (FR-2)

- [ ] **T-15** Add HTML structure for timer section (`#timer-display`, Start/Stop/Reset buttons)
- [ ] **T-16** Write timer countdown logic using `setInterval`
- [ ] **T-17** Implement Start button — begins countdown from current `remainingSeconds`
- [ ] **T-18** Implement Stop button — clears interval, pauses timer
- [ ] **T-19** Implement Reset button — resets `remainingSeconds` to full duration, clears interval
- [ ] **T-20** Format display as `MM:SS`
- [ ] **T-21** Trigger visual/audio cue when timer hits 0 (Web Audio API beep or alert)
- [ ] **T-22** *(Challenge)* Add duration input UI to change Pomodoro minutes
- [ ] **T-23** *(Challenge)* Save custom duration to `dashboard_pomodoro_duration` in Local Storage
- [ ] **T-24** *(Challenge)* Load saved duration on page init; default to 25 if none saved

---

### Phase 4: To-Do List (FR-3)

- [ ] **T-25** Add HTML structure for to-do section (`#todo-input`, Add button, `#todo-list`)
- [ ] **T-26** Write `renderTodos()` — clears and re-renders `<ul>` from tasks array
- [ ] **T-27** Write `saveTodos()` — serializes tasks array to `dashboard_todos` in Local Storage
- [ ] **T-28** Write `loadTodos()` — reads and parses tasks from Local Storage on init
- [ ] **T-29** Implement Add task — trim input, push `{ id, text, completed: false }`, render, save
- [ ] **T-30** *(Challenge)* Implement duplicate check — case-insensitive comparison before adding
- [ ] **T-31** Implement Complete toggle — flip `completed` boolean on click, render, save
- [ ] **T-32** Implement Delete task — filter by id, render, save
- [ ] **T-33** Implement Edit task — replace text with input on click, save on blur/Enter

---

### Phase 5: Quick Links (FR-4)

- [ ] **T-34** Add HTML structure for quick links section (`#links-container`, add link form)
- [ ] **T-35** Write `renderLinks()` — clears and re-renders link buttons from links array
- [ ] **T-36** Write `saveLinks()` — serializes links array to `dashboard_links` in Local Storage
- [ ] **T-37** Write `loadLinks()` — reads and parses links from Local Storage on init
- [ ] **T-38** Pre-populate default links on first visit (if Local Storage key is empty)
- [ ] **T-39** Implement Add link — validate name + URL inputs, push `{ id, name, url }`, render, save
- [ ] **T-40** Implement Delete link — filter by id, render, save
- [ ] **T-41** Ensure each link button opens URL in a new tab (`window.open`)

---

### Phase 6: Polish & Init

- [ ] **T-42** Write `init()` function — calls all load + render functions on `DOMContentLoaded`
- [ ] **T-43** Style completed tasks (line-through, reduced opacity)
- [ ] **T-44** Style active timer state (e.g., accent color on display while running)
- [ ] **T-45** Add hover and focus styles to all interactive elements
- [ ] **T-46** Test all features in Chrome, Firefox, and Edge
- [ ] **T-47** Verify Local Storage persistence across page reloads

---

### Phase 7: Deployment

- [ ] **T-48** Commit all files using GitHub Desktop
- [ ] **T-49** Push repository to GitHub
- [ ] **T-50** Enable GitHub Pages from the repository settings (root or `main` branch)
- [ ] **T-51** Verify the published site URL works correctly

---

## Challenge Summary

| Challenge | Tasks |
|-----------|-------|
| Custom name in greeting | T-12, T-13, T-14 |
| Change Pomodoro time | T-22, T-23, T-24 |
| Prevent duplicate tasks | T-30 |
