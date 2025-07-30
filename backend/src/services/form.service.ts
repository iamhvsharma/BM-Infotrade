import prisma from "@/config/database";
import {
  CreateFormInput,
  UpdateFormInput,
  FormWithFields,
  FormResponseInput,
  PaginatedResponse,
  FormStatistics,
  ExportOptionsInput,
} from "@/types";
import { NotFoundError, BadRequestError } from "@/middleware/error.middleware";

export class FormService {
  /**
   * Create a new form
   */
  static async createForm(
    userId: string,
    formData: CreateFormInput
  ): Promise<FormWithFields> {
    const { fields, ...formInfo } = formData;

    const form = await prisma.form.create({
      data: {
        ...formInfo,
        theme: formInfo.theme as any,
        userId,
        fields: {
          create: fields.map((field: any, index: number) => ({
            ...field,
            order: field.order ?? index,
          })),
        },
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    return form as FormWithFields;
  }

  /**
   * Get all forms for a user with pagination
   */
  static async getUserForms(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string
  ): Promise<PaginatedResponse<FormWithFields>> {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      switch (status) {
        case "published":
          where.isPublished = true;
          break;
        case "draft":
          where.isPublished = false;
          break;
        case "active":
          where.isActive = true;
          break;
        case "inactive":
          where.isActive = false;
          break;
      }
    }

    const [forms, total] = await Promise.all([
      prisma.form.findMany({
        where,
        include: {
          fields: {
            orderBy: { order: "asc" },
          },
          _count: {
            select: { responses: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.form.count({ where }),
    ]);

    return {
      data: forms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single form by ID
   */
  static async getFormById(
    formId: string,
    userId?: string
  ): Promise<FormWithFields> {
    const where: any = { id: formId };

    // If userId is provided, ensure the user owns the form
    if (userId) {
      where.userId = userId;
    }

    const form = await prisma.form.findFirst({
      where,
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!form) {
      throw new NotFoundError("Form not found");
    }

    return form;
  }

  /**
   * Get a public form by ID (for form submission)
   */
  static async getPublicForm(formId: string): Promise<FormWithFields> {
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        isPublished: true,
        isActive: true,
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!form) {
      throw new NotFoundError("Form not found or not published");
    }

    return form;
  }

  /**
   * Update a form
   */
  static async updateForm(
    formId: string,
    userId: string,
    updateData: UpdateFormInput
  ): Promise<FormWithFields> {
    const { fields, ...formInfo } = updateData;

    // Check if form exists and belongs to user
    const existingForm = await prisma.form.findFirst({
      where: { id: formId, userId },
    });

    if (!existingForm) {
      throw new NotFoundError("Form not found");
    }

    // Update form and fields in a transaction
    const form = await prisma.$transaction(async (tx: any) => {
      // Update form info
      const updatedForm = await tx.form.update({
        where: { id: formId },
        data: formInfo,
      });

      // Update fields if provided
      if (fields) {
        // Delete existing fields
        await tx.formField.deleteMany({
          where: { formId },
        });

        // Create new fields
        await tx.formField.createMany({
          data: fields.map((field: any, index: number) => ({
            ...field,
            formId,
            order: field.order ?? index,
          })),
        });
      }

      // Return updated form with fields
      return tx.form.findUnique({
        where: { id: formId },
        include: {
          fields: {
            orderBy: { order: "asc" },
          },
        },
      });
    });

    return form!;
  }

  /**
   * Delete a form
   */
  static async deleteForm(formId: string, userId: string): Promise<void> {
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
    });

    if (!form) {
      throw new NotFoundError("Form not found");
    }

    await prisma.form.delete({
      where: { id: formId },
    });
  }

  /**
   * Duplicate a form
   */
  static async duplicateForm(
    formId: string,
    userId: string
  ): Promise<FormWithFields> {
    const originalForm = await prisma.form.findFirst({
      where: { id: formId, userId },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!originalForm) {
      throw new NotFoundError("Form not found");
    }

    const { id, createdAt, updatedAt, ...formData } = originalForm;
    const { fields, ...formInfo } = formData;

    const duplicatedForm = await prisma.form.create({
      data: {
        ...formInfo,
        title: `${formInfo.title} (Copy)`,
        isPublished: false,
        theme: formInfo.theme as any,
        userId,
        fields: {
          create: fields.map((field: any) => {
            const {
              id: fieldId,
              createdAt: fieldCreatedAt,
              updatedAt: fieldUpdatedAt,
              formId: _,
              ...fieldData
            } = field;
            return fieldData;
          }),
        },
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    return duplicatedForm as FormWithFields;
  }

  /**
   * Submit a form response
   */
  static async submitFormResponse(
    formId: string,
    responseData: FormResponseInput,
    userId?: string
  ): Promise<void> {
    // Verify form exists and is published
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        isPublished: true,
        isActive: true,
      },
      include: {
        fields: true,
      },
    });

    if (!form) {
      throw new NotFoundError("Form not found or not published");
    }

    // Validate response data against form fields
    this.validateFormResponse(form.fields, responseData.data);

    // Create response
    await prisma.formResponse.create({
      data: {
        formId,
        data: responseData.data,
        userAgent: responseData.userAgent,
        ipAddress: responseData.ipAddress,
        userId,
      },
    });
  }

  /**
   * Get form responses with pagination
   */
  static async getFormResponses(
    formId: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;

    // Verify form belongs to user
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
    });

    if (!form) {
      throw new NotFoundError("Form not found");
    }

    // Build where clause
    const where: any = { formId };

    if (dateFrom || dateTo) {
      where.submittedAt = {};
      if (dateFrom) where.submittedAt.gte = new Date(dateFrom);
      if (dateTo) where.submittedAt.lte = new Date(dateTo);
    }

    const [responses, total] = await Promise.all([
      prisma.formResponse.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.formResponse.count({ where }),
    ]);

    return {
      data: responses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get form statistics
   */
  static async getFormStatistics(
    formId: string,
    userId: string
  ): Promise<FormStatistics> {
    // Verify form belongs to user
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
    });

    if (!form) {
      throw new NotFoundError("Form not found");
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalResponses, responsesThisMonth, fields] = await Promise.all([
      prisma.formResponse.count({
        where: { formId },
      }),
      prisma.formResponse.count({
        where: {
          formId,
          submittedAt: { gte: startOfMonth },
        },
      }),
      prisma.formField.findMany({
        where: { formId },
        select: { id: true, label: true },
      }),
    ]);

    // Get top fields (simplified - in a real app, you'd analyze response data)
    const topFields = fields.slice(0, 5).map((field: any) => ({
      fieldId: field.id,
      fieldLabel: field.label,
      responseCount: Math.floor(Math.random() * totalResponses), // Placeholder
    }));

    return {
      totalResponses,
      responsesThisMonth,
      topFields,
    };
  }

  /**
   * Export form responses
   */
  static async exportFormResponses(
    formId: string,
    userId: string,
    options: ExportOptionsInput
  ): Promise<string> {
    // Verify form belongs to user
    const form = await prisma.form.findFirst({
      where: { id: formId, userId },
      include: { fields: true },
    });

    if (!form) {
      throw new NotFoundError("Form not found");
    }

    // Get responses
    const where: any = { formId };
    if (options.dateRange) {
      where.submittedAt = {
        gte: new Date(options.dateRange.start),
        lte: new Date(options.dateRange.end),
      };
    }

    const responses = await prisma.formResponse.findMany({
      where,
      orderBy: { submittedAt: "desc" },
    });

    if (options.format === "csv") {
      return this.generateCSVExport(form, responses, options.includeMetadata);
    } else {
      return JSON.stringify(responses, null, 2);
    }
  }

  /**
   * Validate form response against form fields
   */
  private static validateFormResponse(fields: any[], responseData: any): void {
    for (const field of fields) {
      if (field.required && !responseData[field.id]) {
        throw new BadRequestError(`Field '${field.label}' is required`);
      }
    }
  }

  /**
   * Generate CSV export
   */
  private static generateCSVExport(
    form: any,
    responses: any[],
    includeMetadata: boolean = false
  ): string {
    const headers = [
      "Submission Date",
      ...form.fields.map((f: any) => f.label),
    ];
    if (includeMetadata) {
      headers.push("User Agent", "IP Address");
    }

    const rows = responses.map((response) => {
      const row = [
        new Date(response.submittedAt).toISOString(),
        ...form.fields.map((field: any) => {
          const value = response.data[field.id];
          return Array.isArray(value) ? value.join(", ") : value || "";
        }),
      ];

      if (includeMetadata) {
        row.push(response.userAgent || "", response.ipAddress || "");
      }

      return row;
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  }
}
