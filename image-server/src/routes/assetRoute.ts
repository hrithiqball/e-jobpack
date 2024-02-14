import express from 'express';
import multer from 'multer';

import assetController from '../controllers/assetController';

const router = express.Router();
const assetUpload = multer({ storage: assetController.assetStorage });

router.post('/', assetUpload.single('image'), assetController.uploadAsset);

export default router;
