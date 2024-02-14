import express from 'express';

import assetController from '../controllers/assetController';
import assetMiddleware from '../middleware/assetMiddleware';

const router = express.Router();

router.post(
  '/',
  assetMiddleware.assetUpload.single('image'),
  assetController.uploadAsset,
);

export default router;
