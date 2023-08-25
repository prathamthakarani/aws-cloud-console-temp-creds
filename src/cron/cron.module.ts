import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { AWSHelper } from 'src/helper/aws.helper';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [CronService, AWSHelper, UserService],
})
export class CronModule {}
