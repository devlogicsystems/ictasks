
import { useTasks } from './useTasks';
import { useTaskFilters } from './useTaskFilters';
import { useFilteredTasks } from './useFilteredTasks';
import { useTaskCalculations } from './useTaskCalculations';
import { useRecurringTemplates } from './useRecurringTemplates';
import { useTaskScheduler } from './useTaskScheduler';

export const useTaskManager = () => {
  const {
    tasks,
    setTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useTasks();

  const {
    searchQuery,
    setSearchQuery,
    selectedDateFilter,
    setSelectedDateFilter,
    statusFilter,
    setStatusFilter,
  } = useTaskFilters();

  const filteredTasks = useFilteredTasks(tasks, searchQuery, selectedDateFilter, statusFilter);
  const { getPendingTasksCount, getTasksCountByDate } = useTaskCalculations(tasks);
  
  // Integrate recurring templates and task scheduler
  const { activeTemplates } = useRecurringTemplates();
  
  // Initialize task scheduler to automatically generate tasks from templates
  useTaskScheduler({
    activeTemplates,
    existingTasks: tasks,
    onCreateTask: handleCreateTask,
  });

  return {
    tasks,
    setTasks,
    searchQuery,
    setSearchQuery,
    selectedDateFilter,
    setSelectedDateFilter,
    statusFilter,
    setStatusFilter,
    filteredTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    getPendingTasksCount,
    getTasksCountByDate,
  };
};

