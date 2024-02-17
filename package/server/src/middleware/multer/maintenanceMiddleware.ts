import { Request } from 'express';
import multer from 'multer';
import path from 'path';

import {
  MaintenanceChecklistUploadFileSchema,
  MaintenanceUploadFileSchema,
} from '../../schema/maintenanceSchema';
import { createDirectories } from '../../utils/directoryUtils';
import { MAINTENANCE_DIR } from '../../utils/path';

const maintenanceGeneralStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const validateFields = MaintenanceUploadFileSchema.safeParse(req.body);

    if (!validateFields.success) {
      cb(new Error(validateFields.error.message), '');
      return;
    }

    const { maintenanceId } = validateFields.data;
    const dir = path.join(MAINTENANCE_DIR, maintenanceId);

    createDirectories(dir);
    cb(null, dir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const fileName = file.originalname.replace(/\s/g, '_');

    cb(null, fileName);
  },
});

const maintenanceChecklistStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const validateFields = MaintenanceChecklistUploadFileSchema.safeParse(
      req.body,
    );

    if (!validateFields.success) {
      cb(new Error(validateFields.error.message), '');
      return;
    }

    const { maintenanceId, checklistId } = validateFields.data;
    const dir = path.join(MAINTENANCE_DIR, maintenanceId, checklistId);

    createDirectories(dir);
    cb(null, dir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const fileName = file.originalname.replace(/\s/g, '_');

    cb(null, fileName);
  },
});

const maintenanceGeneralUpload = multer({ storage: maintenanceGeneralStorage });
const maintenanceChecklistUpload = multer({
  storage: maintenanceChecklistStorage,
});

export default { maintenanceGeneralUpload, maintenanceChecklistUpload };
