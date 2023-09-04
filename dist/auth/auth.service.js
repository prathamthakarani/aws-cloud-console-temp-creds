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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const entites_1 = require("../entites");
const common_response_dto_1 = require("../dto/common.response.dto");
let AuthService = exports.AuthService = class AuthService {
    constructor(dataSource, jwtService) {
        this.dataSource = dataSource;
        this.jwtService = jwtService;
    }
    async loginUser(loginDto) {
        const { userName, password } = loginDto;
        try {
            const user = await this.dataSource.manager.findOne(entites_1.User, {
                where: {
                    userName: userName,
                    password,
                },
            });
            if (user) {
                const userId = user.userId;
                if (user.password === password) {
                    const payload = {
                        userId,
                        role: user.role,
                        userName: user.userName,
                        policy: user.policy,
                    };
                    const token = await this.jwtService.signAsync(payload, {
                        secret: process.env.JWT_SECRET_KEY,
                    });
                    return new common_response_dto_1.CommonResposneDto(false, 'You are logged in successfully', token);
                }
                else {
                    return new common_response_dto_1.CommonResposneDto(true, 'Not able to login you');
                }
            }
            else {
                return new common_response_dto_1.CommonResposneDto(true, 'Password or username is incorrect');
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadGatewayException('Error occured');
        }
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DataSource')),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map