import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { getTasksByColumn } from "../api/tasksAPI";
import { PAGE_LIMIT } from "../constants/tasksConstants";
import type { TaskColumn } from "../types";

export function useColumnTasks(column: TaskColumn) {
  const search = useSelector((state: RootState) => state.taskUi.search);
  const page = useSelector((state: RootState) => state.taskUi.pages[column]);

  const query = useQuery({
    queryKey: ["tasks", column, search, page],
    queryFn: () =>
      getTasksByColumn({
        column,
        search,
        page,
        limit: PAGE_LIMIT,
      }),
  });

  const tasks = query.data?.tasks ?? [];
  const totalCount = query.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

  return {
    ...query,
    tasks,
    totalCount,
    totalPages,
    page,
    search,
  };
}
