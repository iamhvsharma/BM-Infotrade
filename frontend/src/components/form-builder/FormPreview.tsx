import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFormBuilder } from '@/contexts/FormBuilderContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface FormPreviewProps {
  compact?: boolean;
  onSubmit?: (data: Record<string, any>) => void;
}

export function FormPreview({ compact = false, onSubmit }: FormPreviewProps) {
  const { state } = useFormBuilder();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    state.currentForm.fields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        newErrors[field.id] = 'This field is required';
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData);
    }
  };

  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const renderField = (field: any) => {
    const hasError = !!errors[field.id];
    
    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn("text-sm font-medium", hasError && "text-destructive")}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              className={cn(hasError && "border-destructive")}
            />
            {hasError && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn("text-sm font-medium", hasError && "text-destructive")}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ''}
              onChange={(e) => updateFormData(field.id, e.target.value)}
              className={cn(hasError && "border-destructive")}
              rows={3}
            />
            {hasError && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label className={cn("text-sm font-medium", hasError && "text-destructive")}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup
              value={formData[field.id] || ''}
              onValueChange={(value) => updateFormData(field.id, value)}
              className={cn(hasError && "border border-destructive rounded-md p-2")}
            >
              {field.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {hasError && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <Label className={cn("text-sm font-medium", hasError && "text-destructive")}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className={cn("space-y-2", hasError && "border border-destructive rounded-md p-2")}>
              {field.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${index}`}
                    checked={(formData[field.id] || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = formData[field.id] || [];
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      updateFormData(field.id, newValues);
                    }}
                  />
                  <Label htmlFor={`${field.id}-${index}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
            {hasError && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label className={cn("text-sm font-medium", hasError && "text-destructive")}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.id] || ''}
              onValueChange={(value) => updateFormData(field.id, value)}
            >
              <SelectTrigger className={cn(hasError && "border-destructive")}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string, index: number) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label className={cn("text-sm font-medium", hasError && "text-destructive")}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData[field.id] && "text-muted-foreground",
                    hasError && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData[field.id] ? format(formData[field.id], "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData[field.id]}
                  onSelect={(date) => updateFormData(field.id, date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {hasError && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (state.currentForm.fields.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Add fields to see form preview</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className={cn("font-bold", compact ? "text-lg" : "text-2xl")}>
          {state.currentForm.title}
        </h2>
        <p className={cn("text-muted-foreground", compact ? "text-sm" : "text-base")}>
          {state.currentForm.description}
        </p>
      </div>

      <div className="space-y-4">
        {state.currentForm.fields
          .sort((a, b) => a.order - b.order)
          .map(renderField)}
      </div>

      <Button 
        type="submit" 
        className={cn("w-full bg-gradient-primary", compact && "text-sm")}
      >
        {state.currentForm.submitButtonText}
      </Button>
    </form>
  );
}