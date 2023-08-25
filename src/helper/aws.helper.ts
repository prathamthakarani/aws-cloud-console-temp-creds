import * as AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: 'HBiSIYl0OmVOK93ODXUoxHXsKJCX7CR0FzckHCyd',
  },
  region: 'us-east-1',
});

const iam = new AWS.IAM();

export class AWSHelper {
  private iam: AWS.IAM;
  constructor() {
    this.iam = new AWS.IAM({ apiVersion: '2010-05-08' });
  }

  /**
   * Create IAM user with access key
   * @param username
   * @param policyArn
   * @returns
   */
  async createIAMUserWithKeysAndPolicy(username, policyArn) {
    try {
      // check existance of IAM user
      const findExistingUser = await this.findExistingUser(username);
      if (!findExistingUser) {
        // If not exist create IAM user
        await this.createIAMUser(username, policyArn, false);
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
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Helper function to createIAM user for console
   * @param userName
   * @param policyArn
   * @param isConsoleUser
   * @returns
   */
  async createIAMUserForConsole(
    userName: string,
    policyArn: string,
    isConsoleUser,
  ) {
    try {
      const findExistingUser = await this.findExistingUser(userName);
      console.log(findExistingUser);
      if (findExistingUser) {
        //delete user
        console.log('here');
        return await this.deleteLoginProfile(
          userName,
          policyArn,
          isConsoleUser,
        );
      }
      return await this.createIAMUser(userName, policyArn, isConsoleUser);
      // return await this.createLoginProfileForConsole(userName);
    } catch (error) {
      console.log(error);
      return 'Some errorr';
    }
  }

  /**
   * Create IAM user for console
   * @param userName
   * @param policyArn
   * @param isConsoleUser
   * @returns
   */
  async createConsoleCred(userName: string, policyArn: string, isConsoleUser) {
    try {
      const creds = await this.createIAMUserForConsole(
        userName,
        policyArn,
        isConsoleUser,
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
    const randomTempPassword = 'randomPassword@123';

    const createLoginProfileParams = {
      UserName: userName,
      Password: randomTempPassword,
      PasswordResetRequired: true,
    };

    await this.iam.createLoginProfile(createLoginProfileParams).promise();
    return createLoginProfileParams;
  }

  /**
   * Delete login profile and create Login profile on new request
   * @param userName
   * @param policyArn
   * @param isConsoleUser
   * @returns
   */
  async deleteLoginProfile(userName: string, policyArn: string, isConsoleUser) {
    try {
      console.log(userName, policyArn);
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
   * @param policyArn
   * @param isConsoleUser
   * @returns
   */
  async createIAMUser(
    userName: string,
    policyArn: string,
    isConsoleUser: boolean,
  ) {
    const params = {
      UserName: userName,
    };

    try {
      const createUserResponse = await this.iam.createUser(params).promise();
      const attachPolicyParams = {
        PolicyArn: policyArn,
        UserName: userName,
      };

      await this.iam.attachUserPolicy(attachPolicyParams).promise();
      if (isConsoleUser) {
        console.log('This should be not execute');
        return await this.createLoginProfileForConsole(userName);
      }
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
        throw err;
      }
    }
  }

  async deleteConsoleAccess(userName: string, policyArn: string) {
    try {
      console.log(userName, policyArn);

      // I think I have to make return here
      await this.iam.deleteLoginProfile({ UserName: userName }).promise();
      console.log('profile deleted');
    } catch (err) {
      console.log('Error', err);
      return 'error';
    }
  }

  // async deleteIAMUser(
  //   userName: string,
  //   userPolicyArn: string,
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
  //       .detachUserPolicy({ UserName: userName, PolicyArn: userPolicyArn })
  //       .promise();

  //     // Delete the user
  //     await this.iam.deleteUser({ UserName: userName }).promise();
  //   } catch (error) {
  //     throw new Error(`Error deleting IAM user: ${error.message}`);
  //   }
  // }
}
