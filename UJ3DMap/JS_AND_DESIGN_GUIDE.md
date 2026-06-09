# Beginner's Guide: JavaScript & System Design for UJ3DMap

Welcome to the UJ3DMap project! If you are a total beginner to JavaScript, this guide is written specifically for you. It will explain the core concepts of the language, how they apply to the code already written, and the high-level system design principles guiding each phase of the Product Requirements Document (PRD).

---

## Part 1: Core JavaScript Fundamentals

Before we look at the map or the routing, you need to understand the basic building blocks of JavaScript used in this project.

### 1. Variables (`const` and `let`)
Variables are containers for storing data. In modern JavaScript (ES6), we use `const` and `let`.
*   `const`: Used when the value **will not change**. It stands for "constant".
*   `let`: Used when the value **can change** later.
*   *Example from our code:* `let minDistance = Infinity;` (We expect this to change as we calculate distances). `const R = 6371000;` (The radius of the Earth never changes, so it's a constant).

### 2. Functions
Functions are reusable blocks of code that perform a specific task. They take an "input" (arguments), do some work, and often "return" an "output".
```javascript
// A simple function that adds two numbers
function addNumbers(a, b) {
  return a + b;
}
```
In our project, we have functions like `initMap()` which takes a container ID and map data to create the visual map.

### 3. Objects and Arrays
*   **Arrays (`[]`)**: A list of items in a specific order. Useful for storing lists of coordinates or a sequence of steps.
    *   *Example:* `const coordinates = [9.952, 8.892];`
*   **Objects (`{}`)**: A collection of key-value pairs. Think of it like a dictionary where you look up a word (key) to find its definition (value).
    *   *Example:* `const feature = { type: "LineString", name: "Main Road" };`
    *   You access the name by writing `feature.name`.

### 4. ES6 Modules (`import` and `export`)
When a project gets large, you shouldn't put all your code in one file. ES6 Modules allow you to split code into separate files.
*   `export`: Makes a function or variable available for other files to use.
*   `import`: Brings in a function from another file.
*   *Example:* In `app.js`, we use `import { initMap } from './map.js';` to bring in the map logic from the `map.js` file.

---

## Part 2: System Design & The PRD Phases

### Why "Vanilla" JavaScript? (System Design Principle)
The PRD states this project uses "Pure Vanilla JavaScript" and no frameworks like React. **Why?**
A framework like React makes building complex user interfaces easier, but it requires downloading a lot of extra code to the user's browser. Since UJ3DMap must work **offline** on mobile devices (often with slow internet or low storage), we must keep the "payload" (the size of our code) as tiny as possible. Pure JS is the fastest and lightest approach.

### Separation of Concerns (System Design Principle)
We divide our codebase so each file has exactly **one** job. 
*   `app.js`: The "manager". It starts everything up but does no heavy lifting itself.
*   `map.js`: Handles everything visual related to Leaflet.
*   `routing.js`: Handles all the complex math for finding directions. It knows *nothing* about the screen or the map visuals.
*   This makes the code much easier to read, test, and debug!

---

## Phase 1: Core Foundation & UI (2D Leaflet Map)

**What is happening here?**
We use a library called **Leaflet**. Leaflet is a piece of pre-written JavaScript that specializes in drawing interactive maps.
1.  **The DOM (Document Object Model):** In `index.html`, there is a `<main id="map"></main>`. This is an empty box.
2.  **Initialization:** In `map.js`, we tell Leaflet to find that empty box and inject map tiles (images of the world) into it: `const map = L.map('map')`.
3.  **GeoJSON:** We use a standardized format called GeoJSON to tell the map where buildings and roads are. The map reads this JSON (a large JavaScript Object) and draws lines and polygons over the tiles.

---

## Phase 2: Client-side Offline Routing (`routing.js`)

**What is happening here?**
This is the most complex part of the app. How does the app know the fastest way from the Library to the Hostel? It uses **Graph Theory** and **Dijkstra's Algorithm**.

### 1. The Graph (Nodes and Edges)
Before we can find a path, the computer needs to understand the roads. We convert our map into a "Graph".
*   **Nodes:** Intersections or points on a road.
*   **Edges:** The roads connecting the intersections.
*   **Adjacency List:** An Object we build in JavaScript where the "keys" are the Nodes, and the "values" are Arrays of all connecting Edges and their distances.

### 2. Dijkstra's Algorithm (How it works in plain English)
Imagine you are exploring a maze to find the exit:
1.  You start at the beginning (Start Node).
2.  You look at all paths leading away from you and calculate the distance to the next intersection.
3.  You walk down the shortest path first.
4.  At the new intersection, you repeat the process. If you find a new, faster way to reach an intersection you've already seen, you update your notes.
5.  You keep doing this until you hit the Destination. The algorithm guarantees you found the absolute shortest path.

In `routing.js`, `findShortestPath()` does exactly this using JavaScript loops and objects!

---

## Future Phases (3-5): Backend & Heatmaps

Right now, our app is entirely "Client-Side" (it runs entirely on the user's phone/computer). In Phase 3, we will introduce a "Backend" using **Supabase** (a database in the cloud).
*   **Data Aggregation:** For crowdsourced heatmaps (e.g., finding where power is available), users will send tiny messages to the Supabase database. Supabase will collect thousands of these, calculate the averages (aggregation), and send a clean summary back to Leaflet to draw colorful "heat" spots on the map.
*   **Vector Search:** This is an AI feature! Instead of just matching exact words, it converts sentences into numbers (vectors) to understand the *meaning* of a search like "Where can I read at night?".

---
*Happy Coding! Take it one file at a time, and rely on `console.log()` to see what your code is doing.*
