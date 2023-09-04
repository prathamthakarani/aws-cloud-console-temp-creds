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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const log_service_1 = require("../db/log.service");
const log_request_dto_1 = require("../dto/log.request.dto");
let LoggingInterceptor = exports.LoggingInterceptor = class LoggingInterceptor {
    constructor(logservice) {
        this.logservice = logservice;
    }
    async intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        try {
            const { route, user, headers, method } = request;
            const userId = user?.userId;
            const host = headers.host;
            const path = route.path;
            const userName = user?.userName;
            const log = new log_request_dto_1.LogRequestDto(host, path, method, userId, userName);
            const generated = await this.logservice.addlog(log);
            this.logId = generated.identifiers[0].requestId;
        }
        catch (error) {
            console.log(error);
        }
        finally {
            return next.handle();
        }
    }
};
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [log_service_1.LogService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map