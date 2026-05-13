import { Box, Typography } from "@mui/material";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnConfig, Task, TaskColumn } from "../types";
import { updateTask } from "../api/tasksAPI";
import KanbanColumn from "./KanbanColumn";
import SearchBar from "./SearchBar";
import TaskDialog from "./TaskDialog";

const columns: ColumnConfig[] = [
  { id: "backlog", title: "Backlog" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export default function KanbanBoard() {
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, column }: { taskId: string; column: TaskColumn }) =>
      updateTask(taskId, { column }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const targetColumn = over.id as TaskColumn;
    const draggedTask = active.data.current?.task as Task | undefined;

    if (!draggedTask) return;
    if (draggedTask.column === targetColumn) return;

    moveTaskMutation.mutate({
      taskId: draggedTask.id,
      column: targetColumn,
    });
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={900}>
          Kanban ToDo Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Manage tasks across Backlog, In Progress, Review, and Done.
        </Typography>
      </Box>

      <SearchBar />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(260px, 1fr))",
            gap: 2,
            alignItems: "stretch",
            width: "100%",
            overflowX: "auto",
            pb: 1,
          }}
        >
          {columns.map((column) => (
            <KanbanColumn key={column.id} id={column.id} title={column.title} />
          ))}
        </Box>
      </DndContext>

      <TaskDialog />
    </Box>
  );
}
