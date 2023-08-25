import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { LogService } from '../db/log.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private logservice;
    private logId;
    constructor(logservice: LogService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<any>;
}
