"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userService_1 = require("../services/userService");
const apiResponse_1 = require("../utils/apiResponse");
exports.userController = {
    adminCreateUser: async (req, res) => {
        const { email, username, role } = req.body;
        if (!email || !role) {
            apiResponse_1.apiResponse.error(res, 'Email and role are required', 400);
            return;
        }
        if (role !== 'admin' && role !== 'user') {
            apiResponse_1.apiResponse.error(res, 'Role must be admin or user', 400);
            return;
        }
        try {
            const user = await userService_1.userService.adminCreateUser({ email, username, role });
            apiResponse_1.apiResponse.success(res, user, 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create user';
            apiResponse_1.apiResponse.error(res, message, 400);
        }
    },
    createUser: async (req, res) => {
        const { email, password, username } = req.body;
        if (!email || !password) {
            apiResponse_1.apiResponse.error(res, 'Email and password are required', 400);
            return;
        }
        try {
            const user = await userService_1.userService.createUser({ email, password, username, role: 'user' });
            apiResponse_1.apiResponse.success(res, user, 201);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create user';
            apiResponse_1.apiResponse.error(res, message, 400);
        }
    },
    getUser: async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await userService_1.userService.getUserById(userId);
            if (!user) {
                apiResponse_1.apiResponse.error(res, 'User not found', 404);
                return;
            }
            apiResponse_1.apiResponse.success(res, user);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get user';
            apiResponse_1.apiResponse.error(res, message, 400);
        }
    },
    getAllUsers: async (_req, res) => {
        try {
            const users = await userService_1.userService.getAllUsers();
            apiResponse_1.apiResponse.success(res, users);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get users';
            apiResponse_1.apiResponse.error(res, message, 400);
        }
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body;
        try {
            const { user, token } = await userService_1.userService.loginUser(email, password);
            apiResponse_1.apiResponse.success(res, { user, token });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to login';
            apiResponse_1.apiResponse.error(res, message, 401);
        }
    },
    updateProfile: async (req, res) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                apiResponse_1.apiResponse.error(res, 'User not authenticated', 401);
                return;
            }
            const updateData = {};
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
            const result = await userService_1.userService.updateProfile(userId, updateData);
            // Return in format expected by frontend (snake_case)
            apiResponse_1.apiResponse.success(res, {
                username: result.username,
                profile_picture: result.profilePicture,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update profile';
            // Handle specific error types
            if (message.includes('Current password')) {
                apiResponse_1.apiResponse.error(res, message, 400);
            }
            else if (message.includes('password')) {
                apiResponse_1.apiResponse.error(res, message, 400);
            }
            else if (message.includes('Username')) {
                apiResponse_1.apiResponse.error(res, message, 400);
            }
            else if (message.includes('profile picture')) {
                apiResponse_1.apiResponse.error(res, message, 400);
            }
            else {
                apiResponse_1.apiResponse.error(res, message, 400);
            }
        }
    },
};
//# sourceMappingURL=userController.js.map