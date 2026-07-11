// DOM manipulation layer - this is the only file allowed to touch
// `document` directly. It renders tasks to the page, wires up all the
// event listeners, and connects the app's data (from app.js) to
// persistent storage (from utils.js).

import { addTask, taskList, TaskManager } from "./app.js";
import { saveToStorage, loadFromStorage } from "./utils.js";

/*
    Render every task in taskList into the #task-list container.
    Clears out old content first so tasks never get duplicated
    on re-render.
*/
function displayTasks() {
    const container = document.getElementById("task-list");

    if (!container) {
        console.error("displayTasks: #task-list element was not found.");
        return;
    }

    container.innerHTML = "";

    if (taskList.length === 0) {
        container.innerHTML = "<p>No tasks yet. Add one above.</p>";
        return;
    }

    for (const task of taskList) {
        const { id, title, description, priority, completed } = task;

        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        taskDiv.dataset.taskId = id;

        taskDiv.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
            <p>Priority: ${priority} | Status: ${completed ? "Completed" : "Pending"}</p>
            <button class="toggle-btn" data-action="toggle">Toggle Done</button>
            <button class="delete-btn" data-action="delete">Delete</button>
        `;

        container.appendChild(taskDiv);
    }

    renderStatistics();
}

/*
    Show a simple count of completed vs total tasks.
*/
function renderStatistics() {
    const statsContainer = document.querySelector(".statistics");

    if (!statsContainer) {
        return;
    }

    const completedCount = taskList.filter(task => task.completed).length;
    statsContainer.innerHTML = `<p>${completedCount} of ${taskList.length} tasks completed</p>`;
}

/*
    Handle submitting the "Add Task" form.
*/
function handleAddTask(event) {
    event.preventDefault();

    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const priorityInput = document.getElementById("priority");

    if (!titleInput || !descInput) {
        console.error("handleAddTask: required input fields were not found.");
        return;
    }

    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const priority = priorityInput ? Number(priorityInput.value) : 1;

    if (title.length === 0) {
        console.warn("handleAddTask: a task title is required.");
        return;
    }

    const newTask = addTask(title, description, priority);

    if (newTask) {
        saveToStorage(taskList);
        displayTasks();
        titleInput.value = "";
        descInput.value = "";
    }
}

/*
    Handle clicks anywhere inside the task list using event delegation,
    instead of attaching a separate listener to every single task.
    This means newly added tasks are handled automatically too.
*/
function handleTaskListClick(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const taskDiv = button.closest("[data-task-id]");

    if (!taskDiv) {
        return;
    }

    const taskId = Number(taskDiv.dataset.taskId);
    const task = taskList.find(t => t.id === taskId);

    if (!task) {
        return;
    }

    if (button.dataset.action === "toggle") {
        task.completed = !task.completed;
    } else if (button.dataset.action === "delete") {
        const index = taskList.findIndex(t => t.id === taskId);
        if (index !== -1) {
            taskList.splice(index, 1);
        }
    }

    saveToStorage(taskList);
    displayTasks();
}

/*
    Keeps the Add Task button disabled until the title field has
    actual content, preventing empty tasks from ever being submitted.
*/
function handleTitleInput(event) {
    const addButton = document.querySelector(".add-task-btn");
    if (!addButton) {
        return;
    }
    addButton.disabled = event.target.value.trim().length === 0;
}

/*
    Attach every event listener the app needs.
*/
function setupEventListeners() {
    const addButton = document.querySelector(".add-task-btn");
    const form = document.querySelector(".add-task-section");
    const taskListContainer = document.getElementById("task-list");
    const titleInput = document.getElementById("title");

    if (form) {
        form.addEventListener("submit", handleAddTask);
    } else if (addButton) {
        // Fallback in case the button isn't inside a <form>.
        addButton.addEventListener("click", handleAddTask);
    } else {
        console.error("setupEventListeners: add-task button/form not found.");
    }

    if (taskListContainer) {
        taskListContainer.addEventListener("click", handleTaskListClick);
    } else {
        console.error("setupEventListeners: #task-list not found.");
    }

    if (titleInput) {
        titleInput.addEventListener("input", handleTitleInput);
        // Start disabled, since the title field is empty on page load.
        if (addButton) {
            addButton.disabled = true;
        }
    }

    window.addEventListener("beforeunload", () => saveToStorage(taskList));
}

/*
    Bring back any tasks saved from a previous session before the
    first render.
*/
function restoreSavedTasks() {
    const savedTasks = loadFromStorage();

    for (const savedTask of savedTasks) {
        taskList.push(savedTask);
    }
}

// Wait until the page has fully loaded before touching the DOM at all.
document.addEventListener("DOMContentLoaded", () => {
    restoreSavedTasks();
    setupEventListeners();
    displayTasks();
    console.log(`Task Manager ready. ${TaskManager.getTotalTasks()} task(s) loaded.`);
});