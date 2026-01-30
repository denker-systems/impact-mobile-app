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

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  project_type?: string;
  project_lead_details?: {
    name?: string;
    email?: string;
    phone?: string;
    organization?: string;
  };
  company_signatory_details?: {
    name?: string;
    email?: string;
    phone?: string;
    organization?: string;
  };
  start_date?: string;
  end_date?: string;
  created_at: string;
  organization_id: string;
  grant_diarienummer?: string;
  partners?: {
    name?: string;
    organization?: string;
    role?: string;
  }[];
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  status: 'todo' | 'done';
  sort_order: number;
}

export interface Task {
  id: string;
  user_id: string;
  organization_id?: string;
  project_id?: string;
  assigned_to?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  completed_at?: string;
  tags: string[];
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
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
