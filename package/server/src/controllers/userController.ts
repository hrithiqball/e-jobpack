import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

import { createDirectories } from '../utils/directoryUtils';
import { USER_DIR } from '../utils/path';

const userStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const { userId } = req.body;
    const dir = path.join(USER_DIR, userId);
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

const userUpload = multer({ storage: userStorage });

const uploadUser = (req: Request, res: Response) => {
  const { userId } = req.body;
  const fileName = (req.file as Express.Multer.File).filename;

  res.json({ success: true, userId, fileName });
};

export default { userStorage, userUpload, uploadUser };
