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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const role_guard_1 = require("../guard/role.guard");
const admin_service_1 = require("./admin.service");
const entites_1 = require("../entites");
const swagger_1 = require("@nestjs/swagger");
const audit_log_dto_1 = require("../dto/audit.log.dto");
let AdminController = exports.AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getAuditLogs(queryDto) {
        return await this.adminService.getLogs(queryDto);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logs retrieved successfully' }),
    (0, common_1.Get)('/audit-logs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audit_log_dto_1.AuditQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), new role_guard_1.RoleGuard(entites_1.UserRole.ADMIN)),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map