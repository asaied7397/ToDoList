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
import { useEffect, useState } from "react";
import type { RootState } from "../../../app/store";
import { closeTaskDialog } from "../store/taskUISlice";
import { createTask, updateTask } from "../api/tasksAPI";
import type { TaskColumn } from "../types";

const columnOptions: { label: string; value: TaskColumn }[] = [
  { label: "Backlog", value: "backlog" },
  { label: "In Progress", value: "in_progress" },
  { label: "Review", value: "review" },
  { label: "Done", value: "done" },
];

export default function TaskDialog() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { isDialogOpen, selectedTask } = useSelector(
    (state: RootState) => state.taskUi,
  );

  const isEditMode = Boolean(selectedTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<TaskColumn>("backlog");

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setColumn(selectedTask.column);
    } else {
      setTitle("");
      setDescription("");
      setColumn("backlog");
    }
  }, [selectedTask, isDialogOpen]);

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      dispatch(closeTaskDialog());
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateTask(selectedTask!.id, {
        title,
        description,
        column,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      dispatch(closeTaskDialog());
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
    <Dialog
      open={isDialogOpen}
      onClose={() => dispatch(closeTaskDialog())}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{isEditMode ? "Edit Task" : "Create Task"}</DialogTitle>

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
      </DialogContent>

      <DialogActions>
        <Button onClick={() => dispatch(closeTaskDialog())}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSaving || !title.trim() || !description.trim()}
        >
          {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
