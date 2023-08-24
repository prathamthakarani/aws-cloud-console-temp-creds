import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entites';
import { DataSource } from 'typeorm';
import { AWSHelper } from 'src/helper/aws.helper';
// import awsHelper from 'src/helper/aws.helper';

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
    // const userName = getDataByUserId.userName;
    const userName = 'bhavya-patel';
    const policyArn = 'arn:aws:iam::aws:policy/IAMFullAccess';
    const expirationMinutes = 30;
    const creds = await this.awsHelper.createTemporaryCredentials(
      userName,
      policyArn,
      expirationMinutes,
    );
    console.log(creds);
    console.log(userId);
  }

  //createConsoleCreds
  async createConsoleCreds(userId: number) {
    const getDataByUserId = await this.dataSource.manager.findOne(User, {
      where: { userId },
    });
    if (!getDataByUserId) {
      //throe
    }
    // const userName = getDataByUserId.userName;
    const userName = 'parth-patel-123';
    const policyArn = 'arn:aws:iam::aws:policy/IAMFullAccess';
    // const creds = await this.awsHelper.createIAMUserWithPermissions(userName);
    //createOrGetUser
    const creds = await this.awsHelper.createOrGetUser(userName, policyArn);
    console.log(creds);
    console.log(userId);
  }
}
