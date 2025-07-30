import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import { useFormBuilder } from '@/contexts/FormBuilderContext';
import { FormField } from '@/contexts/FormBuilderContext';
import { DragTypes, FieldTypeDragItem } from '@/types/dnd';
import { 
  Type, 
  FileText, 
  CheckSquare, 
  Circle, 
  ChevronDown, 
  Calendar,
  Layers,
  GripVertical
} from 'lucide-react';

import { DraggableFieldType } from './DraggableFieldType';

const fieldTypes = [
  {
    type: 'text' as const,
    label: 'Text Input',
    icon: Type,
    description: 'Single line text input'
  },
  {
    type: 'textarea' as const,
    label: 'Textarea',
    icon: FileText,
    description: 'Multi-line text input'
  },
  {
    type: 'radio' as const,
    label: 'Radio Group',
    icon: Circle,
    description: 'Single choice selection'
  },
  {
    type: 'checkbox' as const,
    label: 'Checkbox Group',
    icon: CheckSquare,
    description: 'Multiple choice selection'
  },
  {
    type: 'select' as const,
    label: 'Dropdown',
    icon: ChevronDown,
    description: 'Single select dropdown'
  },
  {
    type: 'multiselect' as const,
    label: 'Multi-Select',
    icon: Layers,
    description: 'Multiple select dropdown'
  },
  {
    type: 'date' as const,
    label: 'Date Picker',
    icon: Calendar,
    description: 'Date selection input'
  }
];

export function FieldTypeSelector() {
  const { state, dispatch } = useFormBuilder();

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${fieldTypes.find(ft => ft.type === type)?.label} Field`,
      placeholder: type === 'text' ? 'Enter text...' : undefined,
      required: false,
      options: ['radio', 'checkbox', 'select', 'multiselect'].includes(type) 
        ? ['Option 1', 'Option 2', 'Option 3'] 
        : undefined,
      order: state.currentForm.fields.length
    };

    dispatch({ type: 'ADD_FIELD', payload: newField });
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground mb-3 px-1">
        Click to add or drag to the form builder
      </div>
      {fieldTypes.map((fieldType) => (
        <DraggableFieldType
          key={fieldType.type}
          fieldType={fieldType}
          onAddField={addField}
        />
      ))}
    </div>
  );
}