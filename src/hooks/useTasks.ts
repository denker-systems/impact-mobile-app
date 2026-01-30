import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Task, TaskStatus } from '@/types/reporting';

export const useTasks = (filters?: { organization_id?: string; project_id?: string }) => {
  const queryClient = useQueryClient();

  // Fetch tasks
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['swedish-iq-tasks', filters],
    queryFn: async () => {
      let query = supabase
        .from('swedish_iq_tasks')
        .select(
          `
          *,
          subtasks:swedish_iq_subtasks(*),
          project:projects(id, name)
        `,
        )
        .order('created_at', { ascending: false });

      if (filters?.organization_id) {
        // Om organisation är vald, hämta tasks för den ELLER de som saknar org (globala)
        query = query.or(`organization_id.eq.${filters.organization_id},organization_id.is.null`);
      }

      if (filters?.project_id) {
        query = query.eq('project_id', filters.project_id);
      }

      const { data, error: taskError } = await query;

      if (taskError) throw taskError;
      return data as Task[];
    },
  });

  // Update task status
  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const { error: updateError } = await supabase
        .from('swedish_iq_tasks')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swedish-iq-tasks'] });
    },
  });

  // Toggle subtask status
  const toggleSubtaskStatus = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: 'todo' | 'done' }) => {
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      const { error: subtaskError } = await supabase
        .from('swedish_iq_subtasks')
        .update({ status: newStatus })
        .eq('id', id);

      if (subtaskError) throw subtaskError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swedish-iq-tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    updateTaskStatus,
    toggleSubtaskStatus,
  };
};
