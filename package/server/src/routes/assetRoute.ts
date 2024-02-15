import express from 'express';

import { AssetController } from '../controllers/assetController';
import assetMiddleware from '../middleware/multer/assetMiddleware';
import { AssetService } from '../services/assetService';

const router = express.Router();
const assetService = new AssetService();
const assetController = new AssetController(assetService);

router.post(
  '/upload',
  assetMiddleware.assetUpload.single('image'),
  assetController.assetUploadFile,
);
router.get('/:assetId/:filename', assetController.assetDownloadFile);

export default router;
