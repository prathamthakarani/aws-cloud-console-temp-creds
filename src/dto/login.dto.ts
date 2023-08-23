import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}
