// import {
//   Controller,
//   Post,
//   Req,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserRole } from 'src/entites';
// import { AuthGuard } from '@nestjs/passport';
// import { RoleGuard } from 'src/guard/role.guard';
// import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';

// @Controller('user')
// @UseInterceptors(LoggingInterceptor)
// @UseGuards(AuthGuard('jwt'), new RoleGuard(UserRole.USER))
// export class UserController {
//   constructor(private userService: UserService) {}

//   @Post('/create-creds')
//   async getCreds(@Req() req) {
//     const creds = await this.userService.getCreds(req.user.userId);
//     return creds;
//   }

//   @Post('/create-console')
//   async createConsole(@Req() req) {
//     const creds = await this.userService.createConsoleCreds(req.user.userId);
//     return creds;
//   }
// }

import {
  Controller,
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
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserRole } from 'src/entites';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { DeleteAction, DeleteRequestDto } from 'src/dto/delete.creds.dto';

@ApiTags('user') // Add an API tag
@ApiBearerAuth() // Specify bearer token authentication
@Controller('user')
@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard('jwt'), new RoleGuard(UserRole.USER))
export class UserController {
  constructor(private userService: UserService) {}

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

  // @ApiResponse({ status: 200, description: 'Action completed successfully' })
  // @Post()
  // async deleteAction(@Param() deleteRequestDto: DeleteRequestDto, @Req() req) {
  //   switch (deleteRequestDto.action) {
  //     case DeleteAction.AccessKey:
  //       return this.userService.deleteAccessKey(req.user.userId);
  //     case DeleteAction.ConsoleCreds:
  //       return this.userService.deleteConsoleCreds(req.user.userId);
  //     default:
  //       throw new Error('Invalid action specified');
  //   }
  // }
}
