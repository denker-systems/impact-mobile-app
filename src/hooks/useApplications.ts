import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { ApplicationWithMetadata } from '@/types/applications';
import { useAuth } from '@/contexts/AuthContext';

export const useApplications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('applications')
        .select(
          `
          *,
          organization:organizations(name),
          opportunity:grants(title)
        `,
        )
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data.map((app: any) => ({
        ...app,
        organization_name: app.organization?.name,
        opportunity_title: app.opportunity?.title,
        // Enkel progress-beräkning baserad på status
        progress: app.status === 'submitted' ? 100 : app.status === 'draft' ? 45 : 100,
      })) as ApplicationWithMetadata[];
    },
    enabled: !!user,
  });
};
