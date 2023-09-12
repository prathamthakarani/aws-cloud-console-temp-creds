import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserRole } from 'src/entites';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { DeleteAction } from 'src/dto/delete.creds.dto';
import { AWSHelper } from 'src/helper/aws.helper';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard('jwt'), new RoleGuard(UserRole.USER))
export class UserController {
  constructor(private userService: UserService, private awsHelper: AWSHelper) {}

  @ApiOperation({ summary: 'Get user credentials' })
  @ApiResponse({
    status: 200,
    description: 'Credentials retrieved successfully',
  })
  @Post('/create-creds')
  async getCreds(@Req() req) {
    const creds = await this.userService.getCreds(req.user.userId);
    return creds;
  }

  @ApiOperation({ summary: 'Create console credentials' })
  @ApiResponse({
    status: 200,
    description: 'Console credentials created successfully',
  })
  @Post('/create-console')
  async createConsole(@Req() req) {
    const creds = await this.userService.createConsoleCreds(req.user.userId);
    return creds;
  }

  @ApiResponse({ status: 200, description: 'Action completed successfully' })
  @ApiParam({
    name: 'action',
    description: 'The action to perform (access-key or console-creds)',
    enum: DeleteAction,
  })
  @Delete(':action')
  async deleteAction(@Param('action') action: DeleteAction, @Req() req) {
    switch (action) {
      case DeleteAction.AccessKey:
        return this.userService.deleteAccessKey(req.user.userId, false);
      case DeleteAction.ConsoleCreds:
        return this.userService.deleteConsoleCreds(req.user.userId, false);
      default:
        throw new Error('Invalid action specified');
    }
  }
}
