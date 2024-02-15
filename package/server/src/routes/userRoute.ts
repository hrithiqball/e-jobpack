import express from 'express';

import { UserController } from '../controllers/userController';
import userMiddleware from '../middleware/multer/userMiddleware';
import { UserService } from '../services/userService';

const router = express.Router();
const userController = new UserController(new UserService());

router.post(
  '/upload',
  userMiddleware.userUpload.single('image'),
  userController.userUploadFile,
);
router.get('/:userId/:filename', userController.userDownloadFile);
router.delete('/delete', userController.userDeleteFile);

export default router;
