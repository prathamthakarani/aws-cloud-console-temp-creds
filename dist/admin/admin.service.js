"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const common_response_dto_1 = require("../dto/common.response.dto");
const audit_log_1 = require("../entites/audit.log");
const typeorm_1 = require("typeorm");
let AdminService = exports.AdminService = class AdminService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getLogs(queryDto) {
        try {
            console.log('Hey its here');
            const { userId, startDate, endDate, action, actionPerformedBy } = queryDto;
            console.log(action, actionPerformedBy);
            const whereObject = {};
            if (actionPerformedBy) {
                whereObject.actionPerformedBy = (0, typeorm_1.ILike)(`%${actionPerformedBy}%`);
            }
            if (action) {
                whereObject.action = action;
            }
            if (userId) {
                whereObject.userId = userId;
            }
            if (startDate) {
                whereObject.timestamp = (0, typeorm_1.MoreThan)(startDate);
            }
            if (endDate) {
                whereObject.timestamp = (0, typeorm_1.LessThan)(endDate);
            }
            const logsData = await this.dataSource.manager.find(audit_log_1.AuditLog, {
                where: whereObject,
                relations: { user: true },
                select: {
                    action: true,
                    actionPerformedBy: true,
                    timestamp: true,
                    id: true,
                    user: {
                        userId: true,
                        userName: true,
                        policy: true,
                        credsTs: true,
                        consoleTs: true,
                        policyName: true,
                    },
                },
            });
            return new common_response_dto_1.CommonResposneDto(false, undefined, logsData);
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadGatewayException('Not able to fetch audit logs');
        }
    }
};
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DataSource')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AdminService);
//# sourceMappingURL=admin.service.js.map