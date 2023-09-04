import { AdminService } from './admin.service';
import { QueryDto } from 'src/dto/query.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getLogs(queryDto: QueryDto): Promise<import("../dto/common.response.dto").CommonResposneDto>;
}
