import path from 'path';
import { ResultWithPayload } from '../models/result';
import fs from 'fs';

export interface IMaintenanceService {
  findMaintenanceImageAsync(
    maintenanceId: string,
    filename: string,
  ): Promise<ResultWithPayload<string>>;
}

export class MaintenanceService implements IMaintenanceService {
  public async findMaintenanceImageAsync(
    maintenanceId: string,
    filename: string,
  ): Promise<ResultWithPayload<string>> {
    const result = new ResultWithPayload<string>();

    try {
      const imagePath = path.join(
        process.cwd(),
        'upload',
        'maintenance',
        maintenanceId,
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
