import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { RootState } from "../../../app/store";
import { closeTaskDialog } from "../store/taskUISlice";
import { createTask, updateTask } from "../api/tasksAPI";
import type { Task, TaskColumn, TaskPriority } from "../types";

const columnOptions: { label: string; value: TaskColumn }[] = [
  { label: "To Do", value: "backlog" },
  { label: "In Progress", value: "in_progress" },
  { label: "In Review", value: "review" },
  { label: "Done", value: "done" },
];

const priorityOptions: { label: string; value: TaskPriority }[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

interface TaskFormProps {
  selectedTask: Task | null;
  selectedColumn: TaskColumn;
  onClose: () => void;
}

function TaskForm({ selectedTask, selectedColumn, onClose }: TaskFormProps) {
  const queryClient = useQueryClient();

  const isEditMode = Boolean(selectedTask);

  const [title, setTitle] = useState(selectedTask?.title ?? "");

  const [description, setDescription] = useState(
    selectedTask?.description ?? "",
  );

  const [column, setColumn] = useState<TaskColumn>(
    selectedTask?.column ?? selectedColumn,
  );

  const [priority, setPriority] = useState<TaskPriority>(
    selectedTask?.priority ?? "medium",
  );

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks-count"],
      });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!selectedTask) {
        throw new Error("No task selected for update");
      }

      return updateTask(selectedTask.id, {
        title: title.trim(),
        description: description.trim(),
        column,
        priority,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks-count"],
      });
      onClose();
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function handleSubmit() {
    if (!title.trim() || !description.trim()) return;

    if (isEditMode) {
      updateMutation.mutate();
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      column,
      priority,
    });
  }

  return (
    <>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "12px !important",
        }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          fullWidth
          required
          multiline
          minRows={3}
        />

        <FormControl fullWidth>
          <InputLabel>Column</InputLabel>
          <Select
            label="Column"
            value={column}
            onChange={(event) => setColumn(event.target.value as TaskColumn)}
          >
            {columnOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
          >
            {priorityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSaving || !title.trim() || !description.trim()}
        >
          {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </>
  );
}

export default function TaskDialog() {
  const dispatch = useDispatch();

  const { isDialogOpen, selectedTask, selectedColumn } = useSelector(
    (state: RootState) => state.taskUi,
  );

  const isEditMode = Boolean(selectedTask);

  function handleClose() {
    dispatch(closeTaskDialog());
  }

  return (
    <Dialog open={isDialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Task" : "Create Task"}</DialogTitle>

      {isDialogOpen && (
        <TaskForm
          key={selectedTask?.id ?? `create-task-${selectedColumn}`}
          selectedTask={selectedTask}
          selectedColumn={selectedColumn}
          onClose={handleClose}
        />
      )}
    </Dialog>
  );
}
