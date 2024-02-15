import path from 'path';
import { ResultWithPayload } from '../models/result';
import fs from 'fs';

export interface IUserService {
  findUserImageAsync(
    userId: string,
    filename: string,
  ): Promise<ResultWithPayload<string>>;
}

export class UserService implements IUserService {
  public async findUserImageAsync(
    userId: string,
    filename: string,
  ): Promise<ResultWithPayload<string>> {
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
}
