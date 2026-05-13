export type TaskColumn = "backlog" | "in_progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: TaskColumn;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  column: TaskColumn;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  column?: TaskColumn;
}

export interface ColumnConfig {
  id: TaskColumn;
  title: string;
}
