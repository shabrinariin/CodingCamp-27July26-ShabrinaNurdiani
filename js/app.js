/* ============================================================
   Life Dashboard — app.js
   Features  : Clock/Date, Greeting, Focus Timer, To-Do List,
               Quick Links
   Challenges : ① Light/Dark mode  ② Custom name in greeting
               ③ Change Pomodoro time  ④ Prevent duplicate tasks
               ⑤ Sort tasks
   Storage    : localStorage only (no backend)
   ============================================================ */

'use strict';

/* ── Storage helpers ─────────────────────────────────────── */
const store = {
  get:    (key, fallback = null) => { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set:    (key, value)           => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
  remove: (key)                  => { localStorage.removeItem(key); }
};

/* ── Toast helper ────────────────────────────────────────── */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

/* ============================================================
   1.  CLOCK & DATE
   ============================================================ */
const clockEl    = document.getElementById('clock');
const dateEl     = document.getElementById('date');
const greetingEl = document.getElementById('greeting');

const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getGreetingText(hour) {
  if (hour >= 5  && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

function updateClock() {
  const now    = new Date();
  const h      = now.getHours();
  const m      = String(now.getMinutes()).padStart(2, '0');
  const s      = String(now.getSeconds()).padStart(2, '0');
  const ampm   = h >= 12 ? 'PM' : 'AM';
  const h12    = String(h % 12 || 12).padStart(2, '0');

  clockEl.textContent = `${h12}:${m}:${s} ${ampm}`;

  const day   = DAY_NAMES[now.getDay()];
  const month = MONTH_NAMES[now.getMonth()];
  dateEl.textContent = `${day}, ${month} ${now.getDate()}, ${now.getFullYear()}`;

  const name = store.get('userName', '');
  const nameStr = name ? `, ${name}` : '!';
  greetingEl.textContent = `${getGreetingText(h)}${nameStr} 👋`;
}

setInterval(updateClock, 1000);
updateClock();

/* ============================================================
   2.  LIGHT / DARK MODE  (Challenge ①)
   ============================================================ */
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  store.set('theme', theme);
}

// Init from storage
applyTheme(store.get('theme', 'light'));

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   3.  CUSTOM NAME IN GREETING  (Challenge ②)
   ============================================================ */
const nameBtn     = document.getElementById('name-btn');
const nameModal   = document.getElementById('name-modal');
const nameInput   = document.getElementById('name-input');
const nameSave    = document.getElementById('name-save');
const nameCancel  = document.getElementById('name-cancel');
const overlay     = document.getElementById('modal-overlay');

function openNameModal() {
  nameInput.value = store.get('userName', '');
  nameModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  nameInput.focus();
}
function closeNameModal() {
  nameModal.classList.add('hidden');
  overlay.classList.add('hidden');
}

nameBtn.addEventListener('click', openNameModal);
nameCancel.addEventListener('click', closeNameModal);
overlay.addEventListener('click', closeNameModal);

nameSave.addEventListener('click', () => {
  const val = nameInput.value.trim();
  store.set('userName', val);
  updateClock();          // refresh greeting immediately
  closeNameModal();
  showToast(val ? `Hello, ${val}! 👋` : 'Name cleared.', 'success');
});

nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') nameSave.click(); });

/* ============================================================
   4.  FOCUS TIMER  (Challenge ③ — Change Pomodoro time)
   ============================================================ */
const timerDisplay  = document.getElementById('timer-display');
const timerStart    = document.getElementById('timer-start');
const timerStop     = document.getElementById('timer-stop');
const timerReset    = document.getElementById('timer-reset');
const timerStatus   = document.getElementById('timer-status');
const pomodoroInput = document.getElementById('pomodoro-minutes');
const applyDuration = document.getElementById('apply-duration');

let timerDuration  = store.get('pomodoroDuration', 25) * 60;  // seconds
let timeRemaining  = timerDuration;
let timerInterval  = null;
let timerRunning   = false;

// Init input from storage
pomodoroInput.value = store.get('pomodoroDuration', 25);

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function setTimerDisplay(seconds, state = 'idle') {
  timerDisplay.textContent = formatTime(seconds);
  timerDisplay.className   = 'timer-display ' + (state === 'running' ? 'running' : state === 'finished' ? 'finished' : '');
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
}

function resetTimer(duration = timerDuration) {
  stopTimer();
  timeRemaining = duration;
  setTimerDisplay(timeRemaining);
  timerStatus.textContent = 'Ready to focus!';
}

timerStart.addEventListener('click', () => {
  if (timerRunning) return;
  if (timeRemaining <= 0) resetTimer();
  timerRunning = true;
  timerStatus.textContent = '🔥 Focusing…';
  setTimerDisplay(timeRemaining, 'running');

  timerInterval = setInterval(() => {
    timeRemaining--;
    setTimerDisplay(timeRemaining, timeRemaining > 0 ? 'running' : 'finished');

    if (timeRemaining <= 0) {
      stopTimer();
      timerStatus.textContent = '🎉 Session complete! Take a break.';
      showToast('⏰ Focus session complete! Take a break.', 'success');
      // Browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('Focus session done!', { body: 'Time for a break 🎉' });
      }
    }
  }, 1000);
});

timerStop.addEventListener('click', () => {
  if (!timerRunning) return;
  stopTimer();
  setTimerDisplay(timeRemaining);
  timerStatus.textContent = '⏸ Paused.';
});

timerReset.addEventListener('click', () => {
  resetTimer();
});

// Challenge ③ — apply custom duration
applyDuration.addEventListener('click', () => {
  let mins = parseInt(pomodoroInput.value, 10);
  if (isNaN(mins) || mins < 1) mins = 1;
  if (mins > 120)              mins = 120;
  pomodoroInput.value = mins;
  store.set('pomodoroDuration', mins);
  timerDuration  = mins * 60;
  resetTimer(timerDuration);
  showToast(`Timer set to ${mins} minutes.`, 'success');
});

// Init display
setTimerDisplay(timeRemaining);

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

/* ============================================================
   5.  TO-DO LIST  (Challenges ④ Prevent duplicates  ⑤ Sort)
   ============================================================ */
const todoInput  = document.getElementById('todo-input');
const todoAddBtn = document.getElementById('todo-add');
const todoList   = document.getElementById('todo-list');
const sortSelect = document.getElementById('sort-select');
const taskCount  = document.getElementById('task-count');
const clearDone  = document.getElementById('clear-done');

let tasks = store.get('tasks', []);   // [{ id, text, done }]

// Utility: generate a simple unique id
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

/* ── Render ── */
function renderTasks() {
  todoList.innerHTML = '';

  // Sort a copy (don't mutate persistent order for 'default')
  let sorted = [...tasks];
  const mode = sortSelect.value;
  if (mode === 'az')         sorted.sort((a, b) => a.text.localeCompare(b.text));
  else if (mode === 'za')    sorted.sort((a, b) => b.text.localeCompare(a.text));
  else if (mode === 'done-last')  sorted.sort((a, b) => a.done - b.done);
  else if (mode === 'done-first') sorted.sort((a, b) => b.done - a.done);

  if (sorted.length === 0) {
    const empty = document.createElement('li');
    empty.style.cssText = 'text-align:center;color:var(--text-muted);font-size:0.88rem;padding:16px;';
    empty.textContent = 'No tasks yet. Add one above!';
    todoList.appendChild(empty);
  } else {
    sorted.forEach(task => todoList.appendChild(createTaskEl(task)));
  }

  // Update count
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  taskCount.textContent = total === 0 ? 'No tasks' : `${done}/${total} done`;

  store.set('tasks', tasks);
}

/* ── Create task DOM element ── */
function createTaskEl(task) {
  const li = document.createElement('li');
  li.className = `todo-item${task.done ? ' done' : ''}`;
  li.dataset.id = task.id;

  // Checkbox
  const cb = document.createElement('input');
  cb.type      = 'checkbox';
  cb.className = 'todo-checkbox';
  cb.checked   = task.done;
  cb.setAttribute('aria-label', `Mark "${task.text}" as done`);
  cb.addEventListener('change', () => toggleTask(task.id));

  // Text
  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;

  // Actions
  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'action-btn edit-btn';
  editBtn.title     = 'Edit task';
  editBtn.textContent = '✏️';
  editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);
  editBtn.addEventListener('click', () => startEdit(li, task));

  const delBtn = document.createElement('button');
  delBtn.className = 'action-btn delete-btn';
  delBtn.title     = 'Delete task';
  delBtn.textContent = '🗑';
  delBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
  delBtn.addEventListener('click', () => deleteTask(task.id));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(cb);
  li.appendChild(span);
  li.appendChild(actions);

  return li;
}

/* ── Inline edit ── */
function startEdit(li, task) {
  const span     = li.querySelector('.task-text');
  const actions  = li.querySelector('.todo-actions');

  const input = document.createElement('input');
  input.type      = 'text';
  input.className = 'task-edit-input';
  input.value     = task.text;
  input.maxLength = 120;

  const saveBtn = document.createElement('button');
  saveBtn.className   = 'action-btn save-btn';
  saveBtn.title       = 'Save edit';
  saveBtn.textContent = '✔️';

  const cancelBtn = document.createElement('button');
  cancelBtn.className   = 'action-btn';
  cancelBtn.title       = 'Cancel edit';
  cancelBtn.textContent = '✖️';

  function commitEdit() {
    const newText = input.value.trim();
    if (!newText) { showToast('Task cannot be empty.', 'error'); return; }
    // Challenge ④ — prevent duplicates on edit
    if (isDuplicate(newText, task.id)) {
      showToast('A task with that name already exists.', 'error');
      return;
    }
    task.text = newText;
    renderTasks();
  }
  function cancelEdit() { renderTasks(); }

  saveBtn.addEventListener('click', commitEdit);
  cancelBtn.addEventListener('click', cancelEdit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  commitEdit();
    if (e.key === 'Escape') cancelEdit();
  });

  // Swap span → input
  span.replaceWith(input);

  // Swap edit button → save+cancel
  actions.innerHTML = '';
  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);

  input.focus();
  input.select();
}

/* ── Helpers ── */
function isDuplicate(text, excludeId = null) {
  return tasks.some(t => t.id !== excludeId && t.text.trim().toLowerCase() === text.trim().toLowerCase());
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) { showToast('Please enter a task.', 'error'); return; }
  // Challenge ④ — prevent duplicates
  if (isDuplicate(trimmed)) {
    showToast('This task already exists.', 'error');
    return;
  }
  tasks.push({ id: uid(), text: trimmed, done: false });
  renderTasks();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; renderTasks(); }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

/* ── Events ── */
todoAddBtn.addEventListener('click', () => addTask(todoInput.value));
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(todoInput.value); });
sortSelect.addEventListener('change', renderTasks);
clearDone.addEventListener('click', () => {
  const beforeCount = tasks.length;
  tasks = tasks.filter(t => !t.done);
  const removed = beforeCount - tasks.length;
  renderTasks();
  if (removed > 0) showToast(`Cleared ${removed} completed task${removed > 1 ? 's' : ''}.`, 'success');
});

// Init
renderTasks();

/* ============================================================
   6.  QUICK LINKS
   ============================================================ */
const linkNameInput = document.getElementById('link-name');
const linkUrlInput  = document.getElementById('link-url');
const linkAddBtn    = document.getElementById('link-add');
const linksGrid     = document.getElementById('links-grid');

let links = store.get('links', [
  { id: uid(), label: 'Google',   url: 'https://google.com'   },
  { id: uid(), label: 'YouTube',  url: 'https://youtube.com'  },
  { id: uid(), label: 'GitHub',   url: 'https://github.com'   },
]);

function renderLinks() {
  linksGrid.innerHTML = '';

  if (links.length === 0) {
    linksGrid.innerHTML = '<span class="links-empty">No links yet. Add one above!</span>';
    store.set('links', links);
    return;
  }

  links.forEach(link => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const anchor = document.createElement('a');
    anchor.href   = link.url;
    anchor.target = '_blank';
    anchor.rel    = 'noopener noreferrer';
    anchor.textContent = link.label || link.url;
    anchor.style.cssText = 'text-decoration:none;color:inherit;';

    const del = document.createElement('button');
    del.className   = 'link-chip-delete';
    del.textContent = '✕';
    del.title       = 'Remove link';
    del.setAttribute('aria-label', `Remove link: ${link.label}`);
    del.addEventListener('click', e => {
      e.stopPropagation();
      links = links.filter(l => l.id !== link.id);
      renderLinks();
    });

    chip.appendChild(anchor);
    chip.appendChild(del);
    linksGrid.appendChild(chip);
  });

  store.set('links', links);
}

function isValidUrl(str) {
  try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
}

linkAddBtn.addEventListener('click', () => {
  const label = linkNameInput.value.trim();
  let   url   = linkUrlInput.value.trim();

  if (!url) { showToast('Please enter a URL.', 'error'); return; }

  // Auto-prefix protocol
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  if (!isValidUrl(url)) { showToast('Please enter a valid URL.', 'error'); return; }

  links.push({ id: uid(), label: label || url, url });
  renderLinks();
  linkNameInput.value = '';
  linkUrlInput.value  = '';
  linkNameInput.focus();
});

linkUrlInput.addEventListener('keydown', e => { if (e.key === 'Enter') linkAddBtn.click(); });
linkNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') linkUrlInput.focus(); });

// Init
renderLinks();
