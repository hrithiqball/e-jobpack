import { Request, Response } from 'express';

import {
  ContractorDownloadFileSchema,
  ContractorUploadFileSchema,
} from '../schema/contractor.schema';
import contractorService from '../services/contractor.service';
import { Result } from '../models/result';
import { DeleteFileSchema } from '../schema/generalSchema';

interface IContractorController {
  contractorUploadFile(req: Request, res: Response): Promise<void>;
  contractorDownloadFile(req: Request, res: Response): Promise<void>;
}

export class ContractorController implements IContractorController {
  public async contractorUploadFile(req: Request, res: Response) {
    const validateFields = ContractorUploadFileSchema.safeParse(req.body);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { contractorId } = validateFields.data;
    const fileName = (req.file as Express.Multer.File).filename;

    res.json({ success: true, path: `/${contractorId}/${fileName}` });
  }

  public async contractorDownloadFile(req: Request, res: Response) {
    const validateFields = ContractorDownloadFileSchema.safeParse(req.params);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { filename, contractorId } = validateFields.data;
    const result = await contractorService.findContractorImageAsync(
      contractorId,
      filename,
    );

    if (result.success) {
      res.sendFile(result.data!);
    } else {
      res.status(404).send({ error: 'File not found' });
    }
  }

  public async contractorDeleteFile(req: Request, res: Response) {
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
      const process =
        await contractorService.deleteContractorImageAsync(filename);

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
