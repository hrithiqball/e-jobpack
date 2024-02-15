import path from 'path';
import fs from 'fs';

import { Result, ResultWithPayload } from '../models/result';

export interface IUserService {
  findUserImageAsync(
    userId: string,
    filename: string,
  ): Promise<ResultWithPayload<string>>;

  deleteUserImageAsync(filename: string): Promise<Result>;
}

export class UserService implements IUserService {
  public async findUserImageAsync(userId: string, filename: string) {
    const result = new ResultWithPayload<string>();

    try {
      const imagePath = path.join(
        process.cwd(),
        'upload',
        'user',
        userId,
        filename,
      );

      if (fs.existsSync(imagePath)) {
        result.success = true;
        result.data = imagePath;
      } else {
        result.success = false;
        result.message = 'File not found';
      }
    } catch (error) {
      console.error(error);
      result.success = false;
      result.message = 'Internal server error';
    }

    return result;
  }

  public async deleteUserImageAsync(filename: string) {
    const result = new Result();

    try {
      const imagePath = path.join(process.cwd(), 'upload', 'user', filename);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        result.success = true;
        result.message = 'File deleted';
      } else {
        result.success = false;
        result.message = 'File not found';
      }
    } catch (error) {
      console.error(error);
      result.success = false;
      result.message = 'Internal server error';
    }

    return result;
  }
}
