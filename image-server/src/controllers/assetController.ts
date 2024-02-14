import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

import { createDirectories } from '../utils/directoryUtils';
import { ASSET_DIR } from '../utils/path';

const assetStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const { assetId } = req.body;
    const dir = path.join(ASSET_DIR, assetId);
    createDirectories(dir);
    cb(null, dir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, file.originalname);
  },
});

const assetUpload = multer({ storage: assetStorage });

const uploadAsset = (req: Request, res: Response) => {
  const { assetId } = req.body;
  const fileName = (req.file as Express.Multer.File).filename;

  res.json({ success: true, assetId, fileName });
};

export default { assetStorage, assetUpload, uploadAsset };
