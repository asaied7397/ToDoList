import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, updateTask } from "../api/tasksAPI";

export function useTaskMutations() {
  const queryClient = useQueryClient();

  function invalidateTaskQueries() {
    queryClient.invalidateQueries({
      queryKey: ["tasks"],
    });

    queryClient.invalidateQueries({
      queryKey: ["tasks-count"],
    });
  }

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: invalidateTaskQueries,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateTask>[1];
    }) => updateTask(id, payload),
    onSuccess: invalidateTaskQueries,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidateTaskQueries,
  });

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    invalidateTaskQueries,
  };
}
