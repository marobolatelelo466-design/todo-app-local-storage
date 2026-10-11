const STORAGE_KEY = "todo-app-items";
const THEME_KEY = "todo-app-theme";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const themeToggle = document.getElementById("theme-toggle");

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Initialize theme
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  const isDarkMode = savedTheme === "dark";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    updateThemeIcon(true);
  } else {
    document.body.classList.remove("dark-mode");
    updateThemeIcon(false);
  }
}

function updateThemeIcon(isDarkMode) {
  const icon = document.querySelector(".theme-icon");
  icon.textContent = isDarkMode ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
  updateThemeIcon(isDarkMode);
});

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-item empty-state";
    empty.textContent = "No tasks yet. Add one above!";
    list.appendChild(empty);
  } else {
    todos.forEach((todo) => {
      const item = document.createElement("li");
      item.className = `todo-item ${todo.completed ? "completed" : ""}`;

      const left = document.createElement("div");
      left.className = "todo-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        saveTodos();
        renderTodos();
      });

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = todo.text;

      left.appendChild(checkbox);
      left.appendChild(text);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        todos = todos.filter((t) => t.id !== todo.id);
        saveTodos();
        renderTodos();
      });

      item.appendChild(left);
      item.appendChild(deleteBtn);
      list.appendChild(item);
    });
  }

  const remainingTasks = todos.filter((todo) => !todo.completed).length;
  taskCount.textContent =
    remainingTasks === 1 ? "1 task left" : `${remainingTasks} tasks left`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  todos.unshift({
    id: Date.now(),
    text,
    completed: false,
  });

  input.value = "";
  saveTodos();
  renderTodos();
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

// Initialize app
initTheme();
renderTodos();
