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
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { RootState } from "../../../app/store";
import { closeTaskDialog } from "../store/taskUISlice";
import type { Task, TaskColumn, TaskPriority } from "../types";
import { columnOptions, priorityOptions } from "../constants/tasksConstants";
import { useTaskMutations } from "../hooks/useTaskMutations";

interface TaskFormProps {
  selectedTask: Task | null;
  selectedColumn: TaskColumn;
  onClose: () => void;
}

function TaskForm({ selectedTask, selectedColumn, onClose }: TaskFormProps) {
  const { createTaskMutation, updateTaskMutation } = useTaskMutations();

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

  // Determine if either mutation is currently pending to disable the submit button and show a loading state
  const isSaving = createTaskMutation.isPending || updateTaskMutation.isPending;

  // Handle form submission for both creating and updating tasks
  function handleSubmit() {
    if (!title.trim() || !description.trim()) return;

    if (isEditMode) {
      if (!selectedTask) return;

      updateTaskMutation.mutate(
        {
          id: selectedTask.id,
          payload: {
            title: title.trim(),
            description: description.trim(),
            column,
            priority,
          },
        },
        {
          onSuccess: onClose,
        },
      );

      return;
    }

    createTaskMutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        column,
        priority,
      },
      {
        onSuccess: onClose,
      },
    );
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

  // Get dialog state from Redux store
  const { isDialogOpen, selectedTask, selectedColumn } = useSelector(
    (state: RootState) => state.taskUi,
  );

  // Determine if we're in edit mode based on whether a task is selected
  const isEditMode = Boolean(selectedTask);

  // Handle dialog close
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
