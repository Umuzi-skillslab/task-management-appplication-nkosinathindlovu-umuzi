# Task Manager

## Overview

A simple task management app built with modern JavaScript. You can add tasks, set their priority, mark them complete, and delete them. Tasks save to localStorage, so they're still there after a refresh.

The project started as a starter codebase full of intentional bugs and missing features. The goal was to find and fix all of it while applying proper JavaScript practices - OOP, functional programming, DOM manipulation, and testing with Jest.

## Errors Found

- var used instead of let/const, one variable declared with no keyword at all
- = used instead of === inside a conditional (sneaky one - silently overwrote data instead of throwing)
- == used in a few places instead of ===
- An off-by-one loop error and a separate infinite loop from a missing increment
- A function missing a required parameter
- A recursive function with no base case
- Task class missing an id property and a way to toggle completion
- SubTask never calling super(), breaking inheritance
- No destructuring, template literals, spread/rest, or ES6 modules anywhere
- Broken DOM selectors, no null checks before touching the page
- No event delegation, no JSON/localStorage handling
- Barely any real tests, no error handling anywhere

Full breakdown in issues-identified.txt.

## Fixes Implemented

- Replaced every var with let/const, fixed the == and = mistakes
- Fixed the loop bugs (off-by-one and the infinite loop)
- Added a proper base case to the recursive function
- Gave Task an id property and a toggleCompletion() method
- Fixed SubTask's missing super() call, expanded TaskManager
- Swapped manual loops for map/filter/reduce/find/some/every
- Added destructuring, template literals, spread/rest operators
- Split code into ES6 modules (app.js, dom.js, utils.js)
- Fixed DOM selectors, added null checks before any DOM access
- Added one delegated event listener for the whole task list
- Added JSON.stringify/JSON.parse and localStorage save/load
- Added try/catch blocks and parameter validation throughout

## Features Added

- Add, update, complete, and delete tasks
- Tasks persist automatically via localStorage
- Live task statistics (e.g. "2 of 5 completed")
- Add Task button disables itself until a title is typed
- Full ES6 module structure

## Running the Application

1. Clone or download the repo
2. Install dependencies:

```bash
npm install
```

3. The app uses ES6 modules, so opening index.html directly won't work (browsers block module imports over file://). Serve it locally instead:

```bash
npx serve .
```

4. Open the local address it prints (usually http://localhost:3000). Because chrome browser may block the file if its dragged and dropped, but they always accept it if it comes as a server

## Running the Tests

```bash
npm test
```

All 32 tests should pass.

## Screenshots

The screenshots folder has the app running, the console with no errors, and the Jest test results.

## Reflection

The trickiest bug was = instead of === in updateTaskPriority - it doesn't throw anything, it just quietly corrupts the task id, so it only shows up later once something else depends on that id being right. The missing super() in SubTask was the opposite: obvious immediately, since JavaScript won't let you touch `this` before super() runs in a subclass constructor.

Splitting everything into ES6 modules took some getting used to, mainly making sure app.js, dom.js, and utils.js imported and exported the right things. I also hit a CORS issue the first time I opened index.html directly, since ES modules can't load over file:// - had to serve it locally instead.