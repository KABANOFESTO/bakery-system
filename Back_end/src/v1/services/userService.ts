import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import userDTO from '../DTOs/userDTO';
import { prisma } from '../config/database';
import { uploadToCloudinary } from '../utils/cloudinary';
import { emailService } from '../utils/emailService';

type UserData = {
  email: string;
  password: string;
  username?: string;
  role?: string;
};

type AdminCreateUserData = {
  email: string;
  username?: string;
  role: 'admin' | 'user';
};

type LoginResponse = {
  user: ReturnType<typeof userDTO.getUserDTO>;
  token: string;
};

type UpdateProfileData = {
  username?: string;
  profilePicture?: Express.Multer.File;
  currentPassword?: string;
  newPassword?: string;
};

export const userService = {
  createUser: async (userData: UserData): Promise<ReturnType<typeof userDTO.getUserDTO>> => {
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new Error('Email is already in use');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        username: userData.username,
        role: userData.role || 'user',
      },
    });
    return userDTO.getUserDTO(user);
  },

  adminCreateUser: async (userData: AdminCreateUserData): Promise<ReturnType<typeof userDTO.getUserDTO>> => {
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) throw new Error('Email is already in use');

    const temporaryPassword = randomBytes(9).toString('base64url');
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        role: userData.role,
        password: hashedPassword,
      },
    });

    try {
      await emailService.sendUserCredentialsEmail({
        to: user.email,
        temporaryPassword,
      });
    } catch (error) {
      await prisma.user.delete({ where: { id: user.id } });
      throw error;
    }

    return userDTO.getUserDTO(user);
  },

  getUserById: async (userId: string): Promise<ReturnType<typeof userDTO.getUserDTO> | null> => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user ? userDTO.getUserDTO(user) : null;
  },

  getAllUsers: async (): Promise<ReturnType<typeof userDTO.getUserDTO>[]> => {
    const users = await prisma.user.findMany();
    return users.map(userDTO.getUserDTO);
  },

  loginUser: async (email: string, password: string): Promise<LoginResponse> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { user: userDTO.getUserDTO(user), token };
  },

  updateProfile: async (userId: string, updateData: UpdateProfileData): Promise<ReturnType<typeof userDTO.getUpdateProfileDTO>> => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const updatePayload: any = {};

    // Handle username update
    if (updateData.username !== undefined && updateData.username !== user.username) {
      // Check if username is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          username: updateData.username,
          id: { not: userId }
        }
      });
      if (existingUser) {
        throw new Error('Username is already taken');
      }
      updatePayload.username = updateData.username;
    }

    // Handle password update
    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new Error('Current password is required to change password');
      }

      const isPasswordValid = await bcrypt.compare(updateData.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      if (updateData.newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      updatePayload.password = await bcrypt.hash(updateData.newPassword, 10);
    }

    // Handle profile picture upload
    if (updateData.profilePicture) {
      try {
        const imageUrl = await uploadToCloudinary(updateData.profilePicture);
        updatePayload.profilePicture = imageUrl;
      } catch (error: any) {
        throw new Error(`Failed to upload profile picture: ${error.message}`);
      }
    }

    // Update user if there are changes
    if (Object.keys(updatePayload).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: updatePayload,
      });
    }

    // Fetch updated user to return
    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!updatedUser) throw new Error('Failed to retrieve updated user');

    return {
      username: updatedUser.username || undefined,
      profilePicture: updatedUser.profilePicture || undefined,
    };
  },
};
