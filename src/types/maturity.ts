export type MaturityStatus = 'not_started' | 'in_progress' | 'completed';

export interface MaturityCriterion {
  id: string;
  category_id: string;
  name: string;
  description: string;
  sort_order: number;
  status: MaturityStatus;
  notes?: string;
  evidence?: string;
  document_links?: string;
}

export interface MaturityCategory {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  criteria: MaturityCriterion[];
  completedCount: number;
  totalCount: number;
}

export interface OrganizationMaturity {
  organization_id: string;
  criteria_id: string;
  status: MaturityStatus;
  notes?: string;
  evidence?: string;
  document_links?: string;
  last_updated: string;
}
