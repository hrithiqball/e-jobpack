import { Request, Response } from 'express';

import { UploadResponse } from '../models/uploadResponse';
import { IMaintenanceService } from '../services/maintenanceService';
import {
  MaintenanceUploadFileSchema,
  MaintenanceDownloadFileSchema,
} from '../schema/maintenanceSchema';

interface IMaintenanceController {
  maintenanceUploadFile(req: Request, res: Response): Promise<void>;
  maintenanceDownloadFile(req: Request, res: Response): Promise<void>;
}

export class MaintenanceController implements IMaintenanceController {
  private readonly maintenanceService: IMaintenanceService;

  constructor(maintenanceService: IMaintenanceService) {
    this.maintenanceService = maintenanceService;
  }

  public async maintenanceUploadFile(req: Request, res: Response) {
    const validateFields = MaintenanceUploadFileSchema.safeParse(req.body);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { maintenanceId } = validateFields.data;
    const fileName = (req.file as Express.Multer.File).filename;

    res.json(new UploadResponse(true, `/${maintenanceId}/${fileName}`));
  }

  public async maintenanceDownloadFile(req: Request, res: Response) {
    const validateFields = MaintenanceDownloadFileSchema.safeParse(req.params);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { filename, maintenanceId } = validateFields.data;
    const result = await this.maintenanceService.findMaintenanceImageAsync(
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
