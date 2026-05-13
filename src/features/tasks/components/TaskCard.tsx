import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDraggable } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import type { Task, TaskPriority } from "../types";
import { deleteTask } from "../api/tasksAPI";
import { openEditTaskDialog } from "../store/taskUISlice";

interface TaskCardProps {
  task: Task;
}

function getPriorityColor(priority: TaskPriority) {
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

export default function TaskCard({ task }: TaskCardProps) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Setup draggable behavior for the task card
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(task.id),
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
      queryClient.invalidateQueries({
        queryKey: ["tasks-count"],
      });
    },
  });

  const priorityStyle = getPriorityColor(task.priority ?? "medium");

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

        borderRadius: 2,
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
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {task.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, lineHeight: 1.5 }}
              >
                {task.description}
              </Typography>

              <Chip
                label={priorityStyle.label}
                size="small"
                variant="outlined"
                sx={{
                  mt: 1.5,
                  fontWeight: 700,
                  backgroundColor: priorityStyle.backgroundColor,
                  color: priorityStyle.color,
                  borderColor: priorityStyle.borderColor,
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex" }}>
            <IconButton
              size="small"
              onClick={() => dispatch(openEditTaskDialog(task))}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => deleteMutation.mutate(String(task.id))}
              disabled={deleteMutation.isPending}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
