import { Request } from 'express';
import multer from 'multer';
import path from 'path';

import { createDirectories } from '../../utils/directoryUtils';
import { MAINTENANCE_DIR } from '../../utils/path';

const maintenanceStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const { maintenanceId } = req.body;
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

const maintenanceUpload = multer({ storage: maintenanceStorage });

export default { maintenanceStorage, maintenanceUpload };