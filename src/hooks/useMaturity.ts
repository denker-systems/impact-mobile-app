import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { MaturityCategory, MaturityStatus } from '@/types/maturity';

export const useMaturity = (organizationId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['maturity', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      // 1. Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from('grant_maturity_categories')
        .select('*')
        .order('sort_order');

      if (catError) throw catError;

      // 2. Fetch all criteria for these categories
      const { data: criteriaData, error: critError } = await supabase
        .from('grant_maturity_criteria')
        .select('*')
        .order('sort_order');

      if (critError) throw critError;

      // 3. Fetch user's organization maturity status
      const { data: statusData, error: statusError } = await supabase
        .from('organization_maturity')
        .select('*')
        .eq('organization_id', organizationId);

      if (statusError) throw statusError;

      const statusMap = new Map(statusData?.map((s) => [s.criteria_id, s]));

      // 4. Combine data
      return categoriesData.map((category) => {
        const categoryCriteria = criteriaData
          .filter((c) => c.category_id === category.id)
          .map((criterion) => {
            const status = statusMap.get(criterion.id);
            return {
              ...criterion,
              status: status?.status || 'not_started',
              notes: status?.notes || '',
              evidence: status?.evidence || '',
              document_links: status?.document_links || '[]',
            };
          });

        return {
          ...category,
          criteria: categoryCriteria,
          completedCount: categoryCriteria.filter((c) => c.status === 'completed').length,
          totalCount: categoryCriteria.length,
        };
      }) as MaturityCategory[];
    },
    enabled: !!organizationId,
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      criteriaId,
      status,
      notes,
      evidence,
    }: {
      criteriaId: string;
      status: MaturityStatus;
      notes?: string;
      evidence?: string;
    }) => {
      if (!organizationId) throw new Error('No organization selected');

      const { error } = await supabase.from('organization_maturity').upsert(
        {
          organization_id: organizationId,
          criteria_id: criteriaId,
          status,
          notes,
          evidence,
          last_updated: new Date().toISOString(),
        },
        {
          onConflict: 'organization_id,criteria_id',
        },
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maturity', organizationId] });
    },
  });

  return {
    ...query,
    updateStatus,
  };
};
