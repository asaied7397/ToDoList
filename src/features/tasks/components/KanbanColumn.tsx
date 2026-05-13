import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDroppable } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import type { TaskColumn } from "../types";
import TaskCard from "./TaskCard";
import { openCreateTaskDialog, setColumnPage } from "../store/taskUISlice";
import { columnColors } from "../constants/tasksConstants";
import { useColumnTasks } from "../hooks/useColumnTasks";

interface KanbanColumnProps {
  id: TaskColumn;
  title: string;
}

export default function KanbanColumn({ id, title }: KanbanColumnProps) {
  const dispatch = useDispatch();

  // Set up the droppable area for the Kanban column using the useDroppable hook from dnd-kit
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  // Custom hook to fetch tasks for the column and manage pagination state
  const { tasks, totalCount, totalPages, page, isLoading, isError } =
    useColumnTasks(id);

  // Memoize the array of page numbers to avoid unnecessary recalculations on re-renders
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  // Function to handle page changes when the user clicks on pagination buttons
  function changePage(newPage: number) {
    dispatch(
      setColumnPage({
        column: id,
        page: newPage,
      }),
    );
  }

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        p: 2,
        minHeight: 560,
        height: "100%",
        backgroundColor: isOver ? "#e3f2fd" : "#eef3f4",
        border: isOver ? "2px dashed #1976d2" : "1px solid #d9e1e3",
        transition: "0.2s",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: columnColors[id],
              flexShrink: 0,
            }}
          />

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            px: 1,
            py: 0.4,
            borderRadius: 999,
            backgroundColor: "white",
            fontWeight: 700,
          }}
        >
          {totalCount}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 390 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && (
          <Typography color="error" variant="body2">
            Failed to load tasks.
          </Typography>
        )}

        {!isLoading && tasks.length === 0 && (
          <Typography color="text.secondary" variant="body2">
            No tasks found.
          </Typography>
        )}

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>

      {!isLoading && totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.75,
            mt: 2,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            disabled={page === 1}
            onClick={() => changePage(Math.max(page - 1, 1))}
          >
            Prev
          </Button>

          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              size="small"
              variant={pageNumber === page ? "contained" : "outlined"}
              onClick={() => changePage(pageNumber)}
              sx={{ minWidth: 36 }}
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            size="small"
            variant="outlined"
            disabled={page === totalPages}
            onClick={() => changePage(Math.min(page + 1, totalPages))}
          >
            Next
          </Button>
        </Box>
      )}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => dispatch(openCreateTaskDialog(id))}
        sx={{ mt: 2 }}
      >
        Add Task
      </Button>
    </Paper>
  );
}
