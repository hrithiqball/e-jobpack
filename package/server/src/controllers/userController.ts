import { Request, Response } from 'express';

const uploadUser = (req: Request, res: Response) => {
  const { userId } = req.body;
  const fileName = (req.file as Express.Multer.File).filename;

  res.json({ success: true, userId, fileName });
};

export default { uploadUser };
