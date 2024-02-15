import express from 'express';

import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import userMiddleware from '../middleware/multer/userMiddleware';

const router = express.Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post(
  '/upload',
  userMiddleware.userUpload.single('image'),
  userController.userUploadFile,
);
router.get('/:userId/:filename', userController.userDownloadFile);

export default router;
