import { Box, Typography } from "@mui/material";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import { DndContext } from "@dnd-kit/core";
import { useQueries } from "@tanstack/react-query";
import { getTasksByColumn } from "../api/tasksAPI";
import { columns } from "../constants/tasksConstants";
import { useKanbanDrag } from "../hooks/useKanbanDrag";
import KanbanColumn from "./KanbanColumn";
import SearchBar from "./SearchBar";
import TaskDialog from "./TaskDialog";

export default function KanbanBoard() {
  // Custom hook to manage drag-and-drop logic for the Kanban board
  const { sensors, handleDragEnd } = useKanbanDrag();

  // Fetch the count of tasks for each column using React Query's useQueries
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
  // Calculate the total number of tasks across all columns by summing the counts from each query
  const totalTasksCount = taskCountQueries.reduce((total, query) => {
    return total + (query.data?.totalCount ?? 0);
  }, 0);

  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
