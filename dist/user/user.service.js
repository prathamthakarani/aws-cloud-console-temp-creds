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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const entites_1 = require("../entites");
const typeorm_1 = require("typeorm");
const aws_helper_1 = require("../helper/aws.helper");
const common_response_dto_1 = require("../dto/common.response.dto");
let UserService = exports.UserService = class UserService {
    constructor(dataSource, awsHelper) {
        this.dataSource = dataSource;
        this.awsHelper = awsHelper;
    }
    async getCreds(userId) {
        try {
            const getDataByUserId = await this.dataSource.manager.findOne(entites_1.User, {
                where: { userId },
            });
            const userName = getDataByUserId.userName;
            const policy = getDataByUserId.policy;
            const policyName = getDataByUserId.policyName;
            if (getDataByUserId?.accessKeyId) {
                await this.awsHelper.deleteAccessKey(userName, getDataByUserId.accessKeyId);
                console.log('access key deleted');
            }
            const creds = await this.awsHelper.createIAMUserWithKeysAndPolicy(userName, policy, policyName);
            const currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 30);
            console.log(creds);
            await this.dataSource.manager.update(entites_1.User, { userName }, { credsTs: currentDate, accessKeyId: creds?.AccessKeyId });
            console.log(creds);
            return new common_response_dto_1.CommonResposneDto(false, 'Creds generated successfully', creds);
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadGatewayException('Not able to process');
        }
    }
    async createConsoleCreds(userId) {
        try {
            const getDataByUserId = await this.dataSource.manager.findOne(entites_1.User, {
                where: { userId },
            });
            if (!getDataByUserId) {
            }
            const userName = getDataByUserId.userName;
            const policy = getDataByUserId.policy;
            const policyName = getDataByUserId.policyName;
            const isConsoleUser = true;
            const creds = await this.awsHelper.createConsoleCred(userName, policy, isConsoleUser, policyName);
            if (creds) {
                const currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + 30);
                console.log(currentDate);
                await this.dataSource.manager.update(entites_1.User, { userName }, { consoleTs: currentDate });
                creds.accountId = process.env.AWS_ACCOUNT_ID;
            }
            return new common_response_dto_1.CommonResposneDto(false, 'Creds generated successfully', creds);
        }
        catch (error) {
            throw new common_1.BadGatewayException('Not able to process right now');
        }
    }
    async deleteAccessKey(userId) {
        try {
            const data = await this.dataSource.manager.findOne(entites_1.User, {
                where: { userId },
            });
            if (!data.accessKeyId) {
                throw new common_1.BadRequestException('Access key id not found to delete');
            }
            await this.awsHelper.deleteAccessKey(data.userName, data.accessKeyId);
            await this.dataSource.manager.update(entites_1.User, { userId: data.userId }, { credsTs: null, accessKeyId: null });
            return new common_response_dto_1.CommonResposneDto(false, 'Creds deleted successfully');
        }
        catch (error) {
            console.log(error);
            if (error.response.statusCode === 400) {
                throw new common_1.BadRequestException(error.response);
            }
            throw new common_1.BadGatewayException('Not able to process right now');
        }
    }
    async deleteConsoleCreds(userId) {
        try {
            const data = await this.dataSource.manager.findOne(entites_1.User, {
                where: { userId },
            });
            if (!data.consoleTs) {
                throw new common_1.BadRequestException('Console creds are not found to delete');
            }
            await this.awsHelper.deleteConsoleAccess(data.userName, data.policy);
            await this.dataSource.manager.update(entites_1.User, { userId: data.userId }, { consoleTs: null });
            return new common_response_dto_1.CommonResposneDto(false, 'Console creds deleted successfully');
        }
        catch (error) {
            console.log(error);
            if (error.response.statusCode === 400) {
                throw new common_1.BadRequestException(error.response);
            }
            throw new common_1.BadGatewayException('Not able to process right now');
        }
    }
};
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DataSource')),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        aws_helper_1.AWSHelper])
], UserService);
//# sourceMappingURL=user.service.js.map