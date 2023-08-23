import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'src/dto/login.dto';
import { User } from 'src/entites';
import { CommonResposneDto } from 'src/dto/common.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}
  //loginUser

  async loginUser(loginDto: UserLoginDto): Promise<CommonResposneDto> {
    const { userName, password } = loginDto;
    try {
      const user = await this.dataSource.manager.findOne(User, {
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
          const token: string = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET_KEY,
          });
          return new CommonResposneDto(
            false,
            'You are log in successfully',
            token,
          );
        } else {
          return new CommonResposneDto(true, 'Not able to login you');
        }
      } else {
        return new CommonResposneDto(true, 'Password or username is incorrect');
      }
    } catch (error) {
      console.log(error);
      throw new BadGatewayException('Error occured');
    }
  }
}
