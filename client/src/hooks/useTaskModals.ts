import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { TaskFormData } from '@/lib/validations/task';
import { mapTaskFormDataToTask } from '@/lib/taskUtils';
import { parseVoiceCommand } from '@/lib/voiceParser';

interface UseTaskModalsProps {
  handleCreateTask: (data: TaskFormData) => void;
  handleUpdateTask: (task: Task) => void;
}

export const useTaskModals = ({ handleCreateTask, handleUpdateTask }: UseTaskModalsProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isVoiceCommandModalOpen, setIsVoiceCommandModalOpen] = useState(false);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsCreateModalOpen(true);
  };

  const handleTaskFormSubmit = (data: TaskFormData, status?: TaskStatus) => {
    if (taskToEdit) {
      const updatedTask = mapTaskFormDataToTask(data, taskToEdit);
      if (status) {
        updatedTask.status = status;
      }
      handleUpdateTask(updatedTask);
    } else {
      handleCreateTask(data);
    }
    setIsCreateModalOpen(false);
    setTaskToEdit(null);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setTaskToEdit(null);
  };

  const handleVoiceTaskCreation = () => {
    setIsVoiceCommandModalOpen(true);
  };

  const handleVoiceCommandSubmit = (transcript: string) => {
    const parsedData = parseVoiceCommand(transcript);
    const taskData: TaskFormData = {
      subject: parsedData.subject || transcript,
      details: '',
      assignee: parsedData.assignee || '',
      dueDate: parsedData.dueDate || '',
      dueTime: parsedData.dueTime || '',
      isFullDay: parsedData.isFullDay || false,
      reminderTime: parsedData.reminderTime || '',
      labels: [],
      url: '',
      recurrence: undefined,
    };
    handleCreateTask(taskData);
    setIsVoiceCommandModalOpen(false);
  };

  const openCreateTaskModal = () => {
    setTaskToEdit(null);
    setIsCreateModalOpen(true);
  };

  return {
    isCreateModalOpen,
    taskToEdit,
    isVoiceCommandModalOpen,
    setIsVoiceCommandModalOpen,
    handleEditTask,
    handleTaskFormSubmit,
    handleModalClose,
    handleVoiceTaskCreation,
    handleVoiceCommandSubmit,
    openCreateTaskModal,
  };
};
