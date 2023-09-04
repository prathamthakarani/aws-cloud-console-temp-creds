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
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const entites_1 = require("../entites");
const aws_helper_1 = require("../helper/aws.helper");
const user_service_1 = require("../user/user.service");
const typeorm_1 = require("typeorm");
let CronService = exports.CronService = class CronService {
    constructor(dataSource, awsHelper, userService) {
        this.dataSource = dataSource;
        this.awsHelper = awsHelper;
        this.userService = userService;
        this.logger = new common_1.Logger('triggered');
    }
    async handleCron() {
        const currenDate = new Date();
        const findConsoleCreds = await this.dataSource.manager.find(entites_1.User, {
            where: { consoleTs: (0, typeorm_1.LessThan)(currenDate) },
        });
        console.log('🚀 ~ file: cron.service.ts:23 ~ CronService ~ handleCron ~ findConsoleCreds:', findConsoleCreds);
        const findCreds = await this.dataSource.manager.find(entites_1.User, {
            where: { credsTs: (0, typeorm_1.LessThan)(currenDate) },
        });
        console.log('🚀 ~ file: cron.service.ts:25 ~ CronService ~ handleCron ~ findCreds:', findCreds);
        if (findConsoleCreds?.length !== 0) {
            for (const item of findConsoleCreds) {
                await this.userService.deleteConsoleCreds(item.userId);
            }
            console.log(`Removed console access: numbers: ${findConsoleCreds.length}`);
        }
        if (findCreds?.length !== 0) {
            for (const item of findCreds) {
                await this.userService.deleteAccessKey(item.userId);
            }
            console.log(`Removed creds access: numbers: ${findCreds.length}`);
        }
        this.logger.log('Cron executed');
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "handleCron", null);
exports.CronService = CronService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DataSource')),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        aws_helper_1.AWSHelper,
        user_service_1.UserService])
], CronService);
//# sourceMappingURL=cron.service.js.map