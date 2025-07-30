import { Request, Response } from "express";
import { FormService } from "@/services/form.service";
import { AuthenticatedRequest } from "@/types";
import { ApiResponse } from "@/types";

export class FormController {
  /**
   * Create a new form
   */
  static async createForm(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const form = await FormService.createForm(req.user!.id, req.body);

      res.status(201).json({
        success: true,
        data: form,
        message: "Form created successfully",
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all forms for the authenticated user
   */
  static async getForms(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { page = 1, limit = 10, search, status } = req.query;

      const result = await FormService.getUserForms(
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
  }

  /**
   * Get a single form by ID
   */
  static async getForm(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { formId } = req.params;
      const form = await FormService.getFormById(formId, req.user!.id);

      res.status(200).json({
        success: true,
        data: form,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a form
   */
  static async updateForm(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { formId } = req.params;
      const form = await FormService.updateForm(formId, req.user!.id, req.body);

      res.status(200).json({
        success: true,
        data: form,
        message: "Form updated successfully",
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a form
   */
  static async deleteForm(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { formId } = req.params;
      await FormService.deleteForm(formId, req.user!.id);

      res.status(200).json({
        success: true,
        message: "Form deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Duplicate a form
   */
  static async duplicateForm(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { formId } = req.params;
      const form = await FormService.duplicateForm(formId, req.user!.id);

      res.status(201).json({
        success: true,
        data: form,
        message: "Form duplicated successfully",
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get form responses
   */
  static async getFormResponses(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { formId } = req.params;
      const { page = 1, limit = 10, search, dateFrom, dateTo } = req.query;

      const result = await FormService.getFormResponses(
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
  }

  /**
   * Get form statistics
   */
  static async getFormStatistics(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { formId } = req.params;
      const statistics = await FormService.getFormStatistics(
        formId,
        req.user!.id
      );

      res.status(200).json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export form responses
   */
  static async exportResponses(
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> {
    try {
      const { formId } = req.params;
      const exportData = await FormService.exportFormResponses(
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
  }
}
