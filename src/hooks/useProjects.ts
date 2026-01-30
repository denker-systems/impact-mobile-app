import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export const useProjects = (organizationId?: string) => {
  return useQuery({
    queryKey: ['projects', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId,
  });
};

export const useProject = (projectId?: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};
