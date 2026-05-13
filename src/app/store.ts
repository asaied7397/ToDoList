import { configureStore } from "@reduxjs/toolkit";
import taskUiReducer from "../features/tasks/store/taskUISlice";

export const store = configureStore({
  reducer: {
    taskUi: taskUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
