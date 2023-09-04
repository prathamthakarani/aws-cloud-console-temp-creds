import { CommonResposneDto } from 'src/dto/common.response.dto';
import { QueryDto } from 'src/dto/query.dto';
import { DataSource } from 'typeorm';
export declare class AdminService {
    private dataSource;
    constructor(dataSource: DataSource);
    getLogs(queryDto: QueryDto): Promise<CommonResposneDto>;
}
