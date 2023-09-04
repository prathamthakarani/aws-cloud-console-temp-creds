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
exports.QueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class QueryDto {
}
exports.QueryDto = QueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Username for filtering' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'User ID for filtering' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'HTTP method for filtering',
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'URL path for filtering' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Start date for filtering (YYYY-MM-DDTHH:mm:ss)',
        example: '2023-08-01T12:00:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], QueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'End date for filtering (YYYY-MM-DDTHH:mm:ss)',
        example: '2023-08-15T18:30:00',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], QueryDto.prototype, "endDate", void 0);
//# sourceMappingURL=query.dto.js.map