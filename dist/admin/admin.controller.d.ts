import { AdminService } from './admin.service';
import { AuditQueryDto } from 'src/dto/audit.log.dto';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getAuditLogs(queryDto: AuditQueryDto): Promise<import("../dto/common.response.dto").CommonResposneDto>;
}
