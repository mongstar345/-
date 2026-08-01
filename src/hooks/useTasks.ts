import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import { Task, TaskStats, PaginatedResponse } from '../types';
import { useTaskStore } from '../stores/task.store';
import { toast } from 'sonner@2.0.3';

// Query Keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: any) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
};

// Fetch Tasks
export function useTasks(filters?: any, options?: UseQueryOptions<Task[]>) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Task>>(API_ENDPOINTS.TASKS.BASE, {
        params: filters,
      });
      return response.data;
    },
    onSuccess: (data) => {
      useTaskStore.getState().setTasks(data);
    },
    ...options,
  });
}

// Fetch Task Stats
export function useTaskStats(options?: UseQueryOptions<TaskStats>) {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: async () => {
      const response = await apiClient.get<TaskStats>(API_ENDPOINTS.TASKS.STATS);
      return response;
    },
    onSuccess: (data) => {
      useTaskStore.getState().setStats(data);
    },
    ...options,
  });
}

// Create Task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: Partial<Task>) => {
      const response = await apiClient.post<Task>(API_ENDPOINTS.TASKS.CREATE, taskData);
      return response;
    },
    onSuccess: (newTask) => {
      useTaskStore.getState().addTask(newTask);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      toast.success('Task created successfully!');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });
}

// Update Task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const response = await apiClient.patch<Task>(API_ENDPOINTS.TASKS.UPDATE(id), updates);
      return response;
    },
    onMutate: async ({ id, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());
      
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          taskKeys.lists(),
          previousTasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
        );
      }
      
      useTaskStore.getState().updateTask(id, updates);
      
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to update task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      toast.success('Task updated!');
    },
  });
}

// Delete Task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id));
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());
      
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          taskKeys.lists(),
          previousTasks.filter((task) => task.id !== id)
        );
      }
      
      useTaskStore.getState().deleteTask(id);
      
      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to delete task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      toast.success('Task deleted!');
    },
  });
}

// Complete Task
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<Task>(API_ENDPOINTS.TASKS.COMPLETE(id));
      return response;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());
      
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          taskKeys.lists(),
          previousTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: 'completed' as const,
                  completedAt: new Date().toISOString(),
                }
              : task
          )
        );
      }
      
      useTaskStore.getState().toggleComplete(id);
      
      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
      toast.error('Failed to complete task');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      toast.success('Task completed! 🎉');
    },
  });
}
