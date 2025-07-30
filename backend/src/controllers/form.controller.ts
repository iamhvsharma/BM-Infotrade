import { Request, Response } from "express";
import { 
  createForm, 
  getUserForms, 
  getFormById, 
  updateForm, 
  deleteForm, 
  duplicateForm, 
  getFormResponses, 
  getFormStatistics, 
  exportFormResponses 
} from "@/services/form.service";
import { AuthenticatedRequest, ApiResponse } from "@/types";

/**
 * Create a new form
 */
export const createFormController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const form = await createForm(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      data: form,
      message: "Form created successfully",
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get all forms for the authenticated user
 */
export const getFormsController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const result = await getUserForms(
      req.user!.id,
      Number(page),
      Number(limit),
      search as string,
      status as string
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get a single form by ID
 */
export const getFormController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { formId } = req.params;
    const form = await getFormById(formId, req.user!.id);
    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update a form
 */
export const updateFormController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { formId } = req.params;
    const form = await updateForm(formId, req.user!.id, req.body);
    res.status(200).json({
      success: true,
      data: form,
      message: "Form updated successfully",
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a form
 */
export const deleteFormController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { formId } = req.params;
    await deleteForm(formId, req.user!.id);
    res.status(200).json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Duplicate a form
 */
export const duplicateFormController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { formId } = req.params;
    const form = await duplicateForm(formId, req.user!.id);
    res.status(201).json({
      success: true,
      data: form,
      message: "Form duplicated successfully",
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get form responses
 */
export const getFormResponsesController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { formId } = req.params;
    const { page = 1, limit = 10, search, dateFrom, dateTo } = req.query;
    const result = await getFormResponses(
      formId,
      req.user!.id,
      Number(page),
      Number(limit),
      search as string,
      dateFrom as string,
      dateTo as string
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get form statistics
 */
export const getFormStatisticsController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { formId } = req.params;
    const statistics = await getFormStatistics(formId, req.user!.id);
    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Export form responses
 */
export const exportResponsesController = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { formId } = req.params;
    const exportData = await exportFormResponses(
      formId,
      req.user!.id,
      req.body
    );
    const contentType =
      req.body.format === "csv" ? "text/csv" : "application/json";
    const filename = `form-responses-${formId}-${Date.now()}.${req.body.format}`;
    
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.status(200).send(exportData as any);
  } catch (error) {
    throw error;
  }
};