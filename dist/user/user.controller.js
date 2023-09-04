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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const entites_1 = require("../entites");
const passport_1 = require("@nestjs/passport");
const role_guard_1 = require("../guard/role.guard");
const logging_interceptor_1 = require("../interceptor/logging.interceptor");
const delete_creds_dto_1 = require("../dto/delete.creds.dto");
const aws_helper_1 = require("../helper/aws.helper");
let UserController = exports.UserController = class UserController {
    constructor(userService, awsHelper) {
        this.userService = userService;
        this.awsHelper = awsHelper;
    }
    async getCreds(req) {
        const creds = await this.userService.getCreds(req.user.userId);
        return creds;
    }
    async createConsole(req) {
        const creds = await this.userService.createConsoleCreds(req.user.userId);
        return creds;
    }
    async deleteAction(action, req) {
        switch (action) {
            case delete_creds_dto_1.DeleteAction.AccessKey:
                return this.userService.deleteAccessKey(req.user.userId, false);
            case delete_creds_dto_1.DeleteAction.ConsoleCreds:
                return this.userService.deleteConsoleCreds(req.user.userId, false);
            default:
                throw new Error('Invalid action specified');
        }
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get user credentials' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Credentials retrieved successfully',
    }),
    (0, common_1.Post)('/create-creds'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCreds", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create console credentials' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Console credentials created successfully',
    }),
    (0, common_1.Post)('/create-console'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createConsole", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Action completed successfully' }),
    (0, swagger_1.ApiParam)({
        name: 'action',
        description: 'The action to perform (access-key or console-creds)',
        enum: delete_creds_dto_1.DeleteAction,
    }),
    (0, common_1.Delete)(':action'),
    __param(0, (0, common_1.Param)('action')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAction", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('user'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('user'),
    (0, common_1.UseInterceptors)(logging_interceptor_1.LoggingInterceptor),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), new role_guard_1.RoleGuard(entites_1.UserRole.USER)),
    __metadata("design:paramtypes", [user_service_1.UserService, aws_helper_1.AWSHelper])
], UserController);
//# sourceMappingURL=user.controller.js.map