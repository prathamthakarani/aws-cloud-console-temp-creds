export class CommonResposneDto {
  isError: boolean;
  message?: string;
  data?: any;

  constructor(isError, message?: string, data?: any) {
    this.isError = isError;
    this.message = message;
    this.data = data;
  }
}
