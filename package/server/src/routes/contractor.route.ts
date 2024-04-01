import express from 'express';

import { ContractorController } from '../controllers/contractorController';
import contractorMiddleware from '../middleware/multer/contractorMiddleware';

const router = express.Router();
const contractorController = new ContractorController();

router.post(
  '/upload',
  contractorMiddleware.contractorUpload.single('image'),
  contractorController.contractorUploadFile,
);
router.get(
  '/:contractorId/:filename',
  contractorController.contractorDownloadFile,
);
router.delete('/delete', contractorController.contractorDeleteFile);

export default router;
