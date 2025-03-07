export class GenericResponse<T> {
  public status!: boolean;
  public data!: T;
  public error: string = '';
  public code!: number;
  public validationError?: { [key: string]: string }[] = [];
  constructor(init?: Partial<GenericResponse<T>>) {
    Object.assign(this, init);
  }
}
