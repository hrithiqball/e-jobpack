import { Request } from 'express';
import multer from 'multer';
import path from 'path';

import { createDirectories } from '../../utils/directoryUtils';
import { CONTRACTOR_DIR } from '../../utils/path';

const contractorStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const { contractorId } = req.body;
    console.log('contractorId', contractorId);
    const dir = path.join(CONTRACTOR_DIR, contractorId);

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

const contractorUpload = multer({ storage: contractorStorage });

export default { contractorStorage, contractorUpload };
