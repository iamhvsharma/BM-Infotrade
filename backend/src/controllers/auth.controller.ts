import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { AuthenticatedRequest } from '@/types';
import { ApiResponse } from '@/types';

export class AuthController {
  /**
   * Register a new user
   */
  static async signup(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const result = await AuthService.signup(req.body);

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response<ApiResponse>): Promise<void> {
    try {
      const result = await AuthService.login(req.body);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success response
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = await AuthService.getUserProfile(req.user!.id);

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
      const user = await AuthService.updateUserProfile(req.user!.id, req.body);

      res.status(200).json({
        success: true,
        data: user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;

      await AuthService.changePassword(req.user!.id, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      throw error;
    }
  }
} 