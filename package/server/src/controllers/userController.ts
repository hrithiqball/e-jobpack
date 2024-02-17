import { Request, Response } from 'express';

import { UploadResponse } from '../models/uploadResponse';
import { Result } from '../models/result';
import userService from '../services/userService';
import {
  UserUploadFileSchema,
  UserDownloadFileSchema,
  UserDeleteFileSchema,
} from '../schema/userSchema';

interface IUserController {
  userUploadFile(req: Request, res: Response): Promise<void>;
  userDownloadFile(req: Request, res: Response): Promise<void>;
  userDeleteFile(req: Request, res: Response): Promise<void>;
}

export class UserController implements IUserController {
  public async userUploadFile(req: Request, res: Response) {
    const validateFields = UserUploadFileSchema.safeParse(req.body);
    const result = new Result();

    if (!validateFields.success) {
      result.success = false;
      result.message = validateFields.error.message;
      res.status(400).send(result);
      return;
    }

    const { userId } = validateFields.data;
    const fileName = (req.file as Express.Multer.File).filename;

    res.json(new UploadResponse(true, `/${userId}/${fileName}`));
  }

  public async userDownloadFile(req: Request, res: Response) {
    const validateFields = UserDownloadFileSchema.safeParse(req.params);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
      return;
    }

    const { filename, userId } = validateFields.data;
    const result = await userService.findUserImageAsync(userId, filename);

    if (result.success) {
      res.sendFile(result.data!);
    } else {
      res.status(404).send({ error: 'File not found' });
    }
  }

  public async userDeleteFile(req: Request, res: Response) {
    const result = new Result();

    try {
      const validateFields = UserDeleteFileSchema.safeParse(req.query);

      if (!validateFields.success) {
        result.success = false;
        result.message = validateFields.error.message;
        res.status(400).send(result);
        return;
      }

      const { filename } = validateFields.data;
      const process = await userService.deleteUserImageAsync(filename);

      if (process.success) {
        res.json(process);
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
