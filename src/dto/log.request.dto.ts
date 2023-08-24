export class LogRequestDto {
  host: string;
  path: string;
  method: string;
  userId: string | null;

  constructor(host, path, method, userId: string | undefined) {
    this.host = host;
    this.path = path;
    this.method = method;
    this.userId = userId;
  }
}
