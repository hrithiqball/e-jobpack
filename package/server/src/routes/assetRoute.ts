import express from 'express';

import { AssetController } from '../controllers/assetController';
import assetMiddleware from '../middleware/multer/assetMiddleware';

const router = express.Router();
const assetController = new AssetController();

router.post(
  '/upload',
  assetMiddleware.assetUpload.single('image'),
  assetController.assetUploadFile,
);
router.get('/:assetId/:filename', assetController.assetDownloadFile);
router.delete('/delete', assetController.assetDeleteFile);

export default router;
