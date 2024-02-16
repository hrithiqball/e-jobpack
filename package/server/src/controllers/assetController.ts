import { Request, Response } from 'express';

import {
  AssetDownloadFileSchema,
  AssetUploadFileSchema,
} from '../schema/assetSchema';
import assetService from '../services/assetService';
import { Result } from '../models/result';
import { DeleteFileSchema } from '../schema/generalSchema';

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

  public async assetDeleteFile(req: Request, res: Response) {
    const result = new Result();

    try {
      const validateFields = DeleteFileSchema.safeParse(req.query);

      if (!validateFields.success) {
        result.success = false;
        result.message = validateFields.error.message;
        res.status(400).send(result);
        return;
      }

      const { filename } = validateFields.data;
      const process = await assetService.deleteAssetImageAsync(filename);

      if (process.success) {
        res.status(200).send(process);
      } else {
        res.status(404).send(process);
      }
    } catch (error) {
      console.error(error);

      const result = new Result();
      result.success = false;
      result.message = 'Internal server error';

      res.status(500).send(result);
    }
  }
}
