import { Request, Response } from 'express';
import { signup, login, getUserProfile, updateUserProfile, changePassword } from '@/services/auth.service';
import { AuthenticatedRequest } from '@/types';
import { ApiResponse } from '@/types';

/**
 * Register a new user
 */
export const signupController = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const result = await signup(req.body);  

    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
export const loginController = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const result = await login(req.body);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutController = async (req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> => {
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
};

/**
 * Get user profile
 */
export const getProfileController = async (req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const user = await getUserProfile(req.user!.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfileController = async (req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> => {
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
};

/**
 * Change user password
 */
export const changePasswordController = async (req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    await changePassword(req.user!.id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    throw error;
  }
};