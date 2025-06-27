import { useState, useEffect } from 'react';
import { RecurringTemplate, RecurringTemplateFormData } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

export const useRecurringTemplates = () => {
  const [templates, setTemplates] = useState<RecurringTemplate[]>([]);
  const { toast } = useToast();

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('recurringTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // Save templates to localStorage whenever templates change
  useEffect(() => {
    localStorage.setItem('recurringTemplates', JSON.stringify(templates));
  }, [templates]);

  const createTemplate = (data: RecurringTemplateFormData) => {
    const newTemplate: RecurringTemplate = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates(prev => [...prev, newTemplate]);
    toast({
      title: "Template created",
      description: "Recurring task template has been created successfully.",
    });
  };

  const updateTemplate = (id: string, data: RecurringTemplateFormData) => {
    setTemplates(prev => prev.map(template => 
      template.id === id 
        ? { ...template, ...data, updatedAt: new Date().toISOString() }
        : template
    ));
    toast({
      title: "Template updated",
      description: "Recurring task template has been updated successfully.",
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === id
        ? { ...template, isDeleted: true, updatedAt: new Date().toISOString() }
        : template
    ));
    toast({
      title: "Template deleted",
      description: "Recurring task template has been marked as deleted.",
    });
  };

  const toggleTemplateStatus = (id: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === id
        ? { 
            ...template, 
            status: template.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          }
        : template
    ));
  };

  // Get active templates (not deleted and active status)
  const getActiveTemplates = () => {
    return templates.filter(template => !template.isDeleted && template.status === 'active');
  };

  // Get all templates excluding deleted ones
  const getVisibleTemplates = () => {
    return templates.filter(template => !template.isDeleted);
  };

  return {
    templates: getVisibleTemplates(),
    activeTemplates: getActiveTemplates(),
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateStatus,
  };
};