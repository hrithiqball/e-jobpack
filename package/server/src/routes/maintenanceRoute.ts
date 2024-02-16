import express from 'express';

import { MaintenanceController } from '../controllers/maintenanceController';
import maintenanceMiddleware from '../middleware/multer/maintenanceMiddleware';

const router = express.Router();
const maintenanceController = new MaintenanceController();

router.post(
  '/upload',
  maintenanceMiddleware.maintenanceUpload.single('image'),
  maintenanceController.maintenanceUploadFile,
);
router.get(
  '/:maintenanceId/:filename',
  maintenanceController.maintenanceDownloadFile,
);

export default router;
