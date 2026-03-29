import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/client';
import type { Application } from '../types';

export function useApplications() {
  return useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await client.get('/applications');
      return data;
    },
  });
}

export function useApplication(id: string | undefined) {
  return useQuery<Application>({
    queryKey: ['applications', id],
    queryFn: async () => {
      const { data } = await client.get(`/applications/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string; appUrl?: string; icon?: string; widgetConfig: Application['widgetConfig'] }) => {
      const { data } = await client.post('/applications', payload);
      return data as Application;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: string;
      name?: string;
      description?: string;
      appUrl?: string | null;
      icon?: string | null;
    }) => {
      const { data } = await client.patch(`/applications/${id}`, payload);
      return data as Application;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', variables.id] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useRegenerateKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await client.post(`/applications/${id}/regenerate-key`);
      return data as Application;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['applications', id] });
    },
  });
}
