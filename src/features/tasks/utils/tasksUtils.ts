import type { TaskPriority } from "../types";

export function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

export function getPriorityStyle(priority: TaskPriority) {
  if (priority === "high") {
    return {
      label: "High",
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderColor: "#ef9a9a",
    };
  }

  if (priority === "medium") {
    return {
      label: "Medium",
      backgroundColor: "#fff8e1",
      color: "#ef6c00",
      borderColor: "#ffcc80",
    };
  }

  return {
    label: "Low",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderColor: "#a5d6a7",
  };
}
