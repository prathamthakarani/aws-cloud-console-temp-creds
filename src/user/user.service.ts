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
    const getDataByUserId = await this.dataSource.manager.findOne(User, {
      where: { userId },
    });
    const userName = getDataByUserId.userName;
    const policyArn = getDataByUserId.arn;

    if (getDataByUserId?.accessKeyId) {
      console.log(' i am here in the secont attempt');
      this.awsHelper.deleteAccessKey(userName, getDataByUserId.accessKeyId);
      console.log('access key deleted');
    }
    const creds = await this.awsHelper.createIAMUserWithKeysAndPolicy(
      userName,
      policyArn,
    );
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    await this.dataSource.manager.update(
      User,
      { userName },
      { credsTs: currentDate, accessKeyId: creds.AccessKeyId },
    );
    console.log(creds);
    return new CommonResposneDto(false, 'Creds generated successfully', creds);
  }

  //createConsoleCreds
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
      const policyArn = getDataByUserId.arn;
      const isConsoleUser = true;
      const creds = await this.awsHelper.createConsoleCred(
        userName,
        policyArn,
        isConsoleUser,
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
        console.log('Time updated');
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

  // // Function to delete access key or console-creds
  // //deleteAccessKey
  // async deleteAccessKey(userId) {
  //   const data = await this.dataSource.manager.findOne(User, {
  //     where: { userId },
  //   });
  //   if (!data.accessKeyId) {
  //     throw new BadRequestException('Access key id not found to delete');
  //   }
  //   await this.awsHelper.deleteAccessKey(data.userName, data.accessKeyId);
  //   await this.dataSource.manager.update(
  //     User,
  //     { userId: data.userId },
  //     { credsTs: null, accessKeyId: null },
  //   );
  //   return new CommonResposneDto(false, 'Creds deleted successfully');
  // }

  // //deleteConsoleCreds
  // async deleteConsoleCreds(userId) {
  //   const data = await this.dataSource.manager.findOne(User, {
  //     where: { userId },
  //   });
  // }
}
