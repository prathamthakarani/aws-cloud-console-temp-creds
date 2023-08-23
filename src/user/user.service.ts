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
    const creds = await this.awsHelper.getCreds(userName);
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
    const userName = 'bhavya-patel1';
    const creds = await this.awsHelper.createIAMUserWithPermissions(userName);
    console.log(creds);
    console.log(userId);
  }
}
