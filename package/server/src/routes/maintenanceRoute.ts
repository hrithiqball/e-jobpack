import express from 'express';

import { MaintenanceController } from '../controllers/maintenanceController';
import maintenanceMiddleware from '../middleware/multer/maintenanceMiddleware';
import maintenanceService from '../services/maintenanceService';

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
router.delete('/:filename', maintenanceService.deleteMaintenanceImageAsync);

export default router;
