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

## Structure

src/
├─ app/
│ ├─ providers.tsx
│ └─ store.ts
├─ features/
│ └─ tasks/
│ ├─ api/
│ │ └─ tasksApi.ts
│ ├─ components/
│ │ ├─ KanbanBoard.tsx
│ │ ├─ KanbanColumn.tsx
│ │ ├─ SearchBar.tsx
│ │ ├─ TaskCard.tsx
│ │ └─ TaskDialog.tsx
│ ├─ store/
│ │ └─ taskUiSlice.ts
│ └─ types.ts
├─ App.tsx
├─ main.tsx
└─ index.css
