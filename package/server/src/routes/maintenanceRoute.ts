import express from 'express';

import { MaintenanceController } from '../controllers/maintenanceController';
import maintenanceMiddleware from '../middleware/multer/maintenanceMiddleware';
import maintenanceService from '../services/maintenanceService';

const router = express.Router();
const maintenanceController = new MaintenanceController();

router.post(
  '/upload',
  maintenanceMiddleware.maintenanceGeneralUpload.single('file'),
  maintenanceController.maintenanceGeneralUploadFile,
);
router.post(
  '/checklist/upload',
  maintenanceMiddleware.maintenanceChecklistUpload.single('file'),
  maintenanceController.maintenanceChecklistUploadFile,
);
router.get(
  '/:maintenanceId/:filename',
  maintenanceController.maintenanceDownloadFile,
);
router.delete('/:filename', maintenanceService.deleteMaintenanceImageAsync);

export default router;
