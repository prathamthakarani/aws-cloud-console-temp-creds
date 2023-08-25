"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronModule = void 0;
const common_1 = require("@nestjs/common");
const cron_service_1 = require("./cron.service");
const aws_helper_1 = require("../helper/aws.helper");
const user_service_1 = require("../user/user.service");
let CronModule = exports.CronModule = class CronModule {
};
exports.CronModule = CronModule = __decorate([
    (0, common_1.Module)({
        providers: [cron_service_1.CronService, aws_helper_1.AWSHelper, user_service_1.UserService],
    })
], CronModule);
//# sourceMappingURL=cron.module.js.map