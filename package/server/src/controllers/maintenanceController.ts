import { Request, Response } from 'express';

import { UploadResponse } from '../models/uploadResponse';
import {
  MaintenanceUploadFileSchema,
  MaintenanceDownloadFileSchema,
  MaintenanceChecklistUploadFileSchema,
} from '../schema/maintenanceSchema';
import maintenanceService from '../services/maintenanceService';

interface IMaintenanceController {
  maintenanceGeneralUploadFile(req: Request, res: Response): Promise<void>;
  maintenanceChecklistUploadFile(req: Request, res: Response): Promise<void>;
  maintenanceDownloadFile(req: Request, res: Response): Promise<void>;
}

export class MaintenanceController implements IMaintenanceController {
  public async maintenanceGeneralUploadFile(req: Request, res: Response) {
    const validateFields = MaintenanceUploadFileSchema.safeParse(req.body);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { maintenanceId } = validateFields.data;
    const fileName = (req.file as Express.Multer.File).filename;

    res.json(new UploadResponse(true, `/${maintenanceId}/${fileName}`));
  }

  public async maintenanceChecklistUploadFile(req: Request, res: Response) {
    const validateFields = MaintenanceChecklistUploadFileSchema.safeParse(
      req.body,
    );

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { maintenanceId, checklistId } = validateFields.data;

    const fileName = (req.file as Express.Multer.File).filename;

    res.json(
      new UploadResponse(true, `/${maintenanceId}/${checklistId}/${fileName}`),
    );
  }

  public async maintenanceDownloadFile(req: Request, res: Response) {
    const validateFields = MaintenanceDownloadFileSchema.safeParse(req.params);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { filename, maintenanceId } = validateFields.data;

    const result = await maintenanceService.findMaintenanceImageAsync(
      maintenanceId,
      filename,
    );

    if (result.success) {
      res.sendFile(result.data!);
    } else {
      res.status(404).send({ error: 'File not found' });
    }
  }
}
