// Drag and drop item types
export const DragTypes = {
  FIELD_TYPE: 'FIELD_TYPE',
  FORM_FIELD: 'FORM_FIELD'
} as const;

// Drag item interfaces
export interface FieldTypeDragItem {
  type: typeof DragTypes.FIELD_TYPE;
  fieldType: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'multiselect' | 'date';
  label: string;
}

export interface FormFieldDragItem {
  type: typeof DragTypes.FORM_FIELD;
  fieldId: string;
  index: number;
}