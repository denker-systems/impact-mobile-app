export type EUApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface EUApplication {
  id: string;
  created_at: string;
  updated_at: string;
  status: EUApplicationStatus;
  call_identifier?: string;
  topic_identifier?: string;
  proposal_type?: string;
  formData: any;
  opportunity_id?: string;
}
