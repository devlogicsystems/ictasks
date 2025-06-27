import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { RecurringTemplate } from '@/types/task';
import { useRecurringTemplates } from '@/hooks/useRecurringTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Calendar, Clock, Plus, Search, Filter } from 'lucide-react';

interface RecurringTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RecurringTab: React.FC<RecurringTabProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const [recurringFilter, setRecurringFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { templates, toggleTemplateStatus, deleteTemplate } = useRecurringTemplates();

  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    if (recurringFilter === 'active') {
      filtered = filtered.filter(t => t.status === 'active');
    } else if (recurringFilter === 'inactive') {
      filtered = filtered.filter(t => t.status === 'inactive');
    }

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.details && template.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
        template.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [templates, recurringFilter, searchQuery]);

  const handleToggleStatus = (template: RecurringTemplate) => {
    toggleTemplateStatus(template.id);
  };

  const handleDelete = (template: RecurringTemplate) => {
    if (template.status === 'inactive') {
      deleteTemplate(template.id);
    }
  };

  const handleEdit = (template: RecurringTemplate) => {
    // Navigation will be handled by the Link component
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recurring Task Templates</h2>
        <Button asChild>
          <Link to="/create-recurring">Create Template</Link>
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search recurring tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={recurringFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setRecurringFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template List */}
      <div className="space-y-4">
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No recurring templates found</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                {searchQuery || recurringFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first recurring task template to get started.'
                }
              </p>
              {(!searchQuery && recurringFilter === 'all') && (
                <Button asChild>
                  <Link to="/create-recurring">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Recurring Task
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTemplates.map((template) => (
            <Card key={template.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{template.subject}</CardTitle>
                      <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {template.schedule.type === 'weekly' && 
                            `Weekly on ${template.schedule.weekDays.map(day => 
                              ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
                            ).join(', ')}`
                          }
                          {template.schedule.type === 'monthly' && 
                            `Monthly on day(s) ${template.schedule.monthDays.join(', ')}`
                          }
                          {template.schedule.type === 'yearly' && 
                            `Yearly on ${template.schedule.yearDates.map(date => 
                              `${['January', 'February', 'March', 'April', 'May', 'June',
                                 'July', 'August', 'September', 'October', 'November', 'December'][date.month]} ${date.day}`
                            ).join(', ')}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Assignee: {template.assignee}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {template.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <Switch
                        checked={template.status === 'active'}
                        onCheckedChange={() => handleToggleStatus(template)}
                      />
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {(template.details || template.labels.length > 0 || template.url) && (
                <CardContent className="pt-0">
                  {template.details && (
                    <p className="text-sm text-gray-600 mb-3">{template.details}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {template.labels.map((label, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                    
                    {template.url && (
                      <a
                        href={template.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                      >
                        <span>View Link</span>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RecurringTab;