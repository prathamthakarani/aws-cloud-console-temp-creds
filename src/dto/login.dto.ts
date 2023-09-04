import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiProperty({ description: 'Username of the user', example: 'john_doe' })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'Password for authentication',
    example: 'secretpassword',
  })
  @IsNotEmpty()
  password: string;
}
