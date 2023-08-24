import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IoTEvents } from 'aws-sdk';
import { User } from 'src/entites';
import { AWSHelper } from 'src/helper/aws.helper';
import { DataSource } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private awsHelper: AWSHelper,
  ) {}
  private readonly logger = new Logger('triggered');

  //   @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    //Find entry on database which contains the credsTs created befor 30 mins
    const findConsoleCreds = await this.dataSource.manager.find(User);
    const findCreds = await this.dataSource.manager.find(User);

    if (findConsoleCreds) {
      //lopp
      findConsoleCreds.forEach((item) => {
        // deactivate his creds, we have to use await here
        this.awsHelper.deleteConsoleAccess(item.userName, item.arn);
        this.dataSource.manager.update(
          User,
          { userId: item.userId },
          { consoleTs: null },
        );
      });
      console.log(`Removed console access number: ${findConsoleCreds.length}`);
    }

    if (findCreds) {
      //loop
      findCreds.forEach((item) => {
        // deactivate his creds, we have to use await here
        this.awsHelper.deleteAccessKey(item.userName, item.accessKeyId);
        this.dataSource.manager.update(
          User,
          { userId: item.userId },
          { credsTs: null },
        );
      });
      console.log(`Removed console access number: ${findCreds.length}`);
    }
  }
}
