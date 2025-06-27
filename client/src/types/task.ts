
export type TaskStatus = 'assigned' | 'in-progress' | 'closed';
export type RecurringTaskStatus = 'active' | 'inactive';

export interface Task {
  id: string;
  subject: string;
  details?: string;
  assignee: string;
  dueDate: string; // YYYY-MM-DD format
  dueTime?: string; // HH:MM format
  reminderTime?: string; // HH:MM format
  status: TaskStatus;
  labels: string[];
  isFullDay: boolean;
  url?: string;
  attachments?: TaskAttachment[];
  recurringTemplateId?: string; // Link to recurring template if this task was generated from one
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

// New Recurring Template System
export interface WeeklySchedule {
  type: 'weekly';
  weekDays: number[]; // 0-6 (Sunday-Saturday)
}

export interface MonthlySchedule {
  type: 'monthly';
  monthDays: number[]; // 1-30 (avoiding 31 to handle all months)
}

export interface YearlySchedule {
  type: 'yearly';
  yearDates: { month: number; day: number }[]; // month: 0-11, day: 1-31
}

export type TaskSchedule = WeeklySchedule | MonthlySchedule | YearlySchedule;

export interface RecurringTemplate {
  id: string;
  subject: string;
  details?: string;
  assignee: string;
  labels: string[];
  url?: string;
  schedule: TaskSchedule;
  status: RecurringTaskStatus;
  isDeleted?: boolean; // Soft delete flag for inactive templates
  createdAt: string;
  updatedAt: string;
}

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
}

// Form data types
export interface RecurringTemplateFormData {
  subject: string;
  details?: string;
  assignee: string;
  labels: string[];
  url?: string;
  schedule: TaskSchedule;
  status: RecurringTaskStatus;
}
