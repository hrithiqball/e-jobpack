export class Result {
  success: boolean = true;
  message: string = '';
}

export class ResultWithPayload<T> extends Result {
  data?: T;
}
