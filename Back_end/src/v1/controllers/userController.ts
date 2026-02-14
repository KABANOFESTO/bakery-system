import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { apiResponse } from '../utils/apiResponse';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const userController = {
  createUser: async (req: Request, res: Response): Promise<void> => {
    const userData = req.body;
    try {
      const user = await userService.createUser(userData);
      apiResponse.success(res, user, 201);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  getUser: async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        apiResponse.error(res, 'User not found', 404);
        return;
      }
      apiResponse.success(res, user);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  getAllUsers: async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      apiResponse.success(res, users);
    } catch (error: any) {
      apiResponse.error(res, error.message, 400);
    }
  },

  loginUser: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      const { user, token } = await userService.loginUser(email, password);
      apiResponse.success(res, { user, token });
    } catch (error: any) {
      apiResponse.error(res, error.message, 401);
    }
  },

  updateProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        apiResponse.error(res, 'User not authenticated', 401);
        return;
      }

      const updateData: any = {};
      
      // Extract form data
      if (req.body.username) {
        updateData.username = req.body.username;
      }
      
      if (req.body.current_password) {
        updateData.currentPassword = req.body.current_password;
      }
      
      if (req.body.new_password) {
        updateData.newPassword = req.body.new_password;
      }

      // Handle file upload
      if (req.file) {
        updateData.profilePicture = req.file;
      }

      const result = await userService.updateProfile(userId, updateData);
      // Return in format expected by frontend (snake_case)
      apiResponse.success(res, {
        username: result.username,
        profile_picture: result.profilePicture,
      });
    } catch (error: any) {
      // Handle specific error types
      if (error.message.includes('Current password')) {
        apiResponse.error(res, error.message, 400);
      } else if (error.message.includes('password')) {
        apiResponse.error(res, error.message, 400);
      } else if (error.message.includes('Username')) {
        apiResponse.error(res, error.message, 400);
      } else if (error.message.includes('profile picture')) {
        apiResponse.error(res, error.message, 400);
      } else {
        apiResponse.error(res, error.message || 'Failed to update profile', 400);
      }
    }
  },
};
