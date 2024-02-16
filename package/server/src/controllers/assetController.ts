import { Request, Response } from 'express';

import {
  AssetDownloadFileSchema,
  AssetUploadFileSchema,
} from '../schema/assetSchema';
import assetService from '../services/assetService';

interface IAssetController {
  assetUploadFile(req: Request, res: Response): Promise<void>;
  assetDownloadFile(req: Request, res: Response): Promise<void>;
}

export class AssetController implements IAssetController {
  public async assetUploadFile(req: Request, res: Response) {
    const validateFields = AssetUploadFileSchema.safeParse(req.body);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { assetId } = validateFields.data;
    const fileName = (req.file as Express.Multer.File).filename;

    res.json({ success: true, path: `/${assetId}/${fileName}` });
  }

  public async assetDownloadFile(req: Request, res: Response) {
    const validateFields = AssetDownloadFileSchema.safeParse(req.params);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { filename, assetId } = validateFields.data;
    const result = await assetService.findAssetImageAsync(assetId, filename);

    if (result.success) {
      res.sendFile(result.data!);
    } else {
      res.status(404).send({ error: 'File not found' });
    }
  }
}
