import { Response } from 'express';
import { getUserProfile, updateUserProfile } from '@/services/auth.service';
import { AuthenticatedRequest } from '@/types';
import { ApiResponse } from '@/types';

export class UserController { 
  /**
   * Get user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = await getUserProfile(req.user!.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = await updateUserProfile(req.user!.id, req.body);

      res.status(200).json({
        success: true,
        data: user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      throw error;
    }
  }
} 