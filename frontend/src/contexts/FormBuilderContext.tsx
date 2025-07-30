import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'multiselect' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  order: number;
  section?: string;
}

export interface FormData {
  id?: string;
  title: string;
  description: string;
  submitButtonText: string;
  successMessage: string;
  fields: FormField[];
  theme: {
    backgroundColor: string;
    inputColor: string;
    labelColor: string;
    fontSize: string;
    alignment: 'left' | 'center' | 'right';
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}

interface FormBuilderState {
  currentForm: FormData;
  savedForms: FormData[];
  submissions: FormSubmission[];
  isPreviewMode: boolean;
  draggedField: FormField | null;
}

type FormBuilderAction =
  | { type: 'SET_CURRENT_FORM'; payload: FormData }
  | { type: 'UPDATE_FORM_FIELD'; payload: { fieldId: string; updates: Partial<FormField> } }
  | { type: 'ADD_FIELD'; payload: FormField }
  | { type: 'REMOVE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: FormField[] }
  | { type: 'SET_FORM_SETTINGS'; payload: Partial<FormData> }
  | { type: 'TOGGLE_PREVIEW'; payload?: boolean }
  | { type: 'SET_DRAGGED_FIELD'; payload: FormField | null }
  | { type: 'LOAD_SAVED_FORMS'; payload: FormData[] }
  | { type: 'SAVE_FORM'; payload: FormData }
  | { type: 'DELETE_FORM'; payload: string }
  | { type: 'ADD_SUBMISSION'; payload: FormSubmission };

const initialFormData: FormData = {
  title: 'Untitled Form',
  description: 'Form description',
  submitButtonText: 'Submit',
  successMessage: 'Thank you for your submission!',
  fields: [],
  theme: {
    backgroundColor: '#ffffff',
    inputColor: '#f8fafc',
    labelColor: '#1e293b',
    fontSize: '16px',
    alignment: 'left'
  }
};

const initialState: FormBuilderState = {
  currentForm: initialFormData,
  savedForms: [],
  submissions: [],
  isPreviewMode: false,
  draggedField: null
};

function formBuilderReducer(state: FormBuilderState, action: FormBuilderAction): FormBuilderState {
  switch (action.type) {
    case 'SET_CURRENT_FORM':
      return { ...state, currentForm: action.payload };
    
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: state.currentForm.fields.map(field =>
            field.id === action.payload.fieldId
              ? { ...field, ...action.payload.updates }
              : field
          )
        }
      };
    
    case 'ADD_FIELD':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: [...state.currentForm.fields, action.payload]
        }
      };
    
    case 'REMOVE_FIELD':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: state.currentForm.fields.filter(field => field.id !== action.payload)
        }
      };
    
    case 'REORDER_FIELDS':
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          fields: action.payload
        }
      };
    
    case 'SET_FORM_SETTINGS':
      return {
        ...state,
        currentForm: { ...state.currentForm, ...action.payload }
      };
    
    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        isPreviewMode: action.payload !== undefined ? action.payload : !state.isPreviewMode
      };
    
    case 'SET_DRAGGED_FIELD':
      return { ...state, draggedField: action.payload };
    
    case 'LOAD_SAVED_FORMS':
      return { ...state, savedForms: action.payload };
    
    case 'SAVE_FORM':
      const existingIndex = state.savedForms.findIndex(form => form.id === action.payload.id);
      const updatedForms = existingIndex >= 0
        ? state.savedForms.map((form, index) => index === existingIndex ? action.payload : form)
        : [...state.savedForms, action.payload];
      return { ...state, savedForms: updatedForms };
    
    case 'DELETE_FORM':
      return {
        ...state,
        savedForms: state.savedForms.filter(form => form.id !== action.payload)
      };
    
    case 'ADD_SUBMISSION':
      return {
        ...state,
        submissions: [...state.submissions, action.payload]
      };
    
    default:
      return state;
  }
}

interface FormBuilderContextType {
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export function FormBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  return (
    <FormBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}