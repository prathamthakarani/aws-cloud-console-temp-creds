import { Inject } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AuditLog } from 'src/entites/audit.log';
import { DataSource } from 'typeorm';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

const iam = new AWS.IAM();

export class AWSHelper {
  private iam: AWS.IAM;
  constructor(@Inject('DataSource') private dataSource: DataSource) {
    this.iam = new AWS.IAM({ apiVersion: '2010-05-08' });
  }

  /**
   * Create IAM user with access key
   * @param username
   * @param policy
   * @returns
   */
  async createIAMUserWithKeysAndPolicy(username, policy, policyName) {
    try {
      // check existance of IAM user
      const findExistingUser = await this.findExistingUser(username);
      if (!findExistingUser) {
        // If not exist create IAM user
        await this.createIAMUser(username, policy, false, policyName);
        console.log('IAM user created');
      }
      const createAccessKeyParams = {
        UserName: username,
      };
      // Generate access key
      const accessKey = await iam
        .createAccessKey(createAccessKeyParams)
        .promise();
      return accessKey.AccessKey;
    } catch (error) {
      console.error('Error:', error);
      throw new Error(`Error deleting IAM user: ${error.message}`);
    }
  }

  /**
   * Delete access key
   * @param iamUsername
   * @param accessKeyId
   */
  async deleteAccessKey(iamUsername, accessKeyId) {
    try {
      // Delete the access key
      const deleteAccessKeyParams = {
        UserName: iamUsername,
        AccessKeyId: accessKeyId,
      };
      const deleteResponse = await iam
        .deleteAccessKey(deleteAccessKeyParams)
        .promise();
      console.log('Access key deleted:', deleteResponse);
      // Update here as well
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Helper function to createIAM user for console
   * @param userName
   * @param policy
   * @param isConsoleUser
   * @returns
   */
  async createIAMUserForConsole(
    userName: string,
    policy: string,
    isConsoleUser,
    policyName,
  ) {
    try {
      const findExistingUser = await this.findExistingUser(userName);
      console.log(findExistingUser);
      if (findExistingUser) {
        //delete user
        console.log('here');
        return await this.deleteLoginProfile(userName, policy, isConsoleUser);
      }
      return await this.createIAMUser(
        userName,
        policy,
        isConsoleUser,
        policyName,
      );
      // return await this.createLoginProfileForConsole(userName);
    } catch (error) {
      console.log(error);
      return 'Some errorr';
    }
  }

  /**
   * Create IAM user for console
   * @param userName
   * @param policy
   * @param isConsoleUser
   * @returns
   */
  async createConsoleCred(
    userName: string,
    policy: string,
    isConsoleUser,
    policyName,
  ) {
    try {
      const creds = await this.createIAMUserForConsole(
        userName,
        policy,
        isConsoleUser,
        policyName,
      );
      console.log(creds);
      return creds;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Helper function to create login profile
   * @param userName
   * @returns
   */
  async createLoginProfileForConsole(userName) {
    // we have to implement random password here
    const randomTempPassword = this.generateRandomPassword(12);

    const createLoginProfileParams = {
      UserName: userName,
      Password: randomTempPassword,
      PasswordResetRequired: true,
    };

    await this.iam.createLoginProfile(createLoginProfileParams).promise();
    // Login profile created
    return createLoginProfileParams;
  }

  /**
   * Delete login profile and create Login profile on new request
   * @param userName
   * @param policy
   * @param isConsoleUser
   * @returns
   */
  async deleteLoginProfile(userName: string, policy: string, isConsoleUser) {
    try {
      console.log(userName, policy);
      if (isConsoleUser) {
        // I think I have to make return here
        await this.iam.deleteLoginProfile({ UserName: userName }).promise();
        console.log('profile deleted');
      }
    } catch (err) {
      console.log('Error', err);
      return 'error';
    } finally {
      console.log('This is execuited');
      return await this.createLoginProfileForConsole(userName);
    }
  }

  /**
   * Create IAM user helper function
   * @param userName
   * @param policy
   * @param isConsoleUser
   * @returns
   */
  async createIAMUser(
    userName: string,
    policy: string,
    isConsoleUser: boolean,
    policyName: string,
  ) {
    const params = {
      UserName: userName,
    };

    try {
      console.log(policyName, '**********************************');
      const createUserResponse = await this.iam.createUser(params).promise();
      //Update create IAM user
      const attachPolicyParams = {
        PolicyName: policyName,
        PolicyDocument: JSON.stringify(policy),
        UserName: userName,
      };

      await this.iam.putUserPolicy(attachPolicyParams).promise();
      // Update (attatch)policy
      if (isConsoleUser) {
        console.log('This should be not execute');
        return await this.createLoginProfileForConsole(userName);
      }
      console.log('IAM user created');
    } catch (err) {
      console.log('Error', err);
    }
  }

  /**
   * Helper function to create Existing IAM user
   * @param userName
   * @returns
   */
  async findExistingUser(userName: string): Promise<boolean> {
    const params = {
      UserName: userName,
    };

    try {
      const user = await this.iam.getUser(params).promise();
      console.log(user, 'user');
      return true; // User exists
    } catch (err) {
      if (err.code === 'NoSuchEntity') {
        return false; // User does not exist
      } else {
        console.log('Error', err);
      }
    }
  }

  async deleteConsoleAccess(userName: string, policy: string) {
    try {
      console.log(userName, policy);

      // I think I have to make return here
      await this.iam.deleteLoginProfile({ UserName: userName }).promise();
      console.log('profile deleted');
    } catch (err) {
      console.log('Error', err);
      return 'error';
    }
  }

  generateRandomPassword(length) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }

  // async deleteIAMUser(
  //   userName: string,
  //   userpolicy: string,
  //   // arnName: string,
  // ) {
  //   try {
  //     const findExistingUser = await this.findExistingUser(userName);
  //     console.log(findExistingUser);
  //     if (!findExistingUser) {
  //       return 'No user find to delete';
  //     }
  //     // Detach user policy
  //     await this.iam
  //       .detachUserPolicy({ UserName: userName, policy: userpolicy })
  //       .promise();

  //     // Delete the user
  //     await this.iam.deleteUser({ UserName: userName }).promise();
  //   } catch (error) {
  //     throw new Error(`Error deleting IAM user: ${error.message}`);
  //   }
  // }
}
