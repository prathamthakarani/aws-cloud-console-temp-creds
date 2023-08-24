export class LogRequestDto {
  host: string;
  path: string;
  method: string;
  userId: string | null;
  userName: string;

  constructor(host, path, method, userId: string | undefined, userName) {
    this.host = host;
    this.path = path;
    this.method = method;
    this.userId = userId;
    this.userName = userName;
  }
}
