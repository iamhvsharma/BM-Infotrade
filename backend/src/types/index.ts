import { Request } from "express";
import { User, Form, FormField, FormResponse } from "@prisma/client";

// Extended Request interface with user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Form related types
export interface FormFieldData {
  id?: string;
  type:
    | "TEXT"
    | "TEXTAREA"
    | "RADIO"
    | "CHECKBOX"
    | "SELECT"
    | "MULTISELECT"
    | "DATE"
    | "EMAIL"
    | "NUMBER"
    | "PHONE"
    | "URL"
    | "FILE";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  order: number;
  section?: string;
}

export interface FormTheme {
  backgroundColor: string;
  inputColor: string;
  labelColor: string;
  fontSize: string;
  alignment: "left" | "center" | "right";
}

export interface CreateFormData {
  title: string;
  description?: string;
  submitButtonText?: string;
  successMessage?: string;
  theme: FormTheme;
  fields: FormFieldData[];
}

export interface UpdateFormData extends Partial<CreateFormData> {
  isPublished?: boolean;
  isActive?: boolean;
}

// Form with fields included
export interface FormWithFields extends Form {
  fields: FormField[];
}

// Form response types
export interface FormResponseData {
  [fieldId: string]: any;
}

export interface CreateFormResponseData {
  data: FormResponseData;
  userAgent?: string;
  ipAddress?: string;
}

// User types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserProfileData {
  name?: string;
  email?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Add missing type definitions
export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateFormInput {
  title: string;
  description?: string;
  submitButtonText?: string;
  successMessage?: string;
  theme: FormTheme;
  fields: FormFieldData[];
}

export interface UpdateFormInput extends Partial<CreateFormInput> {
  isPublished?: boolean;
  isActive?: boolean;
}

export interface FormResponseInput {
  data: FormResponseData;
  userAgent?: string;
  ipAddress?: string;
}

export interface ExportOptionsInput {
  format: "csv" | "json";
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeMetadata?: boolean;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any; // Add details property for validation errors
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form response with form details
export interface FormResponseWithForm extends FormResponse {
  form: Form;
}

// Statistics types
export interface FormStatistics {
  totalResponses: number;
  responsesThisMonth: number;
  averageCompletionTime?: number;
  topFields: Array<{
    fieldId: string;
    fieldLabel: string;
    responseCount: number;
  }>;
}

// Export types
export interface ExportOptions {
  format: "csv" | "json";
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeMetadata?: boolean;
}
