import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDraggable } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import type { Task } from "../types";
import { deleteTask } from "../api/tasksAPI";
import { openEditTaskDialog } from "../store/taskUISlice";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        task,
      },
    });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 1.5,
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
      {...listeners}
      {...attributes}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {task.title}
          </Typography>

          <Box
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <IconButton
              size="small"
              onClick={() => dispatch(openEditTaskDialog(task))}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => deleteMutation.mutate(task.id)}
              disabled={deleteMutation.isPending}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, lineHeight: 1.5 }}
        >
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
