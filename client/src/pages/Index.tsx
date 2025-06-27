
import React, { useState } from 'react';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useTaskIO, ExportOptions } from '@/hooks/useTaskIO';
import { Task } from '@/types/task';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import CreateTaskModal from '@/components/CreateTaskModal';
import { VoiceCommandModal } from '@/components/VoiceCommandModal';
import { ExportTasksDialog } from '@/components/ExportTasksDialog';
import DashboardTab from '@/components/dashboard/DashboardTab';
import TasksTab from '@/components/tasks/TasksTab';
import RecurringTab from '@/components/recurring/RecurringTab';
import { useTaskModals } from '@/hooks/useTaskModals';
import { useTaskReminders } from '@/hooks/useTaskReminders';
import TaskReminderModal from '@/components/TaskReminderModal';

const Index = () => {
  const {
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
  } = useTaskManager();
  
  const { importFileRef, triggerImport, handleExportTasks, handleImportFileSelect } = useTaskIO(tasks, setTasks);
  
  const {
    isCreateModalOpen,
    taskToEdit,
    isVoiceCommandModalOpen,
    setIsVoiceCommandModalOpen,
    handleEditTask,
    handleTaskFormSubmit,
    handleModalClose,
    handleVoiceTaskCreation,
    handleVoiceCommandSubmit,
    openCreateTaskModal
  } = useTaskModals({ handleCreateTask, handleUpdateTask });

  const {
    activeReminderTask,
    setActiveReminderTask,
    handleSnooze,
    handleActionTaken
  } = useTaskReminders(tasks, handleUpdateTask);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleEditRecurringTask = (task: Task) => {
    setLocation(`/edit-recurring/${task.id}`);
  };

  const handleAddRecurringTask = () => setLocation('/create-recurring');

  const handleViewCompleted = () => {
    setStatusFilter('closed');
    setSelectedDateFilter('all');
    setActiveTab('tasks');
  };

  const handleDashboardCardClick = (dateFilter: 'all' | 'today' | 'next5days' | 'next30days') => {
    setStatusFilter('all');
    setSelectedDateFilter(dateFilter);
    setActiveTab('tasks');
  };

  const handleExportForAssignee = () => {
    setIsExportDialogOpen(true);
  };

  const handleImportAssigned = () => {
    triggerImport('assigned');
  };

  const handleBackupTasks = () => {
    const backupOptions: ExportOptions = {
      exportType: 'backup'
    };
    handleExportTasks(backupOptions);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const importType = event.target.getAttribute('data-import-type') as 'backup' | 'assigned' || 'backup';
    handleImportFileSelect(event, importType);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <input
        type="file"
        ref={importFileRef}
        onChange={handleFileImport}
        accept=".json"
        className="hidden"
      />
      
      <Header
        onNewTask={openCreateTaskModal}
        onImport={() => triggerImport('backup')}
        onExport={() => handleExportTasks()}
        onViewCompleted={handleViewCompleted}
        onVoiceTask={handleVoiceTaskCreation}
        onAddRecurringTask={handleAddRecurringTask}
        onExportForAssignee={handleExportForAssignee}
        onImportAssigned={handleImportAssigned}
        onBackupTasks={handleBackupTasks}
      />

      <div className="relative p-3 sm:p-6 pb-8 -mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="dashboard">
            <DashboardTab
              tasks={tasks}
              pendingTasksCount={getPendingTasksCount()}
              todayTasksCount={getTasksCountByDate('today')}
              next5DaysTasksCount={getTasksCountByDate('next5days')}
              next30DaysTasksCount={getTasksCountByDate('next30days')}
              onCardClick={handleDashboardCardClick}
              onTaskUpdate={handleUpdateTask}
              onTaskEdit={handleEditTask}
            />
          </TabsContent>
          <TabsContent value="tasks">
            <TasksTab
              filteredTasks={filteredTasks}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedDateFilter={selectedDateFilter}
              setSelectedDateFilter={setSelectedDateFilter}
              onUpdate={handleUpdateTask}
              onEdit={handleEditTask}
            />
          </TabsContent>
          <TabsContent value="recurring">
            <RecurringTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleTaskFormSubmit}
        taskToEdit={taskToEdit}
      />

      <VoiceCommandModal
        isOpen={isVoiceCommandModalOpen}
        onClose={() => setIsVoiceCommandModalOpen(false)}
        onSubmit={handleVoiceCommandSubmit}
      />

      <ExportTasksDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExportTasks}
        tasks={tasks}
      />

      <TaskReminderModal
        task={activeReminderTask}
        isOpen={!!activeReminderTask}
        onClose={() => setActiveReminderTask(null)}
        onSnooze={handleSnooze}
        onActionTaken={handleActionTaken}
      />
    </div>
  );
};

export default Index;
