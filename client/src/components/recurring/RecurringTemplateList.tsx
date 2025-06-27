import React from 'react';
import { Link } from 'wouter';
import { RecurringTemplate } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Calendar, Clock } from 'lucide-react';

interface RecurringTemplateListProps {
  templates: RecurringTemplate[];
  onToggleStatus: (template: RecurringTemplate) => void;
  onEdit: (template: RecurringTemplate) => void;
  onDelete: (template: RecurringTemplate) => void;
}

const RecurringTemplateList: React.FC<RecurringTemplateListProps> = ({
  templates,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const formatSchedule = (template: RecurringTemplate): string => {
    const { schedule } = template;
    
    if (schedule.type === 'weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const selectedDays = schedule.weekDays.map(day => days[day]).join(', ');
      return `Weekly: ${selectedDays}`;
    }
    
    if (schedule.type === 'monthly') {
      const days = schedule.monthDays.join(', ');
      return `Monthly: Day${schedule.monthDays.length > 1 ? 's' : ''} ${days}`;
    }
    
    if (schedule.type === 'yearly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dates = schedule.yearDates.map(date => `${months[date.month]} ${date.day}`).join(', ');
      return `Yearly: ${dates}`;
    }
    
    return 'Unknown schedule';
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No recurring templates</h3>
        <p className="mt-2 text-muted-foreground">
          Create your first recurring task template to get started.
        </p>
        <Button asChild className="mt-4">
          <Link to="/create-recurring">Create Template</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {template.subject}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={template.status === 'active'}
                  onCheckedChange={() => onToggleStatus(template)}
                />
                <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                  {template.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {template.details && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.details}
              </p>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium">Assignee:</span>
                <span className="ml-2 text-muted-foreground">{template.assignee}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">{formatSchedule(template)}</span>
              </div>
              
              {template.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {template.labels.map((label, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/edit-recurring/${template.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              
              {template.status === 'inactive' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(template)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecurringTemplateList;