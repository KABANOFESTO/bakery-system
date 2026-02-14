"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = express_1.default.Router();
router.post('/users', userController_1.userController.createUser);
router.get('/users/:id', userController_1.userController.getUser);
router.post('/users/login', userController_1.userController.loginUser);
router.get('/users', userController_1.userController.getAllUsers);
router.patch('/users/update-profile', authMiddleware_1.default, uploadMiddleware_1.uploadProfilePicture, userController_1.userController.updateProfile);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map