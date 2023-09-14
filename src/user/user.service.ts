import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/entites';
import { DataSource } from 'typeorm';
import { AWSHelper } from 'src/helper/aws.helper';
import { CommonResposneDto } from 'src/dto/common.response.dto';
import { AuditAction, AuditLog } from 'src/entites/audit.log';

@Injectable()
export class UserService {
  constructor(
    @Inject('DataSource') private dataSource: DataSource,
    private awsHelper: AWSHelper,
  ) {}
  /**
   * Get IAM user creds (access & secret key)
   * @param userId
   * @returns
   */
  async getCreds(userId: number) {
    try {
      const getDataByUserId = await this.dataSource.manager.findOne(User, {
        where: { userId },
      });
      const userName = getDataByUserId.userName;
      const policy = getDataByUserId.policy;
      const policyName = getDataByUserId.policyName;

      if (getDataByUserId?.accessKeyId) {
        await this.awsHelper.deleteAccessKey(
          userName,
          getDataByUserId.accessKeyId,
        );
        await this.dataSource.manager.insert(AuditLog, {
          userId,
          action: AuditAction.CREDS_DELETED,
          actionPerformedBy: userName,
        });
        console.log('access key deleted');
      }
      const creds = await this.awsHelper.createIAMUserWithKeysAndPolicy(
        userName,
        policy,
        policyName,
      );
      const currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() + 30);
      console.log(creds);
      await this.dataSource.manager.update(
        User,
        { userName },
        { credsExpiryTs: currentDate, accessKeyId: creds?.AccessKeyId },
      );
      console.log(creds);
      // Make audit log
      await this.dataSource.manager.insert(AuditLog, {
        userId,
        action: AuditAction.CREDS_CREATED,
        actionPerformedBy: userName,
      });
      return new CommonResposneDto(
        false,
        'Creds generated successfully',
        creds,
      );
    } catch (error) {
      console.log(error);
      throw new BadGatewayException('Not able to process');
    }
  }

  /**
   * Create console creds
   * @param userId
   * @returns
   */
  async createConsoleCreds(userId: number) {
    try {
      const getDataByUserId = await this.dataSource.manager.findOne(User, {
        where: { userId },
      });

      const userName = getDataByUserId.userName;
      // const userName = 'test-user-created';
      const policy = getDataByUserId.policy;
      const policyName = getDataByUserId.policyName;
      const isConsoleUser = true;
      const creds: any = await this.awsHelper.createConsoleCred(
        userName,
        policy,
        isConsoleUser,
        policyName,
      );
      if (creds) {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() + 30);
        console.log(currentDate);
        await this.dataSource.manager.update(
          User,
          { userName },
          { consoleExpiryTs: currentDate },
        );

        creds.accountId = process.env.AWS_ACCOUNT_ID;
      }
      await this.dataSource.manager.insert(AuditLog, {
        userId,
        action: AuditAction.CONSOLE_CREDS_CREATED,
        actionPerformedBy: userName,
      });
      // return creds;
      return new CommonResposneDto(
        false,
        'Creds generated successfully',
        creds,
      );
    } catch (error) {
      throw new BadGatewayException('Not able to process right now');
    }
  }

  /**
   * Function to delete access key
   * @param userId
   * @returns
   */
  async deleteAccessKey(userId, isCron) {
    try {
      const data = await this.dataSource.manager.findOne(User, {
        where: { userId },
      });
      if (!data.accessKeyId) {
        throw new BadRequestException('Access key id not found to delete');
      }
      await this.awsHelper.deleteAccessKey(data.userName, data.accessKeyId);
      await this.dataSource.manager.update(
        User,
        { userId: data.userId },
        { credsExpiryTs: null, accessKeyId: null },
      );
      let actionPerformedBy = data.userName;
      if (isCron) {
        console.log('Is cron', isCron);
        actionPerformedBy = 'cron job';
      }
      await this.dataSource.manager.insert(AuditLog, {
        userId,
        action: AuditAction.CREDS_DELETED,
        actionPerformedBy,
      });
      return new CommonResposneDto(false, 'Creds deleted successfully');
    } catch (error) {
      console.log(error);
      if (error.response.statusCode === 400) {
        throw new BadRequestException(error.response);
      }
      throw new BadGatewayException('Not able to process right now');
    }
  }

  /**
   * Function to delete console creds
   * @param userId
   * @returns
   */
  async deleteConsoleCreds(userId, isCron) {
    try {
      const data = await this.dataSource.manager.findOne(User, {
        where: { userId },
      });
      if (!data.consoleExpiryTs) {
        throw new BadRequestException('Console creds are not found to delete');
      }
      await this.awsHelper.deleteConsoleAccess(data.userName, data.policy);

      await this.dataSource.manager.update(
        User,
        { userId: data.userId },
        { consoleExpiryTs: null },
      );
      let actionPerformedBy = data.userName;
      if (isCron) {
        console.log('Is cron', isCron);
        actionPerformedBy = 'cron job';
      }
      await this.dataSource.manager.insert(AuditLog, {
        userId,
        action: AuditAction.CONSOLE_CREDS_DELETED,
        actionPerformedBy,
      });

      return new CommonResposneDto(false, 'Console creds deleted successfully');
    } catch (error) {
      console.log(error);
      if (error.response.statusCode === 400) {
        throw new BadRequestException(error.response);
      }
      throw new BadGatewayException('Not able to process right now');
    }
  }
}
