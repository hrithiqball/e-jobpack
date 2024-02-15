import express from 'express';

import { MaintenanceController } from '../controllers/maintenanceController';
import { MaintenanceService } from '../services/maintenanceService';
import maintenanceMiddleware from '../middleware/multer/maintenanceMiddleware';

const router = express.Router();
const maintenanceService = new MaintenanceService();
const maintenanceController = new MaintenanceController(maintenanceService);

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
