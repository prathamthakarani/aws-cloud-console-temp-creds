import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
// import { catchError, map, Observable } from 'rxjs';
import { LogService } from '../db/log.service';
import { LogRequestDto } from '../dto/log.request.dto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logId: number;
  constructor(private logservice: LogService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    try {
      const { route, user, headers, method } = request;
      const userId = user?.userId;
      const host = headers.host;
      const path = route.path;
      const userName = user?.userName;
      const log = new LogRequestDto(host, path, method, userId, userName);
      const generated = await this.logservice.addlog(log);
      this.logId = generated.identifiers[0].requestId;
    } catch (error) {
      console.log(error);
    } finally {
      return next.handle();
      // .pipe(
      //   map(async (value) => {
      //     this.logservice.addLogResponse(this.logId, value);
      //     return value;
      //   }),
      // )
      // .pipe(
      //   catchError((err) => {
      //     this.logservice.addLogResponse(this.logId, err.response);
      //     throw err;
      //   }),
      // );
    }
  }
}
