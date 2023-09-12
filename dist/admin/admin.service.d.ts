import { AuditQueryDto } from 'src/dto/audit.log.dto';
import { CommonResposneDto } from 'src/dto/common.response.dto';
import { DataSource } from 'typeorm';
export declare class AdminService {
    private dataSource;
    constructor(dataSource: DataSource);
    getLogs(queryDto: AuditQueryDto): Promise<CommonResposneDto>;
}
