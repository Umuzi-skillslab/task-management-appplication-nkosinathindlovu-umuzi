// Core application logic: the Task/SubTask classes and functions that
// create, find, and manage tasks. This file focuses purely on data and
// Expected behavior - no DOM code lives here, so it can be tested without a browser.

import { formatTaskName, isHighPriority, findTaskById } from "./utils.js";

// This array stores every task that gets created while the app is running.
const taskList = [];
// This number helps us give every task its own unique ID.
let taskCounter = 0;

/*
    This class is used whenever a new task is created.
    Each task stores its own information and can update itself.
*/
class Task {
    constructor(title, description, priority) {
        // Check that the title is actually text.
        if (typeof title !== "string") {
            throw new Error("Task title must be a string.");
        }
        // Check that the description is text.
        if (typeof description !== "string") {
            throw new Error("Task description must be a string.");
        }
        // Priority should always be a number.
        if (typeof priority !== "number") {
            throw new Error("Priority must be a number.");
        }

        this.id = ++taskCounter;
        this.title = formatTaskName(title);
        this.description = description.trim();
        this.priority = priority;
        this.completed = false;
    }

    // Switch the task between complete and incomplete.
    toggleCompletion() {
        this.completed = !this.completed;
    }

    // Return a simple description of the task.
    getInfo() {
        return `Task: ${this.title} | Priority: ${this.priority}`;
    }
}

/*
    A sub task works exactly like a normal task,
    but it also remembers which parent task it belongs to.
*/
class SubTask extends Task {
    constructor(title, description, priority, parentTask) {
        super(title, description, priority);

        if (typeof parentTask !== "string") {
            throw new Error("parentTask must be a string.");
        }

        this.parentTask = parentTask;
    }

    getInfo() {
        return `${super.getInfo()} | Parent Task: ${this.parentTask}`;
    }
}

/*
    Create a new task and save it in the task list.
*/
function addTask(title, description, priority) {
    try {
        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            typeof priority !== "number"
        ) {
            throw new Error("Invalid task information.");
        }

        const newTask = new Task(title, description, priority);
        taskList.push(newTask);
        return newTask;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

/*
    Display every task inside the console.
    This function is mainly useful while debugging.
*/
function displayAllTasks() {
    if (taskList.length === 0) {
        console.log("No tasks available.");
        return;
    }

    for (const task of taskList) {
        console.log(task.getInfo());
    }
}

/*
    Find the first task that matches the given title exactly.
    Returns undefined if nothing matches.
*/
function findTaskByTitle(title) {
    if (typeof title !== "string") {
        console.error("findTaskByTitle: title must be a string.");
        return undefined;
    }

    for (const task of taskList) {
        if (task.title === title) {
            return task;
        }
    }

    return undefined;
}

/*
    Update the priority of an existing task, found by its ID.
    Reuses findTaskById from utils.js instead of writing the
    same lookup logic twice.
*/
function updateTaskPriority(taskId, newPriority) {
    try {
        if (typeof taskId !== "number" || typeof newPriority !== "number") {
            throw new Error("taskId and newPriority must both be numbers.");
        }

        const task = findTaskById(taskList, taskId);

        if (!task) {
            return false;
        }

        task.priority = newPriority;
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

/*
    Pull out just the fields a caller usually needs from a task,
    using object destructuring instead of reading each one manually.
*/
function getTaskDetails(task) {
    if (!task) {
        console.error("getTaskDetails: a task is required.");
        return null;
    }

    const { title, description, priority, completed } = task;
    return { title, description, priority, completed };
}

/*
    Combine any number of task arrays into a single array
    using the spread operator.
*/
function mergeTasks(...taskLists) {
    return taskLists.reduce((merged, list) => [...merged, ...list], []);
}

/*
    Return only tasks at or above the given priority.
*/
function getHighPriorityTasks(minPriority) {
    if (typeof minPriority !== "number") {
        console.error("getHighPriorityTasks: minPriority must be a number.");
        return [];
    }

    return taskList.filter(task => task.priority >= minPriority);
}

/*
    A single object that groups together higher-level operations
    on the whole task list, rather than scattering them as loose functions.
*/
const TaskManager = {
    tasks: taskList,

    getTotalTasks() {
        return this.tasks.length;
    },

    // Returns just the titles of every task - a small example of
    // map() used as a higher-order function.
    listTitles() {
        return this.tasks.map(task => task.title);
    },

    // Accepts any predicate function and counts matching tasks,
    // which makes this itself a higher-order function.
    countWhere(predicate) {
        if (typeof predicate !== "function") {
            throw new Error("countWhere requires a predicate function.");
        }
        return this.tasks.filter(predicate).length;
    },

    countHighPriority() {
        return this.countWhere(isHighPriority);
    }
};

export {
    Task,
    SubTask,
    taskList,
    addTask,
    displayAllTasks,
    findTaskByTitle,
    updateTaskPriority,
    getTaskDetails,
    mergeTasks,
    getHighPriorityTasks,
    TaskManager
};