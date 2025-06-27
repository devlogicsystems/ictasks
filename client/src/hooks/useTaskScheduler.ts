import { useEffect } from 'react';
import { RecurringTemplate, Task } from '@/types/task';
import { TaskFormData } from '@/lib/validations/task';
import { addDays, addMonths, addYears, format, isAfter, isBefore, startOfDay } from 'date-fns';

interface UseTaskSchedulerProps {
  activeTemplates: RecurringTemplate[];
  existingTasks: Task[];
  onCreateTask: (taskData: TaskFormData) => void;
}

export const useTaskScheduler = ({ 
  activeTemplates, 
  existingTasks, 
  onCreateTask 
}: UseTaskSchedulerProps) => {

  // Calculate next occurrence date for a template
  const getNextOccurrence = (template: RecurringTemplate, fromDate: Date = new Date()): Date | null => {
    const { schedule } = template;
    const today = startOfDay(fromDate);
    
    if (schedule.type === 'weekly') {
      const currentDay = today.getDay();
      const sortedDays = [...schedule.weekDays].sort();
      
      // Find next day in current week
      const nextDayThisWeek = sortedDays.find(day => day > currentDay);
      if (nextDayThisWeek !== undefined) {
        return addDays(today, nextDayThisWeek - currentDay);
      }
      
      // Next occurrence is first day of next week
      const firstDay = sortedDays[0];
      const daysUntilNextWeek = 7 - currentDay + firstDay;
      return addDays(today, daysUntilNextWeek);
    }
    
    if (schedule.type === 'monthly') {
      const currentDate = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Find next date in current month
      const nextDateThisMonth = schedule.monthDays.find(day => day > currentDate);
      if (nextDateThisMonth) {
        return new Date(currentYear, currentMonth, Math.min(nextDateThisMonth, 28)); // Adjust for February
      }
      
      // Next occurrence is first date of next month
      const firstDate = Math.min(schedule.monthDays[0], 28); // Adjust for February
      return new Date(currentYear, currentMonth + 1, firstDate);
    }
    
    if (schedule.type === 'yearly') {
      const currentMonth = today.getMonth();
      const currentDate = today.getDate();
      const currentYear = today.getFullYear();
      
      // Find next date in current year
      const sortedDates = [...schedule.yearDates].sort((a, b) => 
        a.month === b.month ? a.day - b.day : a.month - b.month
      );
      
      const nextDateThisYear = sortedDates.find(date => 
        date.month > currentMonth || 
        (date.month === currentMonth && date.day > currentDate)
      );
      
      if (nextDateThisYear) {
        const adjustedDay = nextDateThisYear.month === 1 ? Math.min(nextDateThisYear.day, 28) : nextDateThisYear.day;
        return new Date(currentYear, nextDateThisYear.month, adjustedDay);
      }
      
      // Next occurrence is first date of next year
      const firstDate = sortedDates[0];
      const adjustedDay = firstDate.month === 1 ? Math.min(firstDate.day, 28) : firstDate.day;
      return new Date(currentYear + 1, firstDate.month, adjustedDay);
    }
    
    return null;
  };

  // Calculate creation date (5 days before due date)
  const getCreationDate = (dueDate: Date): Date => {
    return addDays(dueDate, -5);
  };

  // Check if task already exists for this template and due date
  const taskExists = (templateId: string, dueDate: Date): boolean => {
    const dueDateStr = format(dueDate, 'yyyy-MM-dd');
    return existingTasks.some(task => 
      task.recurringTemplateId === templateId && 
      task.dueDate === dueDateStr
    );
  };

  // Generate task from template
  const generateTaskFromTemplate = (template: RecurringTemplate, dueDate: Date) => {
    if (taskExists(template.id, dueDate)) {
      return; // Task already exists
    }

    const taskData: TaskFormData = {
      subject: template.subject,
      details: template.details || '',
      assignee: template.assignee,
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      dueTime: '',
      reminderTime: '',
      isFullDay: true,
      labels: template.labels,
      url: template.url || '',
    };

    // Create task with reference to template
    const taskWithTemplate = {
      ...taskData,
      recurringTemplateId: template.id,
    };

    // Call onCreateTask with the enhanced data
    onCreateTask(taskWithTemplate as TaskFormData);
  };

  // Process all active templates and generate tasks if needed
  const processTemplates = () => {
    const today = new Date();
    
    activeTemplates.forEach(template => {
      const nextOccurrence = getNextOccurrence(template, today);
      
      if (nextOccurrence) {
        const creationDate = getCreationDate(nextOccurrence);
        
        // If today is the creation date or later, and the due date is in the future
        if (!isAfter(creationDate, today) && isAfter(nextOccurrence, today)) {
          generateTaskFromTemplate(template, nextOccurrence);
        }
      }
    });
  };

  // Run scheduler on mount and when templates/tasks change
  useEffect(() => {
    processTemplates();
  }, [activeTemplates, existingTasks]);

  // Return scheduler utilities for manual use if needed
  return {
    getNextOccurrence,
    getCreationDate,
    processTemplates,
    generateTaskFromTemplate,
  };
};