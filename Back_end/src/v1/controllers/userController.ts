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
  adminCreateUser: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email, username, role } = req.body as {
      email?: string;
      username?: string;
      role?: 'admin' | 'user';
    };

    if (!email || !role) {
      apiResponse.error(res, 'Email and role are required', 400);
      return;
    }
    if (role !== 'admin' && role !== 'user') {
      apiResponse.error(res, 'Role must be admin or user', 400);
      return;
    }

    try {
      const user = await userService.adminCreateUser({ email, username, role });
      apiResponse.success(res, user, 201);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      apiResponse.error(res, message, 400);
    }
  },

  createUser: async (req: Request, res: Response): Promise<void> => {
    const { email, password, username } = req.body as {
      email?: string;
      password?: string;
      username?: string;
    };

    if (!email || !password) {
      apiResponse.error(res, 'Email and password are required', 400);
      return;
    }

    try {
      const user = await userService.createUser({ email, password, username, role: 'user' });
      apiResponse.success(res, user, 201);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      apiResponse.error(res, message, 400);
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get user';
      apiResponse.error(res, message, 400);
    }
  },

  getAllUsers: async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      apiResponse.success(res, users);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get users';
      apiResponse.error(res, message, 400);
    }
  },

  loginUser: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      const { user, token } = await userService.loginUser(email, password);
      apiResponse.success(res, { user, token });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      apiResponse.error(res, message, 401);
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      // Handle specific error types
      if (message.includes('Current password')) {
        apiResponse.error(res, message, 400);
      } else if (message.includes('password')) {
        apiResponse.error(res, message, 400);
      } else if (message.includes('Username')) {
        apiResponse.error(res, message, 400);
      } else if (message.includes('profile picture')) {
        apiResponse.error(res, message, 400);
      } else {
        apiResponse.error(res, message, 400);
      }
    }
  },
};
