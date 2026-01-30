import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Report, DashboardStats, ReportStatus } from '@/types/reporting';

export interface CreateReportData {
  organization_id: string;
  project_id: string;
  project_ids?: string[];
  report_type: string;
  report_date: string;
  title: string;
  description?: string;
  status?: ReportStatus;
  hours_worked?: number;
  total_expenses?: number;
  task_ids?: string[];
}

export const useReports = (organizationId?: string, filters?: { project_id?: string }) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['reports', organizationId, filters],
    queryFn: async () => {
      if (!organizationId) return [];

      let query = supabase
        .from('swedish_iq_reports')
        .select(
          `
          *,
          project:projects(id, name)
        `,
        )
        .eq('organization_id', organizationId);

      if (filters?.project_id) {
        query = query.eq('project_id', filters.project_id);
      }

      const { data, error } = await query.order('report_date', { ascending: false });

      if (error) throw error;
      return data as Report[];
    },
    enabled: !!organizationId,
  });

  const createReport = useMutation({
    mutationFn: async (data: CreateReportData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: report, error } = await supabase
        .from('swedish_iq_reports')
        .insert({
          ...data,
          user_id: user.id,
          status: data.status || 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return report as Report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['reporting-stats', organizationId] });
    },
  });

  return {
    ...query,
    createReport,
  };
};

export const useReportingStats = (organizationId?: string) => {
  return useQuery({
    queryKey: ['reporting-stats', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;

      const { data: reports, error: reportsError } = await supabase
        .from('swedish_iq_reports')
        .select('hours_worked, total_expenses, status')
        .eq('organization_id', organizationId);

      if (reportsError) throw reportsError;

      const { count: projectCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId);

      if (projectsError) throw projectsError;

      const stats: DashboardStats = {
        total_reports: reports?.length || 0,
        total_hours: reports?.reduce((sum, r) => sum + (r.hours_worked || 0), 0) || 0,
        total_expenses: reports?.reduce((sum, r) => sum + (r.total_expenses || 0), 0) || 0,
        total_tasks: 0,
        completed_tasks: 0,
        active_projects: projectCount || 0,
      };

      return stats;
    },
    enabled: !!organizationId,
  });
};
