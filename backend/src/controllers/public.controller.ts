import { Request, Response } from 'express';
import { FormService } from '@/services/form.service';
import { ApiResponse } from '@/types';

export class PublicController {
  /**
   * Get a public form by ID
   */
  static async getForm(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { formId } = req.params;
      const form = await FormService.getPublicForm(formId);

      res.status(200).json({
        success: true,
        data: form,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Submit a form response
   */
  static async submitForm(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const { formId } = req.params;
      const { data, userAgent, ipAddress } = req.body;

      // Get client IP address
      const clientIP = ipAddress || req.ip || req.connection.remoteAddress || 'unknown';

      await FormService.submitFormResponse(formId, {
        data,
        userAgent,
        ipAddress: clientIP,
      });

      res.status(200).json({
        success: true,
        message: 'Form submitted successfully',
      });
    } catch (error) {
      throw error;
    }
  }
} 