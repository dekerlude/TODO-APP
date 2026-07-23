const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (!saved) {
    return;
  }

  try {
    tasks = JSON.parse(saved);
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  if (!tasks.length) {
    taskList.innerHTML = '<li class="empty">No tasks yet. Add one.</li>';
    return;
  }

  taskList.innerHTML = tasks
    .map((task) => {
      return `
        <li class="task-item${task.completed ? ' completed' : ''}" data-id="${task.id}">
          <label>
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
          </label>
          <div class="task-buttons">
            <button class="delete-btn">Delete</button>
          </div>
        </li>
      `;
    })
    .join('');
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    return;
  }

  tasks.push({ id: Date.now(), text, completed: false });
  saveTasks();
  taskInput.value = '';
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

taskList.addEventListener('click', (event) => {
  const item = event.target.closest('.task-item');
  if (!item) {
    return;
  }

  const id = Number(item.dataset.id);
  if (event.target.matches('input[type="checkbox"]')) {
    toggleTask(id);
  }

  if (event.target.matches('.delete-btn')) {
    deleteTask(id);
  }
});

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

loadTasks();
renderTasks();
