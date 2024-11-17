// Select elements
const themeToggle = document.getElementById("theme-toggle");
const newTaskInput = document.getElementById("new-task-input");
const addTaskButton = document.getElementById("add-task");
const todoList = document.getElementById("todo-list");
const searchBar = document.getElementById("search-bar");

// Load theme preference from localStorage
const loadTheme = () => {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("dark-mode");
    const icon = themeToggle.querySelector("i");
    icon.classList.add("fa-sun");
    icon.classList.remove("fa-moon");
  } else {
    document.body.classList.remove("dark-mode");
    const icon = themeToggle.querySelector("i");
    icon.classList.add("fa-moon");
    icon.classList.remove("fa-sun");
  }
};

// Toggle Theme and save the preference
themeToggle.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  const icon = themeToggle.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");

  // Save the dark mode preference in localStorage
  localStorage.setItem("darkMode", isDarkMode.toString());
});

// Load tasks from localStorage
const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed);
  });
};

// Create a task list item
const createTaskElement = (taskText, isCompleted = false) => {
  const listItem = document.createElement("li");
  listItem.classList.toggle("completed", isCompleted); // Apply strikethrough if completed
  listItem.innerHTML = `
    <input type="checkbox" class="task-check" ${isCompleted ? "checked" : ""}>
    <span>${taskText}</span>
    <button class="delete-task"><i class="fas fa-trash"></i></button>
  `;

  // Event: Mark as completed
  listItem.querySelector(".task-check").addEventListener("change", (e) => {
    listItem.classList.toggle("completed", e.target.checked);
    updateTaskInLocalStorage(taskText, e.target.checked);
    reorderTasks(); // Reorder tasks after completion
  });

  // Event: Delete task
  listItem.querySelector(".delete-task").addEventListener("click", () => {
    listItem.remove();
    removeTaskFromLocalStorage(taskText);
  });

  // Append to the task list
  todoList.appendChild(listItem);

  // Reorder tasks after appending
  reorderTasks();
};

// Save a new task to localStorage
const addTask = () => {
  const taskText = newTaskInput.value.trim();
  if (taskText !== "") {
    createTaskElement(taskText);

    // Add to localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    newTaskInput.value = ""; // Clear input field
  }
};

// Update the completion status of a task in localStorage
const updateTaskInLocalStorage = (taskText, isCompleted) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const taskIndex = tasks.findIndex(task => task.text === taskText);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = isCompleted;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
};

// Remove a task from localStorage
const removeTaskFromLocalStorage = (taskText) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const updatedTasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
};

// Reorder tasks so completed ones are at the bottom
const reorderTasks = () => {
  const tasks = Array.from(todoList.children);
  tasks.sort((a, b) => {
    const aCompleted = a.classList.contains("completed");
    const bCompleted = b.classList.contains("completed");

    // Completed tasks should go after active tasks
    return aCompleted ? 1 : bCompleted ? -1 : 0;
  });

  tasks.forEach(task => todoList.appendChild(task)); // Re-append in the sorted order
};

// Add Task Button Click
addTaskButton.addEventListener("click", addTask);

// Add Task on Enter Key
newTaskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Search Functionality
searchBar.addEventListener("input", () => {
  const searchValue = searchBar.value.toLowerCase();
  Array.from(todoList.children).forEach((item) => {
    const taskText = item.querySelector("span").textContent.toLowerCase();
    item.style.display = taskText.includes(searchValue) ? "" : "none";
  });
});

// Load theme and tasks when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();  // Load the theme on page load
  loadTasks();  // Load tasks from localStorage
});
