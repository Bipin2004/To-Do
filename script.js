// References
const taskForm = document.getElementById('form');
const taskInput = document.getElementById('input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const toast = document.getElementById('toast');
const darkToggle = document.getElementById('dark-toggle');

let currentFilter = 'all';

// Show Toast Message
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Get tasks from localStorage
function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'flex justify-between items-center p-3 bg-gray-100 dark:bg-zinc-700 rounded transition-all';

  const text = document.createElement('span');
  text.textContent = task.text;
  text.className = task.completed
    ? 'line-through text-gray-500 dark:text-gray-400'
    : 'text-gray-800 dark:text-white';

  const buttons = document.createElement('div');
  buttons.className = 'flex gap-2';

  const completeButton = document.createElement('button');
  completeButton.textContent = 'Complete';
  completeButton.className = 'text-green-600 hover:underline';
  completeButton.addEventListener('click', () => {
    toggleComplete(task.id);
  });

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.className = 'text-blue-600 hover:underline';
  editButton.addEventListener('click', () => {
    editTask(task.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'text-red-600 hover:underline';
  deleteButton.addEventListener('click', () => {
    deleteTask(task.id);
    showToast('Task Deleted!');
  });

  buttons.append(completeButton, editButton, deleteButton);
  li.append(text, buttons);

  return li;
}

// Render tasks based on filter
function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  let tasks = getTasks();

  if (filter === 'completed') {
    tasks = tasks.filter(task => task.completed);
  } else if (filter === 'pending') {
    tasks = tasks.filter(task => !task.completed);
  }

  // Newest first
  tasks.sort((a, b) => b.id - a.id);

  tasks.forEach(task => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });
}

// Add new task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text !== '') {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };
    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks(currentFilter);
    taskInput.value = '';
    showToast('Task Added!');
  }
});

function toggleComplete(id) {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks(currentFilter);
    showToast('Task Updated!');
  }
}

function editTask(id) {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    const newText = prompt('Edit your task:', tasks[index].text);
    if (newText !== null && newText.trim() !== '') {
      tasks[index].text = newText.trim();
      saveTasks(tasks);
      renderTasks(currentFilter);
      showToast('Task Edited!');
    }
  }
}

function deleteTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter(task => task.id !== id);
  saveTasks(tasks);
  renderTasks(currentFilter);
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.getAttribute('data-filter');
    renderTasks(currentFilter);
  });
});

// Dark mode
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

renderTasks();
