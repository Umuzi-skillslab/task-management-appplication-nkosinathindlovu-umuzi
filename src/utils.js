// Available priority levels used throughout the application.
const priorities = [1, 2, 3];

/*
    Save the current task list in the browser.
    The array is converted into JSON before saving.
*/
function saveToStorage(tasks) {
  try {
    if (!Array.isArray(tasks)) {
      throw new Error("Tasks must be an array.");
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error.message);
  }
}

/*
    Load tasks that were saved previously.
    If nothing exists, return an empty array.
*/
function loadFromStorage() {
  try {
    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
      return [];
    }

    return JSON.parse(savedTasks);
  } catch (error) {
    console.error("Could not load tasks:", error.message);
    return [];
  }
}

/*
    Generate a random ID.
    This helps keep every task unique.
*/
function generateRandomId() {
  return Math.floor(Math.random() * 1000000);
}

/*
    Remove extra spaces and make the first letter uppercase.
*/
function formatTaskName(name) {
  if (typeof name !== "string") {
    return "";
  }

  const cleanedName = name.trim();

  if (cleanedName.length === 0) {
    return "";
  }

  return cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
}

/*
    Check whether the task has the highest priority.
*/
function isHighPriority(task) {
  if (!task || typeof task.priority !== "number") {
    return false;
  }

  return task.priority === 3;
}

/*
    Return only completed tasks.
*/
function getCompletedTasks(tasks) {
  return tasks.filter(task => task.completed);
}

/*
    Return tasks that are still waiting to be completed.
*/
function getPendingTasks(tasks) {
  return tasks.filter(task => !task.completed);
}

/*
    Find a task using its ID.
*/
function findTaskById(tasks, id) {
  return tasks.find(task => task.id === id);
}

/*
    Calculate the total priority score.
*/
function calculatePriorityScore(tasks) {
  return tasks.reduce((total, task) => total + task.priority, 0);
}

/*
    Work out the average priority.
*/
function calculateAveragePriority(tasks) {
  if (tasks.length === 0) {
    return 0;
  }

  const total = calculatePriorityScore(tasks);

  return Number((total / tasks.length).toFixed(2));
}

/*
    Find the task with the highest priority.
*/
function getHighestPriorityTask(tasks) {
  if (tasks.length === 0) {
    return null;
  }

  return tasks.reduce((highest, current) =>
    current.priority > highest.priority ? current : highest
  );
}

/*
    Check if every task has been completed.
*/
function areAllTasksCompleted(tasks) {
  return tasks.every(task => task.completed);
}

/*
    Check whether there is at least one completed task.
*/
function hasCompletedTask(tasks) {
  return tasks.some(task => task.completed);
}

/*
    Create a new object while keeping the original one unchanged.
*/
function updateTask(task, updates) {
  return {
    ...task,
    ...updates
  };
}

/*
    Combine any number of task lists into one.
*/
function combineTaskLists(...lists) {
  return lists.flat();
}

/*
    Return a copy of the task details.
    Object destructuring keeps this function clean.
*/
function getTaskSummary(task) {
  const {
    id,
    title,
    description,
    priority,
    completed
  } = task;

  return {
    id,
    title,
    description,
    priority,
    completed
  };
}

/*
    Return only the task titles.
*/
function getTaskTitles(tasks) {
  return tasks.map(task => task.title);
}

/*
    Sort tasks from highest priority to lowest.
*/
function sortTasksByPriority(tasks) {
  return [...tasks].sort((a, b) => b.priority - a.priority);
}

/*
    Count completed tasks using recursion.
*/
function countCompletedTasks(tasks, index = 0) {
  if (!Array.isArray(tasks) || index >= tasks.length) {
    return 0;
  }

  return (
    (tasks[index].completed ? 1 : 0) +
    countCompletedTasks(tasks, index + 1)
  );
}

export {
  priorities,
  saveToStorage,
  loadFromStorage,
  generateRandomId,
  formatTaskName,
  isHighPriority,
  getCompletedTasks,
  getPendingTasks,
  findTaskById,
  calculatePriorityScore,
  calculateAveragePriority,
  getHighestPriorityTask,
  areAllTasksCompleted,
  hasCompletedTask,
  updateTask,
  combineTaskLists,
  getTaskSummary,
  getTaskTitles,
  sortTasksByPriority,
  countCompletedTasks
};