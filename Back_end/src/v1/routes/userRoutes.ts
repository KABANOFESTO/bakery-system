import express from 'express';
import { userController } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { uploadProfilePicture } from '../middlewares/uploadMiddleware';

const router = express.Router();

router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUser);
router.post('/users/login', userController.loginUser);
router.get('/users', userController.getAllUsers);
router.patch('/users/update-profile', authMiddleware, uploadProfilePicture, userController.updateProfile);

export default router;
