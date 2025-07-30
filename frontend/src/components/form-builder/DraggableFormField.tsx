import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormField } from "@/contexts/FormBuilderContext";
import { DragTypes, FormFieldDragItem } from "@/types/dnd";
import {
  GripVertical,
  Settings,
  Trash2,
  Type,
  FileText,
  CheckSquare,
  Circle,
  ChevronDown,
  Calendar,
  Layers,
} from "lucide-react";

const fieldIcons = {
  text: Type,
  textarea: FileText,
  radio: Circle,
  checkbox: CheckSquare,
  select: ChevronDown,
  multiselect: Layers,
  date: Calendar,
};

interface DraggableFormFieldProps {
  field: FormField;
  index: number;
  onEditField: (field: FormField) => void;
  onDeleteField: (fieldId: string) => void;
  onMoveField: (dragIndex: number, hoverIndex: number) => void;
}

export function DraggableFormField({
  field,
  index,
  onEditField,
  onDeleteField,
  onMoveField,
}: DraggableFormFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = fieldIcons[field.type];

  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.FORM_FIELD,
    item: { type: DragTypes.FORM_FIELD, fieldId: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: DragTypes.FORM_FIELD,
    hover: (item: FormFieldDragItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMoveField(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <Card
      ref={ref}
      className={`border transition-all duration-200 ${
        isDragging
          ? "opacity-40 scale-95"
          : isOver
          ? "border-primary shadow-md scale-[1.02]"
          : "border-form-field-border hover:border-primary/30"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            <Icon className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium">{field.label}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {field.type.replace(/([A-Z])/g, " $1").trim()}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {field.required && (
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditField(field)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteField(field.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {(field.placeholder || (field.options && field.options.length > 0)) && (
        <CardContent className="pt-0">
          {field.placeholder && (
            <p className="text-sm text-muted-foreground">
              Placeholder: {field.placeholder}
            </p>
          )}
          {field.options && field.options.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Options: {field.options.join(", ")}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
