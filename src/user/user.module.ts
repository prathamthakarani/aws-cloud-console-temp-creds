import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AWSHelper } from 'src/helper/aws.helper';

@Module({
  controllers: [UserController],
  providers: [UserService, AWSHelper],
  exports: [UserService],
})
export class UserModule {}
