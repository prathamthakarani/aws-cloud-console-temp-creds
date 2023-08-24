import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { AWSHelper } from 'src/helper/aws.helper';

@Module({
  providers: [CronService, AWSHelper],
})
export class CronModule {}
