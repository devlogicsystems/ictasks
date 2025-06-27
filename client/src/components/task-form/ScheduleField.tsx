import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { RecurringTemplateFormData, TaskSchedule } from '@/types/task';

const weekDays = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const months = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

export const ScheduleField = () => {
  const { control, watch, setValue } = useFormContext<RecurringTemplateFormData>();
  const schedule = watch('schedule');

  const handleScheduleTypeChange = (type: 'weekly' | 'monthly' | 'yearly') => {
    let newSchedule: TaskSchedule;
    
    if (type === 'weekly') {
      newSchedule = { type: 'weekly', weekDays: [new Date().getDay()] };
    } else if (type === 'monthly') {
      newSchedule = { type: 'monthly', monthDays: [new Date().getDate()] };
    } else {
      const now = new Date();
      newSchedule = { 
        type: 'yearly', 
        yearDates: [{ month: now.getMonth(), day: now.getDate() }] 
      };
    }
    
    setValue('schedule', newSchedule);
  };

  const toggleWeekDay = (day: number) => {
    if (schedule.type === 'weekly') {
      const currentDays = schedule.weekDays;
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day].sort();
      
      setValue('schedule', { ...schedule, weekDays: newDays });
    }
  };

  const toggleMonthDay = (day: number) => {
    if (schedule.type === 'monthly') {
      const currentDays = schedule.monthDays;
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day].sort();
      
      setValue('schedule', { ...schedule, monthDays: newDays });
    }
  };

  const addYearDate = () => {
    if (schedule.type === 'yearly') {
      setValue('schedule', {
        ...schedule,
        yearDates: [...schedule.yearDates, { month: 0, day: 1 }]
      });
    }
  };

  const removeYearDate = (index: number) => {
    if (schedule.type === 'yearly') {
      setValue('schedule', {
        ...schedule,
        yearDates: schedule.yearDates.filter((_, i) => i !== index)
      });
    }
  };

  const updateYearDate = (index: number, month: number, day: number) => {
    if (schedule.type === 'yearly') {
      const newYearDates = [...schedule.yearDates];
      newYearDates[index] = { month, day };
      setValue('schedule', { ...schedule, yearDates: newYearDates });
    }
  };

  return (
    <FormField
      control={control}
      name="schedule"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Task Schedule</FormLabel>
          <div className="space-y-4">
            <Select
              value={schedule.type}
              onValueChange={handleScheduleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            {schedule.type === 'weekly' && (
              <div className="space-y-2">
                <FormLabel className="text-sm">Select weekdays:</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map(day => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={schedule.weekDays.includes(day.value)}
                        onCheckedChange={() => toggleWeekDay(day.value)}
                      />
                      <label htmlFor={`day-${day.value}`} className="text-sm">
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {schedule.type === 'monthly' && (
              <div className="space-y-2">
                <FormLabel className="text-sm">Select days of month (1-30):</FormLabel>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <div key={day} className="flex items-center space-x-1">
                      <Checkbox
                        id={`month-day-${day}`}
                        checked={schedule.monthDays.includes(day)}
                        onCheckedChange={() => toggleMonthDay(day)}
                      />
                      <label htmlFor={`month-day-${day}`} className="text-xs">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: Days above 28 will be adjusted to 28 in February
                </p>
              </div>
            )}

            {schedule.type === 'yearly' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Yearly dates:</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addYearDate}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {schedule.yearDates.map((yearDate, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Select
                      value={yearDate.month.toString()}
                      onValueChange={(value) => updateYearDate(index, parseInt(value), yearDate.day)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={yearDate.day}
                      onChange={(e) => updateYearDate(index, yearDate.month, parseInt(e.target.value) || 1)}
                      className="w-[80px]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeYearDate(index)}
                      disabled={schedule.yearDates.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Warning: Days above 28 will be adjusted to 28 in February
                </p>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};