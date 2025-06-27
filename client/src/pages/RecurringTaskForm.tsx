
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useRoute, Link } from 'wouter';
import { useRecurringTemplates } from '@/hooks/useRecurringTemplates';
import { recurringTemplateFormSchema } from '@/lib/validations/task';
import { RecurringTemplateFormData } from '@/types/task';

import { SubjectField } from '@/components/task-form/SubjectField';
import { DetailsField } from '@/components/task-form/DetailsField';
import { AssigneeField } from '@/components/task-form/AssigneeField';
import { LabelsField } from '@/components/task-form/LabelsField';
import { UrlField } from '@/components/task-form/UrlField';
import { ScheduleField } from '@/components/task-form/ScheduleField';
import { RecurringStatusField } from '@/components/task-form/RecurringStatusField';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";

const RecurringTaskForm = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/edit-recurring/:id');
  const id = params?.id;
  const { templates, createTemplate, updateTemplate } = useRecurringTemplates();
  const { toast } = useToast();

  const isEditing = Boolean(id);
  const templateToEdit = isEditing ? templates.find(t => t.id === id) : undefined;

  const form = useForm<RecurringTemplateFormData>({
    resolver: zodResolver(recurringTemplateFormSchema),
    defaultValues: {
      subject: '',
      details: '',
      assignee: '',
      labels: [],
      url: '',
      schedule: {
        type: 'weekly',
        weekDays: [new Date().getDay()],
      },
      status: 'active',
    },
  });

  useEffect(() => {
    if (isEditing && templateToEdit) {
      form.reset({
        subject: templateToEdit.subject,
        details: templateToEdit.details || '',
        assignee: templateToEdit.assignee,
        labels: templateToEdit.labels,
        url: templateToEdit.url || '',
        schedule: templateToEdit.schedule,
        status: templateToEdit.status,
      });
    }
  }, [isEditing, templateToEdit, form]);

  const onSubmit = (data: RecurringTemplateFormData) => {
    if (isEditing && templateToEdit) {
      updateTemplate(templateToEdit.id, data);
    } else {
      createTemplate(data);
    }
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit' : 'New'} Recurring Task Template</CardTitle>
          <CardDescription>
            {isEditing ? 'Update the template for this recurring task.' : 'Create a template for tasks that need to be repeated. Instances will be generated automatically based on these settings.'}
          </CardDescription>
        </CardHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto p-6">
              <SubjectField />
              <DetailsField />
              <AssigneeField />
              <LabelsField />
              <UrlField />
              <ScheduleField />
              <RecurringStatusField />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6">
              <Button type="button" variant="ghost" asChild>
                <Link to="/">Cancel</Link>
              </Button>
              <Button type="submit">{isEditing ? 'Update' : 'Create'} Template</Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default RecurringTaskForm;
