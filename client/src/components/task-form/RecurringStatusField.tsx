import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecurringTemplateFormData, RecurringTaskStatus } from '@/types/task';

interface RecurringStatusFieldProps {
  disabled?: boolean;
}

export const RecurringStatusField: React.FC<RecurringStatusFieldProps> = ({ disabled = false }) => {
  const { control } = useFormContext<RecurringTemplateFormData>();
  
  const statuses: { value: RecurringTaskStatus; label: string; description: string }[] = [
    { 
      value: 'active', 
      label: 'Active', 
      description: 'Template will generate tasks automatically' 
    },
    { 
      value: 'inactive', 
      label: 'Inactive', 
      description: 'Template is paused and will not generate tasks' 
    },
  ];

  return (
    <FormField
      control={control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Template Status</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select template status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex flex-col">
                    <span>{status.label}</span>
                    <span className="text-xs text-muted-foreground">{status.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};