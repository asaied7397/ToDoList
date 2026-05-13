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
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import type { Task } from "../types";
import { openEditTaskDialog } from "../store/taskUISlice";
import { getPriorityStyle } from "../utils/tasksUtils";
import { useTaskMutations } from "../hooks/useTaskMutations";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const dispatch = useDispatch();
  const { deleteTaskMutation } = useTaskMutations();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(task.id),
      data: {
        task,
      },
    });

  const priorityStyle = getPriorityStyle(task.priority ?? "medium");

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
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            alignItems: "flex-start",
            cursor: isDragging ? "grabbing" : "grab",
            mt: -0.5,
          }}
          {...listeners}
          {...attributes}
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
              onClick={() => deleteTaskMutation.mutate(String(task.id))}
              disabled={deleteTaskMutation.isPending}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
