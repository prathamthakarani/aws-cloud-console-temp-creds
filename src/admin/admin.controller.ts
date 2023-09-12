import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { AdminService } from './admin.service';
import { UserRole } from 'src/entites';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { QueryDto } from 'src/dto/query.dto';
import { AuditQueryDto } from 'src/dto/audit.log.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard('jwt'), new RoleGuard(UserRole.ADMIN))
export class AdminController {
  constructor(private adminService: AdminService) {}

  // @ApiOperation({ summary: 'Get audit logs' })
  // @ApiQuery({
  //   name: 'userName',
  //   required: false,
  //   description: 'Username for filtering',
  // })
  // @ApiQuery({
  //   name: 'userId',
  //   required: false,
  //   description: 'User ID for filtering',
  // })
  // @ApiQuery({
  //   name: 'method',
  //   required: false,
  //   description: 'HTTP method for filtering',
  // })
  // @ApiQuery({
  //   name: 'path',
  //   required: false,
  //   description: 'URL path for filtering',
  // })
  // @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  // @Get('/audit-logs')
  // async getLogs(@Query() queryDto: QueryDto) {
  //   return await this.adminService.getLogs(queryDto);
  // }

  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({ status: 200, description: 'Logs retrieved successfully' })
  @Get('/audit-logs')
  // @ApiQuery({ type: AuditQueryDto })
  async getAuditLogs(@Query() queryDto: AuditQueryDto) {
    return await this.adminService.getLogs(queryDto);
  }
}
