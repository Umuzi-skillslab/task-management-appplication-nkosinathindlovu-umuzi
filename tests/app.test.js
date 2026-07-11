import {
    Task,
    SubTask,
    taskList,
    addTask,
    findTaskByTitle,
    updateTaskPriority,
    getTaskDetails,
    mergeTasks,
    getHighPriorityTasks,
    TaskManager
} from "../src/app.js";

import {
    saveToStorage,
    loadFromStorage,
    formatTaskName,
    isHighPriority,
    getCompletedTasks,
    getPendingTasks,
    findTaskById,
    calculateAveragePriority,
    getHighestPriorityTask,
    areAllTasksCompleted,
    hasCompletedTask,
    updateTask,
    combineTaskLists,
    sortTasksByPriority,
    countCompletedTasks
} from "../src/utils.js";

// Reset the shared taskList before every test so tests don't affect
// each other's results.
beforeEach(() => {
    taskList.splice(0, taskList.length);
    localStorage.clear();
});

describe("Task class", () => {
    test("creates a task with the expected properties", () => {
        const task = new Task("write report", "quarterly summary", 2);
        expect(task.title).toBe("Write report"); // formatTaskName capitalises it
        expect(task.description).toBe("quarterly summary");
        expect(task.priority).toBe(2);
        expect(task.completed).toBe(false);
        expect(typeof task.id).toBe("number");
    });

    test("getInfo returns a formatted string", () => {
        const task = new Task("Test Task", "Description", 3);
        expect(task.getInfo()).toBe("Task: Test Task | Priority: 3");
    });

    test("toggleCompletion flips the completed flag", () => {
        const task = new Task("Test Task", "Description", 1);
        expect(task.completed).toBe(false);
        task.toggleCompletion();
        expect(task.completed).toBe(true);
    });

    test("throws an error when priority is not a number (edge case)", () => {
        expect(() => new Task("Bad Task", "desc", "high")).toThrow();
    });
});

describe("SubTask inheritance", () => {
    test("SubTask inherits Task properties and adds parentTask", () => {
        const sub = new SubTask("Sub-step", "part of a bigger task", 1, "Write report");
        expect(sub).toBeInstanceOf(Task);
        expect(sub.parentTask).toBe("Write report");
    });

    test("SubTask.getInfo extends the parent implementation", () => {
        const sub = new SubTask("Sub-step", "desc", 2, "Parent title");
        expect(sub.getInfo()).toContain("Parent title");
        expect(sub.getInfo()).toContain("Sub-step");
    });
});

describe("Task functions", () => {
    test("addTask creates a task and adds it to taskList", () => {
        const task = addTask("New Task", "Test", 2);
        expect(task).not.toBeNull();
        expect(taskList).toHaveLength(1);
    });

    test("addTask returns null for invalid input instead of throwing (edge case)", () => {
        const result = addTask("Bad Task", "desc", "not a number");
        expect(result).toBeNull();
        expect(taskList).toHaveLength(0);
    });

    test("findTaskByTitle finds an existing task", () => {
        addTask("Findable Task", "desc", 1);
        const found = findTaskByTitle("Findable Task");
        expect(found).toBeDefined();
    });

    test("findTaskByTitle returns undefined for a missing task (edge case)", () => {
        expect(findTaskByTitle("Does Not Exist")).toBeUndefined();
    });

    test("updateTaskPriority updates an existing task", () => {
        const task = addTask("Priority Task", "desc", 1);
        const updated = updateTaskPriority(task.id, 3);
        expect(updated).toBe(true);
        expect(task.priority).toBe(3);
    });

    test("updateTaskPriority returns false for an unknown id (edge case)", () => {
        expect(updateTaskPriority(999999, 3)).toBe(false);
    });

    test("getTaskDetails destructures the expected fields", () => {
        const task = addTask("Details Task", "desc", 2);
        const details = getTaskDetails(task);
        expect(details).toEqual({
            title: "Details Task",
            description: "desc",
            priority: 2,
            completed: false
        });
    });

    test("mergeTasks combines multiple lists via the spread operator", () => {
        const merged = mergeTasks([1, 2], [3, 4], [5]);
        expect(merged).toEqual([1, 2, 3, 4, 5]);
    });

    test("getHighPriorityTasks filters by minimum priority", () => {
        addTask("Low", "desc", 1);
        addTask("High", "desc", 3);
        expect(getHighPriorityTasks(2)).toHaveLength(1);
    });
});

describe("TaskManager object", () => {
    test("getTotalTasks reflects the current task count", () => {
        addTask("One", "desc", 1);
        addTask("Two", "desc", 1);
        expect(TaskManager.getTotalTasks()).toBe(2);
    });

    test("listTitles maps tasks down to just their titles", () => {
        addTask("First", "desc", 1);
        expect(TaskManager.listTitles()).toEqual(["First"]);
    });

    test("countWhere accepts a custom predicate (higher-order function)", () => {
        addTask("Low", "desc", 1);
        addTask("High", "desc", 3);
        expect(TaskManager.countWhere(t => t.priority === 3)).toBe(1);
    });
});

describe("Storage functions (utils.js)", () => {
    test("saveToStorage and loadFromStorage round-trip correctly", () => {
        const sampleTasks = [{ id: 1, title: "A", completed: false }];
        saveToStorage(sampleTasks);
        expect(loadFromStorage()).toEqual(sampleTasks);
    });

    test("loadFromStorage returns an empty array when nothing is saved (edge case)", () => {
        expect(loadFromStorage()).toEqual([]);
    });
});

describe("Utility helper functions (utils.js)", () => {
    test("formatTaskName trims and capitalises", () => {
        expect(formatTaskName("  buy groceries")).toBe("Buy groceries");
    });

    test("isHighPriority returns a real boolean", () => {
        expect(isHighPriority({ priority: 3 })).toBe(true);
        expect(isHighPriority({ priority: 1 })).toBe(false);
    });

    test("getCompletedTasks and getPendingTasks split correctly", () => {
        const tasks = [{ completed: true }, { completed: false }];
        expect(getCompletedTasks(tasks)).toHaveLength(1);
        expect(getPendingTasks(tasks)).toHaveLength(1);
    });

    test("findTaskById finds the right task", () => {
        const tasks = [{ id: 1 }, { id: 2 }];
        expect(findTaskById(tasks, 2)).toEqual({ id: 2 });
    });

    test("calculateAveragePriority returns 0 for an empty array (edge case)", () => {
        expect(calculateAveragePriority([])).toBe(0);
    });

    test("getHighestPriorityTask finds the top task", () => {
        const tasks = [{ priority: 1 }, { priority: 3 }, { priority: 2 }];
        expect(getHighestPriorityTask(tasks).priority).toBe(3);
    });

    test("areAllTasksCompleted and hasCompletedTask work correctly", () => {
        const tasks = [{ completed: true }, { completed: false }];
        expect(areAllTasksCompleted(tasks)).toBe(false);
        expect(hasCompletedTask(tasks)).toBe(true);
    });

    test("updateTask returns a new object without mutating the original", () => {
        const original = { id: 1, priority: 1 };
        const updated = updateTask(original, { priority: 3 });
        expect(updated.priority).toBe(3);
        expect(original.priority).toBe(1); // unchanged - proves it's a pure function
    });

    test("combineTaskLists merges any number of arrays via rest parameters", () => {
        expect(combineTaskLists([1], [2, 3], [4])).toEqual([1, 2, 3, 4]);
    });

    test("sortTasksByPriority orders highest first without mutating the input", () => {
        const tasks = [{ priority: 1 }, { priority: 3 }];
        const sorted = sortTasksByPriority(tasks);
        expect(sorted[0].priority).toBe(3);
        expect(tasks[0].priority).toBe(1); // original order unchanged
    });

    test("countCompletedTasks counts recursively with a proper base case", () => {
        const tasks = [{ completed: true }, { completed: false }, { completed: true }];
        expect(countCompletedTasks(tasks)).toBe(2);
    });

    test("countCompletedTasks returns 0 for an empty array (edge case)", () => {
        expect(countCompletedTasks([])).toBe(0);
    });
});