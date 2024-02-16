import express from 'express';

import { AssetController } from '../controllers/assetController';
import assetMiddleware from '../middleware/multer/assetMiddleware';
import assetService from '../services/assetService';

const router = express.Router();
const assetController = new AssetController();

router.post(
  '/upload',
  assetMiddleware.assetUpload.single('image'),
  assetController.assetUploadFile,
);
router.get('/:assetId/:filename', assetController.assetDownloadFile);
router.delete('/:filename', assetService.deleteAssetImageAsync);

export default router;
