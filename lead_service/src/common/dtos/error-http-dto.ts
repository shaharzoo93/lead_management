export class GenericHTTPError extends Error {
  public status!: number;
  public success!: boolean;
  public message!: string;
  public stack!: string;
  public validationError?: { [key: string]: string }[] = [];
  constructor(code?: number, message?: string) {
    super();
    Error.captureStackTrace(this);
    this.status = code || 500;
    this.message = message || '';
    this.success = false;
  }
}
