interface PingResponse {
  message: string;
}

export class PingController {
  public async getMessage(): Promise<PingResponse> {
    return {
      message: 'Image server running',
    };
  }
}
