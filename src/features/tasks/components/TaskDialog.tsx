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
import type { Task, TaskColumn } from "../types";

const columnOptions: { label: string; value: TaskColumn }[] = [
  { label: "Backlog", value: "backlog" },
  { label: "In Progress", value: "in_progress" },
  { label: "Review", value: "review" },
  { label: "Done", value: "done" },
];

interface TaskFormProps {
  selectedTask: Task | null;
  onClose: () => void;
}

function TaskForm({ selectedTask, onClose }: TaskFormProps) {
  const queryClient = useQueryClient();

  const isEditMode = Boolean(selectedTask);

  const [title, setTitle] = useState(selectedTask?.title ?? "");
  const [description, setDescription] = useState(
    selectedTask?.description ?? "",
  );
  const [column, setColumn] = useState<TaskColumn>(
    selectedTask?.column ?? "backlog",
  );

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
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
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
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
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            onChange={(e) => setColumn(e.target.value as TaskColumn)}
          >
            {columnOptions.map((option) => (
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

  const { isDialogOpen, selectedTask } = useSelector(
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
          key={selectedTask?.id ?? "create-task"}
          selectedTask={selectedTask}
          onClose={handleClose}
        />
      )}
    </Dialog>
  );
}
