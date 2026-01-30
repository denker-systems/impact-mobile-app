import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { GrantCategory, GrantWithMetadata, Publisher, FilterState } from '@/types/swedish-grants';

export const useSwedishGrants = (filters: FilterState, searchTerm: string) => {
  const { data: categories } = useQuery({
    queryKey: ['grant-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('grant_categories').select('*').order('name');
      if (error) throw error;
      return data as GrantCategory[];
    },
  });

  const { data: publishers } = useQuery({
    queryKey: ['grant-publishers-with-count'],
    queryFn: async () => {
      const { data: publishersData, error } = await supabase
        .from('grant_publishers')
        .select('id, name, website_url, level')
        .order('name');

      if (error) throw error;

      const countsPromises =
        publishersData?.map(async (p) => {
          const { count } = await supabase
            .from('swedish_grants')
            .select('*', { count: 'exact', head: true })
            .eq('publisher_id', p.id);
          return { ...p, grants_count: count || 0 };
        }) || [];

      const publishersWithCounts = await Promise.all(countsPromises);
      return publishersWithCounts.filter((p) => p.grants_count > 0) as Publisher[];
    },
  });

  const {
    data: allGrants,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['swedish-grants-with-metadata'],
    queryFn: async () => {
      let allData: any[] = [];
      let offset = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: batch, error } = await supabase
          .from('swedish_grants')
          .select(`*, publisher:grant_publishers(*)`)
          .order('created_at', { ascending: false })
          .range(offset, offset + batchSize - 1);

        if (error) throw error;

        if (batch && batch.length > 0) {
          allData = [...allData, ...batch];
          offset += batchSize;
          hasMore = batch.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      const seenIds = new Set<string>();
      const grants = allData.filter((grant) => {
        if (seenIds.has(grant.id)) return false;
        seenIds.add(grant.id);
        return true;
      });

      const { data: detailsData } = await supabase
        .from('grant_application_details')
        .select('grant_id, process_steps, required_docs');
      const { data: documentsData } = await supabase.from('grant_documents').select('grant_id');

      const detailsMap = new Map<string, number>();
      detailsData?.forEach((d) => {
        const hasContent =
          (Array.isArray(d.process_steps) && d.process_steps.length > 0) ||
          (Array.isArray(d.required_docs) && d.required_docs.length > 0);
        if (hasContent) {
          detailsMap.set(d.grant_id, (detailsMap.get(d.grant_id) || 0) + 1);
        }
      });

      const docsMap = new Map<string, number>();
      documentsData?.forEach((d) => docsMap.set(d.grant_id, (docsMap.get(d.grant_id) || 0) + 1));

      const { data: formGuidesData } = await supabase.from('grant_form_guides').select('grant_id');

      const formGuidesSet = new Set(formGuidesData?.map((fg) => fg.grant_id) || []);

      return grants.map((grant) => ({
        ...grant,
        details_count: detailsMap.get(grant.id) || 0,
        documents_count: docsMap.get(grant.id) || 0,
        has_form_guide: formGuidesSet.has(grant.id),
      })) as GrantWithMetadata[];
    },
  });

  const filteredGrants = useMemo(() => {
    if (!allGrants) return [];

    return allGrants.filter((grant) => {
      if (filters.hasIntelligence && grant.details_count === 0) return false;
      if (filters.hasDocuments && grant.documents_count === 0) return false;
      if (filters.hasFormGuides && !grant.has_form_guide) return false;

      if (searchTerm && searchTerm.length > 2) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          grant.title.toLowerCase().includes(searchLower) ||
          grant.description?.toLowerCase().includes(searchLower) ||
          grant.publisher?.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.levels.length > 0) {
        if (!grant.publisher?.level || !filters.levels.includes(grant.publisher.level)) {
          return false;
        }
      }

      if (filters.publishers.length > 0) {
        if (!grant.publisher?.id || !filters.publishers.includes(grant.publisher.id)) {
          return false;
        }
      }

      if (filters.themes.length > 0) {
        const hasMatchingTheme = grant.themes?.some((theme) => filters.themes.includes(theme));
        if (!hasMatchingTheme) return false;
      }

      const now = new Date();
      const isExpired = grant.deadline && new Date(grant.deadline) < now;
      const isOpen = grant.deadline && new Date(grant.deadline) >= now;
      const isRecurring = grant.status === 'recurring';

      let matchesDeadlineFilter = false;
      if (filters.showExpired && isExpired) matchesDeadlineFilter = true;
      if (filters.showOpen && isOpen) matchesDeadlineFilter = true;
      if (filters.showRecurring && isRecurring) matchesDeadlineFilter = true;
      if (!grant.deadline && !isRecurring && filters.showOpen) matchesDeadlineFilter = true;

      if (!matchesDeadlineFilter) return false;

      const grantGdpSource = (grant as GrantWithMetadata & { gdp_source?: string }).gdp_source;
      if (filters.gdpSource === 'gdp') {
        if (!grantGdpSource) return false;
      } else if (filters.gdpSource === 'crawler') {
        if (grantGdpSource) return false;
      }

      if (grantGdpSource && !filters.gdpProviders.includes(grantGdpSource as any)) {
        return false;
      }

      return true;
    });
  }, [allGrants, searchTerm, filters]);

  const themeCategories = categories?.filter((c) => c.category_type === 'theme') || [];

  return {
    grants: filteredGrants,
    publishers: publishers || [],
    isLoading,
    themeCategories,
    refetch,
  };
};
