# Kanban ToDo Dashboard

A Kanban-style ToDo dashboard built with React, TypeScript, Redux Toolkit, React Query, Material UI, dnd-kit, and json-server.

The application allows users to manage tasks across multiple workflow columns with drag-and-drop, search, pagination, and task priority support.

---

## Features

- Display tasks across 4 Kanban columns:
  - To Do
  - In Progress
  - In Review
  - Done
- Create new tasks
- Update existing tasks
- Delete tasks
- Drag and drop tasks between columns
- Search tasks by title or description
- Pagination per column using page numbers
- Task priority support:
  - Low
  - Medium
  - High
- Add tasks directly to a selected column
- Display total task count in the board header
- Display task count per column
- React Query caching for server-state data
- Redux Toolkit for UI state management
- Material UI components and layout
- Local mock API using json-server
- Clean code structure with separated UI, hooks, constants, utilities, API logic, and Redux state

---

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- React Redux
- React Query
- Material UI
- dnd-kit
- Axios
- json-server
- Vite

---

## Task Fields

Each task contains:

- `id`
- `title`
- `description`
- `column`
- `priority`

Example:

```json
{
  "id": "1",
  "title": "Design homepage",
  "description": "Create hero section and main layout",
  "column": "backlog",
  "priority": "high"
}
```

---

## Project Structure

```txt
ToDoList/
├── public/
├── src/
│   ├── app/
│   │   ├── providers.tsx
│   │   └── store.ts
│   ├── features/
│   │   └── tasks/
│   │       ├── api/
│   │       │   └── tasksAPI.ts
│   │       ├── components/
│   │       │   ├── KanbanBoard.tsx
│   │       │   ├── KanbanColumn.tsx
│   │       │   ├── SearchBar.tsx
│   │       │   ├── TaskCard.tsx
│   │       │   └── TaskDialog.tsx
│   │       ├── constants/
│   │       │   └── tasksConstants.ts
│   │       ├── hooks/
│   │       │   ├── useColumnTasks.ts
│   │       │   ├── useKanbanDrag.ts
│   │       │   └── useTaskMutations.ts
│   │       ├── store/
│   │       │   └── taskUISlice.ts
│   │       ├── utils/
│   │       │   └── tasksUtils.ts
│   │       └── types.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── db.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

---

## Installation and Running Locally

Follow these steps to run the project on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/asaied7397/ToDoList
```

Then move into the project folder:

```bash
cd ToDoList
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run the Mock API Server

This project uses `json-server` as a local mock API.

Open the first terminal and run:

```bash
npm run server
```

The mock API will run on:

```txt
http://localhost:4000
```

You can test the tasks endpoint here:

```txt
http://localhost:4000/tasks
```

Keep this terminal running.

---

### 4. Run the React App

Open a second terminal and run:

```bash
npm run dev
```

The React app will run on:

```txt
http://localhost:5173
```

Open this URL in your browser:

```txt
http://localhost:5173
```

---

### 5. Required Terminals

You need two terminals running at the same time:

```txt
Terminal 1: npm run server
Terminal 2: npm run dev
```

---

### 6. Build for Production

```bash
npm run build
```

---

### 7. Preview Production Build

```bash
npm run preview
```

---

## Available Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Starts the React development server          |
| `npm run server`  | Starts the json-server mock API on port 4000 |
| `npm run build`   | Builds the app for production                |
| `npm run preview` | Previews the production build locally        |

---

## Important Note

The frontend depends on the mock API server.

Make sure the mock API is running before using the app:

```bash
npm run server
```

If the mock API is not running, the app will not be able to load, create, update, delete, or move tasks.

---

## State Management

The project uses two types of state management:

### React Query

React Query is used for server-state management, including:

- Fetching tasks
- Caching task data
- Refetching after create, update, delete, and drag-and-drop operations
- Managing loading and error states

Each column, search value, and page has its own query key.

Example:

```ts
["tasks", "backlog", "design", 1];
```

This allows React Query to cache different task results separately.

### Redux Toolkit

Redux Toolkit is used for local UI state, including:

- Search input value
- Dialog open or close state
- Selected task for editing
- Selected column for creating a task
- Current page number for each column

Example pagination state:

```ts
pages: {
  backlog: 1,
  in_progress: 1,
  review: 1,
  done: 1
}
```

---

## Drag and Drop

Drag-and-drop is implemented using `dnd-kit`.

The board is wrapped with `DndContext`.

Each task card uses `useDraggable`.

Each column uses `useDroppable`.

When a task is dropped into another column, the app sends a `PATCH` request to update the task column.

Example:

```txt
PATCH /tasks/1
```

Request body:

```json
{
  "column": "done"
}
```

After the update succeeds, React Query invalidates task queries and refetches the latest data.

---

## Pagination

Each column has its own pagination.

Pagination is displayed as:

```txt
Prev  1  2  3  Next
```

Each column can be on a different page.

Example:

```txt
To Do: Page 2
In Progress: Page 1
In Review: Page 3
Done: Page 1
```

When the search value changes, all column pages are reset to page 1.

---

## Search

The search bar filters tasks by:

- Task title
- Task description

The search value is stored in Redux and used by each column query.

---

## Priority

Each task has a priority value:

```ts
"low" | "medium" | "high";
```

Priority is displayed on each task card as a small colored chip.

Priority colors:

| Priority | Meaning           |
| -------- | ----------------- |
| Low      | Low importance    |
| Medium   | Normal importance |
| High     | High importance   |

---

## Code Organization

The project separates UI from logic for better readability and maintainability.

### Components

Responsible mainly for rendering UI.

```txt
components/
├── KanbanBoard.tsx
├── KanbanColumn.tsx
├── SearchBar.tsx
├── TaskCard.tsx
└── TaskDialog.tsx
```

### Hooks

Responsible for reusable logic.

```txt
hooks/
├── useColumnTasks.ts
├── useKanbanDrag.ts
└── useTaskMutations.ts
```

### Constants

Contains reusable static values.

```txt
constants/
└── tasksConstants.ts
```

### Utils

Contains helper functions.

```txt
utils/
└── tasksUtils.ts
```

### API

Contains API requests.

```txt
api/
└── tasksAPI.ts
```

### Store

Contains Redux Toolkit slice.

```txt
store/
└── taskUISlice.ts
```

---

## Mock API

The local mock API is powered by `json-server`.

Main endpoint:

```txt
http://localhost:4000/tasks
```

Supported operations:

| Method   | Endpoint     | Description |
| -------- | ------------ | ----------- |
| `GET`    | `/tasks`     | Get tasks   |
| `POST`   | `/tasks`     | Create task |
| `PATCH`  | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |

---

## Notes

- The app uses React Query for API data caching.
- Redux is used only for UI state, not API data.
- Dragging starts from the card body with an activation constraint to reduce accidental dragging.
- The mock API must be running for the app to work correctly.
- A live deployment may require replacing json-server with a hosted API or another mock backend.
