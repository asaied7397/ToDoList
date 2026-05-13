import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import type { RootState } from "../../../app/store";
import { getTasksByColumn } from "../api/tasksAPI";
import type { TaskColumn } from "../types";
import TaskCard from "./TaskCard";
import { setColumnPage } from "../store/taskUISlice";

interface KanbanColumnProps {
  id: TaskColumn;
  title: string;
}

const PAGE_LIMIT = 5;

export default function KanbanColumn({ id, title }: KanbanColumnProps) {
  const dispatch = useDispatch();

  const search = useSelector((state: RootState) => state.taskUi.search);
  const page = useSelector((state: RootState) => state.taskUi.pages[id]);

  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", id, search, page],
    queryFn: () =>
      getTasksByColumn({
        column: id,
        search,
        page,
        limit: PAGE_LIMIT,
      }),
  });

  const tasks = data?.tasks ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  function changePage(newPage: number) {
    dispatch(
      setColumnPage({
        column: id,
        page: newPage,
      }),
    );
  }

  function goToPreviousPage() {
    changePage(Math.max(page - 1, 1));
  }

  function goToNextPage() {
    changePage(Math.min(page + 1, totalPages));
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
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>

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

      <Box
        sx={{
          flex: 1,
          minHeight: 390,
        }}
      >
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
            onClick={goToPreviousPage}
          >
            Prev
          </Button>

          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              size="small"
              variant={pageNumber === page ? "contained" : "outlined"}
              onClick={() => changePage(pageNumber)}
              sx={{
                minWidth: 36,
              }}
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            size="small"
            variant="outlined"
            disabled={page === totalPages}
            onClick={goToNextPage}
          >
            Next
          </Button>
        </Box>
      )}
    </Paper>
  );
}
