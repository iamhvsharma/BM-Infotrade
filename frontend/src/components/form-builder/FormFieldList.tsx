import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { FormField } from "@/contexts/FormBuilderContext";
import { FormDropZone } from "./FormDropZone";
import { DraggableFormField } from "./DraggableFormField";
import { Plus, X } from "lucide-react";

export function FormFieldList() {
  const { state, dispatch } = useFormBuilder();
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [fieldSettings, setFieldSettings] = useState<Partial<FormField>>({});

  const addField = useCallback(
    (type: FormField["type"]) => {
      const fieldTypeLabels = {
        text: "Text Input",
        textarea: "Textarea",
        radio: "Radio Group",
        checkbox: "Checkbox Group",
        select: "Dropdown",
        multiselect: "Multi-Select",
        date: "Date Picker",
      };

      const newField: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        label: `${fieldTypeLabels[type]} Field`,
        placeholder: type === "text" ? "Enter text..." : undefined,
        required: false,
        options: ["radio", "checkbox", "select", "multiselect"].includes(type)
          ? ["Option 1", "Option 2", "Option 3"]
          : undefined,
        order: state.currentForm.fields.length,
      };

      dispatch({ type: "ADD_FIELD", payload: newField });
    },
    [state.currentForm.fields.length, dispatch]
  );

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setFieldSettings(field);
  };

  const handleSaveField = () => {
    if (editingField) {
      dispatch({
        type: "UPDATE_FORM_FIELD",
        payload: {
          fieldId: editingField.id,
          updates: fieldSettings,
        },
      });
      setEditingField(null);
      setFieldSettings({});
    }
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch({ type: "REMOVE_FIELD", payload: fieldId });
  };

  const handleMoveField = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const fields = [...state.currentForm.fields].sort(
        (a, b) => a.order - b.order
      );
      const dragField = fields[dragIndex];
      const newFields = [...fields];

      newFields.splice(dragIndex, 1);
      newFields.splice(hoverIndex, 0, dragField);

      // Update order for all fields
      const updatedFields = newFields.map((field, index) => ({
        ...field,
        order: index,
      }));

      dispatch({ type: "REORDER_FIELDS", payload: updatedFields });
    },
    [state.currentForm.fields, dispatch]
  );

  const addOption = () => {
    const currentOptions = fieldSettings.options || [];
    setFieldSettings({
      ...fieldSettings,
      options: [...currentOptions, `Option ${currentOptions.length + 1}`],
    });
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = fieldSettings.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setFieldSettings({
      ...fieldSettings,
      options: newOptions,
    });
  };

  const removeOption = (index: number) => {
    const currentOptions = fieldSettings.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    setFieldSettings({
      ...fieldSettings,
      options: newOptions,
    });
  };

  const hasOptions = ["radio", "checkbox", "select", "multiselect"].includes(
    editingField?.type || ""
  );
  const sortedFields = state.currentForm.fields.sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="space-y-4">
      <FormDropZone onAddField={addField}>
        {sortedFields.length === 0 ? null : (
          <div className="space-y-4">
            {sortedFields.map((field, index) => (
              <DraggableFormField
                key={field.id}
                field={field}
                index={index}
                onEditField={handleEditField}
                onDeleteField={handleDeleteField}
                onMoveField={handleMoveField}
              />
            ))}
          </div>
        )}
      </FormDropZone>

      {/* Edit Field Dialog */}
      <Dialog
        open={!!editingField}
        onOpenChange={(open) => !open && setEditingField(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="label">Field Label</Label>
              <Input
                id="label"
                value={fieldSettings.label || ""}
                onChange={(e) =>
                  setFieldSettings({ ...fieldSettings, label: e.target.value })
                }
              />
            </div>

            {(editingField?.type === "text" ||
              editingField?.type === "textarea") && (
              <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={fieldSettings.placeholder || ""}
                  onChange={(e) =>
                    setFieldSettings({
                      ...fieldSettings,
                      placeholder: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {hasOptions && (
              <div>
                <Label>Options</Label>
                <div className="space-y-2">
                  {(fieldSettings.options || []).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required Field</Label>
              <Switch
                id="required"
                checked={fieldSettings.required || false}
                onCheckedChange={(checked) =>
                  setFieldSettings({ ...fieldSettings, required: checked })
                }
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingField(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveField}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
