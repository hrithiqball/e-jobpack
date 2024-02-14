import express from 'express';
import multer from 'multer';

import userController from '../controllers/userController';

const router = express.Router();
const userUpload = multer({ storage: userController.userStorage });

router.post('/', userUpload.single('image'), userController.uploadUser);

export default router;
