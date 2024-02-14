import { Request, Response } from 'express';

const uploadAsset = (req: Request, res: Response) => {
  const { assetId } = req.body;
  const fileName = (req.file as Express.Multer.File).filename;

  res.json({ success: true, path: `/${assetId}/${fileName}` });
};

export default { uploadAsset };
