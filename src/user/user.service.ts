import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
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
  // getCreds
  async getCreds(userId: number) {
    const getDataByUserId = await this.dataSource.manager.findOne(User, {
      where: { userId },
    });
    if (!getDataByUserId) {
      //throe
    }
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
    console.log(creds.AccessKeyId);
    const currentDate = new Date();
    const updateData = await this.dataSource.manager.update(
      User,
      { userName },
      { credsTs: currentDate, accessKeyId: creds.AccessKeyId },
    );
    console.log(creds);
    return new CommonResposneDto(false, 'Creds generated successfully', creds);
  }

  //createConsoleCreds
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
}
