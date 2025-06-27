
import * as z from 'zod';

// New recurring template validation schemas
const weeklyScheduleSchema = z.object({
  type: z.literal('weekly'),
  weekDays: z.array(z.number().min(0).max(6)).min(1, 'Please select at least one day.'),
});

const monthlyScheduleSchema = z.object({
  type: z.literal('monthly'),
  monthDays: z.array(z.number().min(1).max(30)).min(1, 'Please enter at least one day.'),
});

const yearlyScheduleSchema = z.object({
  type: z.literal('yearly'),
  yearDates: z.array(z.object({
    month: z.number().min(0).max(11),
    day: z.number().min(1).max(31),
  })).min(1, 'Please add at least one date.'),
});

const scheduleUnionSchema = z.discriminatedUnion('type', [
  weeklyScheduleSchema,
  monthlyScheduleSchema,
  yearlyScheduleSchema,
]);

// Regular task form schema (no recurrence)
export const taskFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  details: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required.'),
  dueTime: z.string().optional(),
  reminderTime: z.string().optional(),
  isFullDay: z.boolean(),
  labels: z.array(z.string()),
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

// New recurring template form schema
export const recurringTemplateFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  details: z.string().optional(),
  assignee: z.string().min(1, 'Assignee is required.'),
  labels: z.array(z.string()),
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  schedule: scheduleUnionSchema,
  status: z.enum(['active', 'inactive']).default('active'),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
export type RecurringTemplateFormData = z.infer<typeof recurringTemplateFormSchema>;
