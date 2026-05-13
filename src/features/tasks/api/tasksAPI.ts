import axios from "axios";
import type {
  CreateTaskPayload,
  Task,
  TaskColumn,
  UpdateTaskPayload,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

export interface GetTasksParams {
  column: TaskColumn;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetTasksResponse {
  tasks: Task[];
  totalCount: number;
}

type JsonServerV1PaginatedResponse<T> = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
};

function isPaginatedResponse<T>(
  value: unknown,
): value is JsonServerV1PaginatedResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as JsonServerV1PaginatedResponse<T>).data)
  );
}

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function extractTasks(
  data: Task[] | JsonServerV1PaginatedResponse<Task>,
): Task[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (isPaginatedResponse<Task>(data)) {
    return data.data;
  }

  return [];
}

export async function getTasksByColumn({
  column,
  search = "",
  page = 1,
  limit = 5,
}: GetTasksParams): Promise<GetTasksResponse> {
  const response = await api.get<Task[] | JsonServerV1PaginatedResponse<Task>>(
    "/tasks",
    {
      params: {
        column,
      },
    },
  );

  const allColumnTasks = extractTasks(response.data);

  const normalizedSearch = normalizeText(search);

  const filteredTasks = normalizedSearch
    ? allColumnTasks.filter((task) => {
        const title = normalizeText(task.title);
        const description = normalizeText(task.description);

        return (
          title.includes(normalizedSearch) ||
          description.includes(normalizedSearch)
        );
      })
    : allColumnTasks;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    tasks: filteredTasks.slice(startIndex, endIndex),
    totalCount: filteredTasks.length,
  };
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await api.post<Task>("/tasks", {
    ...payload,
    id: crypto.randomUUID(),
  });

  return response.data;
}

export async function updateTask(
  id: string,
  payload: UpdateTaskPayload,
): Promise<Task> {
  const response = await api.patch<Task>(`/tasks/${id}`, payload);

  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
