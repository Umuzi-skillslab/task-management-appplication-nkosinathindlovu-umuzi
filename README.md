# Task Manager

## Overview

This project is a simple task management application developed using modern JavaScript. It allows users to add tasks, update their priority, mark tasks as completed, and delete tasks when they are no longer needed. The application also stores tasks using **localStorage**, allowing them to remain available even after refreshing the browser.

The project was based on a starter codebase that contained several intentional errors and incomplete features. The aim of this project was to identify those issues, fix them, and improve the application by applying JavaScript best practices, object-oriented programming, functional programming techniques, DOM manipulation, and automated testing with Jest.

---

## Errors Found

During the review of the starter code, several problems were identified across different areas of the project. Some of the major issues included:

* Variables declared using `var` instead of `let` or `const`.
* Missing variable declarations that created unintended global variables.
* Incorrect use of comparison operators such as `==` and assignment operators (`=`) inside conditions.
* Loop errors, including off-by-one mistakes and an infinite loop.
* Functions with missing parameters and incomplete logic.
* Missing validation and error handling.
* Classes with missing properties and methods.
* Incorrect inheritance caused by a missing `super()` call.
* No use of modern JavaScript features such as destructuring, template literals, spread operators, or rest parameters.
* Incorrect DOM selectors and missing event handling.
* No support for saving data using JSON and `localStorage`.
* Incomplete Jest tests with limited coverage.

A complete list of identified issues is included in the **issues-identified.txt** document.

---

## Fixes Implemented

The following improvements were made to complete the project:

* Replaced all `var` declarations with `let` and `const`.
* Corrected comparison and assignment operator mistakes.
* Fixed all loop and conditional statement errors.
* Added parameter validation and meaningful error messages.
* Implemented proper recursion with a base case.
* Added unique task IDs and a method for marking tasks as completed.
* Corrected inheritance by adding the missing `super()` call.
* Improved the `TaskManager` object by adding additional methods.
* Replaced repetitive loops with modern array methods such as `map()`, `filter()`, `reduce()`, `find()`, `some()`, and `every()`.
* Added object and array destructuring where appropriate.
* Used template literals throughout the project to improve readability.
* Implemented spread and rest operators to simplify data handling.
* Fixed DOM selectors and improved event handling.
* Added `JSON.stringify()` and `JSON.parse()` for saving and loading task data.
* Implemented `localStorage` to preserve tasks between browser sessions.
* Added multiple `try...catch` blocks and input validation to improve reliability.

---

## Features Added

The completed application includes several additional features, including:

* Creating new tasks.
* Updating task priority.
* Marking tasks as completed.
* Deleting tasks.
* Automatic saving using `localStorage`.
* Automatic loading of saved tasks.
* Task statistics.
* Modern JavaScript features such as destructuring, template literals, spread operators, and ES6 modules.

---

## Running the Application

1. Clone or download the project.
2. Open the project folder.
3. Install the project dependencies by running:

```bash
npm install
```

4. Start the application by opening **index.html** in your browser.

---

## Running the Tests

Run the following command to execute the Jest test suite:

```bash
npm test
```

All tests should pass successfully after the project has been completed.

---

## Screenshots

The **screenshots** folder contains images showing:

* The application running successfully in the browser.
* The browser console without any errors.
* Jest test results.
* The completed task management interface.

---

## Reflection

Working on this project improved my understanding of debugging JavaScript applications and applying modern JavaScript features. One of the biggest challenges was identifying logical errors that did not immediately produce visible errors, such as incorrect comparison operators and loop conditions. Another challenge was restructuring the project into separate ES6 modules while ensuring that all files communicated correctly using imports and exports.

Overall, this project strengthened my understanding of JavaScript fundamentals, object-oriented programming, functional programming, DOM manipulation, error handling, and testing with Jest.
