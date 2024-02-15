import { Request, Response } from 'express';

import { UploadResponse } from '../models/uploadResponse';
import { IUserService } from '../services/userService';
import {
  UserUploadFileSchema,
  UserDownloadFileSchema,
  UserDeleteFileSchema,
} from '../schema/userSchema';
import { Result } from '../models/result';

export interface IUserController {
  userUploadFile(req: Request, res: Response): Promise<void>;
  userDownloadFile(req: Request, res: Response): Promise<void>;
  userDeleteFile(req: Request, res: Response): Promise<void>;
}

export class UserController implements IUserController {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }
  public async userUploadFile(req: Request, res: Response) {
    const validateFields = UserUploadFileSchema.safeParse(req.body);

    if (!validateFields.success) {
      res.status(400).send({ error: validateFields.error.message });
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
    const result = await this.userService.findUserImageAsync(userId, filename);

    if (result.success) {
      res.sendFile(result.data!);
    } else {
      res.status(404).send({ error: 'File not found' });
    }
  }

  public async userDeleteFile(req: Request, res: Response) {
    try {
      const validateFields = UserDeleteFileSchema.safeParse(req.query);

      if (!validateFields.success) {
        res.status(400).send({ error: validateFields.error.message });
        return;
      }

      const { filename } = validateFields.data;
      const result = await this.userService.deleteUserImageAsync(filename);

      if (result.success) {
        res.json(result);
      } else {
        res.status(404).send(result);
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
