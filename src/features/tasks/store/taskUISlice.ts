import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../types";

interface TaskUiState {
  search: string;
  isDialogOpen: boolean;
  selectedTask: Task | null;
}

const initialState: TaskUiState = {
  search: "",
  isDialogOpen: false,
  selectedTask: null,
};

const taskUiSlice = createSlice({
  name: "taskUi",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    openCreateTaskDialog(state) {
      state.isDialogOpen = true;
      state.selectedTask = null;
    },
    openEditTaskDialog(state, action: PayloadAction<Task>) {
      state.isDialogOpen = true;
      state.selectedTask = action.payload;
    },
    closeTaskDialog(state) {
      state.isDialogOpen = false;
      state.selectedTask = null;
    },
  },
});

export const {
  setSearch,
  openCreateTaskDialog,
  openEditTaskDialog,
  closeTaskDialog,
} = taskUiSlice.actions;

export default taskUiSlice.reducer;
