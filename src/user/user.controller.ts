import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from 'src/entites';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('user')
@UseGuards(AuthGuard('jwt'), new RoleGuard(UserRole.ADMIN))
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create-creds')
  async getCreds(@Req() req) {
    const creds = await this.userService.getCreds(req.user.userId);
    return;
    // done here
  }

  @Post('/create-console')
  async createConsole(@Req() req) {
    console.log('Helloa');
    const creds = await this.userService.createConsoleCreds(req.user.userId);
    return;
  }
}
