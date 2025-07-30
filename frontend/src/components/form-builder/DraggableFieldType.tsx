import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import { useFormBuilder } from '@/contexts/FormBuilderContext';
import { FormField } from '@/contexts/FormBuilderContext';
import { DragTypes } from '@/types/dnd';
import { GripVertical } from 'lucide-react';

interface DraggableFieldTypeProps {
  fieldType: {
    type: FormField['type'];
    label: string;
    icon: React.ComponentType<any>;
    description: string;
  };
  onAddField: (type: FormField['type']) => void;
}

export function DraggableFieldType({ fieldType, onAddField }: DraggableFieldTypeProps) {
  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.FIELD_TYPE,
    item: {
      type: DragTypes.FIELD_TYPE,
      fieldType: fieldType.type,
      label: fieldType.label
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const Icon = fieldType.icon;

  return (
    <Button
      ref={drag}
      variant="outline"
      className={`w-full justify-start h-auto p-3 transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 scale-95' : 'hover:bg-form-field-hover hover:shadow-md'
      }`}
      onClick={() => onAddField(fieldType.type)}
    >
      <div className="flex items-start space-x-3 w-full">
        <GripVertical className="w-4 h-4 mt-0.5 text-muted-foreground opacity-50" />
        <Icon className="w-4 h-4 mt-0.5 text-primary" />
        <div className="text-left flex-1">
          <div className="font-medium text-sm">{fieldType.label}</div>
          <div className="text-xs text-muted-foreground">{fieldType.description}</div>
        </div>
      </div>
    </Button>
  );
}