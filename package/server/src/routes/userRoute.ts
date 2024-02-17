import express from 'express';

import { UserController } from '../controllers/userController';
import userMiddleware from '../middleware/multer/userMiddleware';

const router = express.Router();
const userController = new UserController();

router.post(
  '/upload',
  userMiddleware.userUpload.single('image'),
  userController.userUploadFile,
);
router.get('/:userId/:filename', userController.userDownloadFile);
router.delete('/delete', userController.userDeleteFile);

export default router;
