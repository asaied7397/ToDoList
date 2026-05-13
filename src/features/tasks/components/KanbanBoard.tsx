import { Box, Typography } from "@mui/material";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import type { ColumnConfig, Task, TaskColumn } from "../types";
import { updateTask, getTasksByColumn } from "../api/tasksAPI";
import KanbanColumn from "./KanbanColumn";
import SearchBar from "./SearchBar";
import TaskDialog from "./TaskDialog";

const columns: ColumnConfig[] = [
  { id: "backlog", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "In Review" },
  { id: "done", title: "Done" },
];

export default function KanbanBoard() {
  const queryClient = useQueryClient();

  // Setup drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // Fetch task counts for all columns to display total count in header
  const taskCountQueries = useQueries({
    queries: columns.map((column) => ({
      queryKey: ["tasks-count", column.id],
      queryFn: () =>
        getTasksByColumn({
          column: column.id,
          page: 1,
          limit: 9999,
        }),
    })),
  });

  const totalTasksCount = taskCountQueries.reduce((total, query) => {
    return total + (query.data?.totalCount ?? 0);
  }, 0);

  // Mutation to move task between columns
  const moveTaskMutation = useMutation({
    mutationFn: ({ taskId, column }: { taskId: string; column: TaskColumn }) =>
      updateTask(taskId, { column }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks-count"],
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          marginBottom: 3,
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              backgroundColor: "#1976d2",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 8px 20px rgba(25, 118, 210, 0.25)",
            }}
          >
            <DashboardCustomizeIcon fontSize="medium" />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Kanban Board
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Total Tasks: {totalTasksCount}
            </Typography>
          </Box>
        </Box>

        <SearchBar />
      </div>

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
