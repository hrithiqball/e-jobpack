import express from 'express';

import userController from '../controllers/userController';
import userMiddleware from '../middleware/userMiddleware';

const router = express.Router();

router.post(
  '/',
  userMiddleware.userUpload.single('image'),
  userController.uploadUser,
);

export default router;
