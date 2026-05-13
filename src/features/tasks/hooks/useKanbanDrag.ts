import {
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Task, TaskColumn } from "../types";
import { useTaskMutations } from "./useTaskMutations";

export function useKanbanDrag() {
  const { updateTaskMutation } = useTaskMutations();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const targetColumn = over.id as TaskColumn;
    const draggedTask = active.data.current?.task as Task | undefined;

    if (!draggedTask) return;
    if (draggedTask.column === targetColumn) return;

    updateTaskMutation.mutate({
      id: draggedTask.id,
      payload: {
        column: targetColumn,
      },
    });
  }

  return {
    sensors,
    handleDragEnd,
  };
}
