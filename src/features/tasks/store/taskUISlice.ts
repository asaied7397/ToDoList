import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskColumn } from "../types";

interface TaskUiState {
  search: string;
  isDialogOpen: boolean;
  selectedTask: Task | null;
  pages: Record<TaskColumn, number>;
}

const initialState: TaskUiState = {
  search: "",
  isDialogOpen: false,
  selectedTask: null,
  pages: {
    backlog: 1,
    in_progress: 1,
    review: 1,
    done: 1,
  },
};

const taskUiSlice = createSlice({
  name: "taskUi",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;

      state.pages = {
        backlog: 1,
        in_progress: 1,
        review: 1,
        done: 1,
      };
    },

    setColumnPage(
      state,
      action: PayloadAction<{ column: TaskColumn; page: number }>,
    ) {
      state.pages[action.payload.column] = action.payload.page;
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
  setColumnPage,
  openCreateTaskDialog,
  openEditTaskDialog,
  closeTaskDialog,
} = taskUiSlice.actions;

export default taskUiSlice.reducer;
