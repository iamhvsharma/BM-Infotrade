import { z } from 'zod';

// Field type enum
const fieldTypeEnum = z.enum([
  'TEXT',
  'TEXTAREA',
  'RADIO',
  'CHECKBOX',
  'SELECT',
  'MULTISELECT',
  'DATE',
  'EMAIL',
  'NUMBER',
  'PHONE',
  'URL',
  'FILE',
]);

// Theme alignment enum
const alignmentEnum = z.enum(['left', 'center', 'right']);

// Form field schema
export const formFieldSchema = z.object({
  id: z.string().optional(),
  type: fieldTypeEnum,
  label: z.string().min(1, 'Label is required').max(100, 'Label is too long'),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  order: z.number().int().min(0, 'Order must be a non-negative integer'),
  section: z.string().optional(),
});

// Form theme schema
export const formThemeSchema = z.object({
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid background color format'),
  inputColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid input color format'),
  labelColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid label color format'),
  fontSize: z.string().regex(/^\d+px$/, 'Font size must be in px format'),
  alignment: alignmentEnum,
});

// Create form schema
export const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  submitButtonText: z.string().default('Submit'),
  successMessage: z.string().default('Thank you for your submission!'),
  theme: formThemeSchema,
  fields: z.array(formFieldSchema).min(1, 'At least one field is required'),
});

// Update form schema
export const updateFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long').optional(),
  description: z.string().optional(),
  submitButtonText: z.string().optional(),
  successMessage: z.string().optional(),
  theme: formThemeSchema.optional(),
  fields: z.array(formFieldSchema).optional(),
  isPublished: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// Form response schema
export const formResponseSchema = z.object({
  data: z.record(z.any()),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10),
});

// Form search/filter schema
export const formSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'published', 'draft', 'active', 'inactive']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'responses']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Form response search/filter schema
export const formResponseSearchSchema = z.object({
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(['submittedAt', 'id']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Export options schema
export const exportOptionsSchema = z.object({
  format: z.enum(['csv', 'json']).default('csv'),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }).optional(),
  includeMetadata: z.boolean().default(false),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;
export type FormResponseInput = z.infer<typeof formResponseSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type FormSearchInput = z.infer<typeof formSearchSchema>;
export type FormResponseSearchInput = z.infer<typeof formResponseSearchSchema>;
export type ExportOptionsInput = z.infer<typeof exportOptionsSchema>; 