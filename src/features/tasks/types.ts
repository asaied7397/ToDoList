export type TaskColumn = "backlog" | "in_progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: TaskColumn;
  priority: TaskPriority;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  column: TaskColumn;
  priority: TaskPriority;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  column?: TaskColumn;
  priority?: TaskPriority;
}

export interface ColumnConfig {
  id: TaskColumn;
  title: string;
}
