export class UploadResponse {
  success: boolean = false;
  path: string = '';

  constructor(success: boolean, path: string) {
    this.success = success;
    this.path = path;
  }
}
