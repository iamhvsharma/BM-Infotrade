import React from 'react';
import { useDrop } from 'react-dnd';
import { useFormBuilder } from '@/contexts/FormBuilderContext';
import { FormField } from '@/contexts/FormBuilderContext';
import { DragTypes, FieldTypeDragItem } from '@/types/dnd';
import { Plus } from 'lucide-react';

interface FormDropZoneProps {
  children: React.ReactNode;
  onAddField: (type: FormField['type']) => void;
}

export function FormDropZone({ children, onAddField }: FormDropZoneProps) {
  const { state } = useFormBuilder();
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DragTypes.FIELD_TYPE,
    drop: (item: FieldTypeDragItem) => {
      onAddField(item.fieldType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`min-h-[400px] transition-all duration-200 rounded-lg border-2 border-dashed ${
        isActive
          ? 'border-primary bg-primary/5 shadow-lg'
          : canDrop
          ? 'border-primary/50 bg-primary/2'
          : 'border-transparent'
      }`}
    >
      {state.currentForm.fields.length === 0 && !isActive ? (
        <div className="flex items-center justify-center h-96 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-drag-zone flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Drag fields here to start building</h3>
              <p className="text-muted-foreground">
                Or click the field types on the left to add them
              </p>
            </div>
          </div>
        </div>
      ) : isActive ? (
        <div className="flex items-center justify-center h-32 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium text-primary">Drop to add field</p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}