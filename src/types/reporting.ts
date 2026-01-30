export type ReportType = 'daily_admin' | 'daily_client' | 'monthly_project';
export type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'submitted';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Expense {
  description: string;
  amount: number;
  currency: string;
  receipt_url?: string;
}

export interface Report {
  id: string;
  user_id: string;
  organization_id: string;
  project_id: string;
  report_type: ReportType;
  report_date: string;
  title: string;
  description?: string;
  status: ReportStatus;
  hours_worked?: number;
  total_expenses: number;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    name: string;
  };
}

export interface DashboardStats {
  total_reports: number;
  total_hours: number;
  total_expenses: number;
  total_tasks: number;
  completed_tasks: number;
  active_projects: number;
}
