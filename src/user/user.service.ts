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
        { credsTs: currentDate, accessKeyId: creds?.AccessKeyId },
      );
      console.log(creds);
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
      if (!getDataByUserId) {
        //throe
      }
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
          { consoleTs: currentDate },
        );

        creds.accountId = process.env.AWS_ACCOUNT_ID;
      }
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
  async deleteAccessKey(userId) {
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
        { credsTs: null, accessKeyId: null },
      );
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
  async deleteConsoleCreds(userId) {
    try {
      const data = await this.dataSource.manager.findOne(User, {
        where: { userId },
      });
      if (!data.consoleTs) {
        throw new BadRequestException('Console creds are not found to delete');
      }
      await this.awsHelper.deleteConsoleAccess(data.userName, data.policy);

      await this.dataSource.manager.update(
        User,
        { userId: data.userId },
        { consoleTs: null },
      );

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
