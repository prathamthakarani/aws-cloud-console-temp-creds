import { LogRequestDto } from '../dto/log.request.dto';
import { DataSource } from 'typeorm';
export declare class LogService {
    private dataSource;
    constructor(dataSource: DataSource);
    addlog(logRequestDto: LogRequestDto): Promise<import("typeorm").InsertResult>;
}
