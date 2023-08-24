import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { AdminService } from './admin.service';
import { UserRole } from 'src/entites';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), new RoleGuard(UserRole.ADMIN))
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Get('')
  testhello() {
    return 'hello';
  }

  @Get('/audit-logs')
  async getLogs() {
    return await this.adminService.getLogs();
  }
}
