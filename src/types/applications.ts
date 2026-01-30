export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface Application {
  id: string;
  user_id: string;
  organization_id: string;
  title: string;
  status: ApplicationStatus;
  type: 'vinnova' | 'eu_horizon';
  created_at: string;
  updated_at: string;
  data: any;
  opportunity_id?: string;
}

export interface ApplicationWithMetadata extends Application {
  organization_name?: string;
  opportunity_title?: string;
  progress?: number;
}
