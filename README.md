# Kanban ToDo Dashboard

A Kanban-style ToDo dashboard built with React, TypeScript, Redux Toolkit, React Query, Material UI, dnd-kit, and json-server.

## Features

- Display tasks across 4 columns:
  - Backlog
  - In Progress
  - Review
  - Done
- Create new tasks
- Update existing tasks
- Delete tasks
- Drag and drop tasks between columns
- Search tasks by title or description
- Pagination per column
- Data fetching and caching using React Query
- UI built with Material UI
- Local mock API using json-server

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- React Query
- Material UI
- dnd-kit
- Axios
- json-server
- Vite

## Project Structure

```txt
todo-kanban-dashboard/
├── public/
├── src/
│   ├── app/
│   │   ├── providers.tsx
│   │   └── store.ts
│   ├── features/
│   │   └── tasks/
│   │       ├── api/
│   │       │   └── tasksApi.ts
│   │       ├── components/
│   │       │   ├── KanbanBoard.tsx
│   │       │   ├── KanbanColumn.tsx
│   │       │   ├── SearchBar.tsx
│   │       │   ├── TaskCard.tsx
│   │       │   └── TaskDialog.tsx
│   │       ├── store/
│   │       │   └── taskUiSlice.ts
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

## Installation and Running Locally

Follow these steps to run the project on your machine.

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_LINK
```

Example:

```bash
git clone https://github.com/asaied7397/ToDoList
```

Then move into the project folder:

```bash
cd todo-kanban-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

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

### 5. Required Terminals

You need two terminals running at the same time:

```txt
Terminal 1: npm run server
Terminal 2: npm run dev
```

### 6. Build for Production

```bash
npm run build
```

### 7. Preview Production Build

```bash
npm run preview
```

## Available Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Starts the React development server          |
| `npm run server`  | Starts the json-server mock API on port 4000 |
| `npm run build`   | Builds the app for production                |
| `npm run preview` | Previews the production build locally        |

## Important Note

The frontend depends on the mock API server.

Make sure the mock API is running before using the app:

```bash
npm run server
```

If the mock API is not running, the app will not be able to load, create, update, delete, or move tasks.
