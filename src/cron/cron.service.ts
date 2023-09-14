import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from 'src/entites';
import { AWSHelper } from 'src/helper/aws.helper';
import { UserService } from 'src/user/user.service';
import { DataSource, LessThan } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private awsHelper: AWSHelper,
    private userService: UserService,
  ) {}
  private readonly logger = new Logger('triggered');

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const currenDate = new Date();

    // Find the data for console creds
    const findConsoleCreds = await this.dataSource.manager.find(User, {
      where: { consoleExpiryTs: LessThan(currenDate) },
    });
    console.log(
      '🚀 ~ file: cron.service.ts:23 ~ CronService ~ handleCron ~ findConsoleCreds:',
      findConsoleCreds,
    );

    // Find the data for find creds
    const findCreds = await this.dataSource.manager.find(User, {
      where: { credsExpiryTs: LessThan(currenDate) },
    });
    console.log(
      '🚀 ~ file: cron.service.ts:25 ~ CronService ~ handleCron ~ findCreds:',
      findCreds,
    );

    // If data exist update it
    if (findConsoleCreds?.length !== 0) {
      for (const item of findConsoleCreds) {
        await this.userService.deleteConsoleCreds(item.userId, true);
      }

      console.log(
        `Removed console access: numbers: ${findConsoleCreds.length}`,
      );
    }

    if (findCreds?.length !== 0) {
      for (const item of findCreds) {
        await this.userService.deleteAccessKey(item.userId, true);
      }

      console.log(`Removed creds access: numbers: ${findCreds.length}`);
    }

    this.logger.log('Cron executed');
  }
}
