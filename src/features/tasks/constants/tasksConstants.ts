import type { ColumnConfig, TaskColumn, TaskPriority } from "../types";

export const PAGE_LIMIT = 5;

export const columns: ColumnConfig[] = [
  { id: "backlog", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "In Review" },
  { id: "done", title: "Done" },
];

export const columnOptions: { label: string; value: TaskColumn }[] = [
  { label: "To Do", value: "backlog" },
  { label: "In Progress", value: "in_progress" },
  { label: "In Review", value: "review" },
  { label: "Done", value: "done" },
];

export const priorityOptions: { label: string; value: TaskPriority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const columnColors: Record<TaskColumn, string> = {
  backlog: "#1976d2",
  in_progress: "#f59e0b",
  review: "#ed0bf5",
  done: "#2e7d32",
};
