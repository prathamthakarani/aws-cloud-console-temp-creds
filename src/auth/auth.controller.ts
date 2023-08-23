import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/dto/login.dto';
import { CommonResposneDto } from 'src/dto/common.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginCustomer(
    @Body() loginDto: UserLoginDto,
  ): Promise<CommonResposneDto> {
    return await this.authService.loginUser(loginDto);
  }
}
