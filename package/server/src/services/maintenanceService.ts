import path from 'path';
import fs from 'fs';

import { Result, ResultWithPayload } from '../models/result';

async function findMaintenanceImageAsync(
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

async function deleteMaintenanceImageAsync(filename: string) {
  const result = new Result();

  try {
    const imagePath = path.join(
      process.cwd(),
      'upload',
      'maintenance',
      filename,
    );

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

export default { findMaintenanceImageAsync, deleteMaintenanceImageAsync };
