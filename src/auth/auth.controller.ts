import {
  Body,
  Controller,
  Global,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/dto/login.dto';
import { CommonResposneDto } from 'src/dto/common.response.dto';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';

@Global()
@ApiTags('auth')
@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login for User' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: CommonResposneDto,
  })
  @Post('login')
  async loginCustomer(
    @Body() loginDto: UserLoginDto,
  ): Promise<CommonResposneDto> {
    return await this.authService.loginUser(loginDto);
  }
}
