import { STS } from 'aws-sdk';
import * as AWS from 'aws-sdk';

// AWS.config.update({ region: 'us-east-1' });

AWS.config.update({
  credentials: {
    accessKeyId: 'AKIA5U3C2KXRZEWB6EP4',
    secretAccessKey: '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',
  },
  region: 'us-east-1',
});

const iam = new AWS.IAM();

export class AWSHelper {
  private iam: AWS.IAM;
  private sts: STS;
  constructor() {
    this.sts = new STS();
    this.iam = new AWS.IAM({ apiVersion: '2010-05-08' });
  }
  /**
   * generate aws temporary credentials
   * @param username - IAM username
   * @returns Promise<AWS.STS.Credentials>
   */
  async getCreds(username: string) {
    try {
      console.log('I am here');
      console.log(username);

      const response = await this.sts
        .assumeRole({
          RoleArn: 'arn:aws:iam::938120730083:user/bhavya-patel',
          RoleSessionName: `AssumeRoleSession-${username}`,
        })
        .promise();

      return response.Credentials!;
    } catch (error) {
      throw error;
    }
  }

  async createIAMUserWithKeysAndPolicy(username, policyArn) {
    try {
      // check existance of IAM user
      const findExistingUser = await this.findExistingUser(username);
      if (!findExistingUser) {
        await this.createIAMUser(username, policyArn, undefined);
        console.log('IAM user created');
      }
      const createAccessKeyParams = {
        UserName: username,
      };
      const accessKey = await iam
        .createAccessKey(createAccessKeyParams)
        .promise();
      console.log('Access key created:', accessKey);
      console.log(accessKey.AccessKey);
      return accessKey.AccessKey;
    } catch (error) {
      console.error('Error:', error);
    }
  }

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

  // async createIAMUserWithPermissions(username) {
  //   try {
  //     // Create IAM user
  //     const createUserResponse = await iam
  //       .createUser({ UserName: username })
  //       .promise();
  //     console.log('Created IAM User:', createUserResponse.User);

  //     // Create access key for the user
  //     const createAccessKeyResponse = await iam
  //       .createAccessKey({ UserName: username })
  //       .promise();
  //     console.log('Created Access Key:', createAccessKeyResponse.AccessKey);

  //     // Attach policies to the user (e.g., AmazonS3FullAccess)
  //     const attachPolicyResponse = await iam
  //       .attachUserPolicy({
  //         UserName: username,
  //         PolicyArn: 'arn:aws:iam::aws:policy/AmazonS3FullAccess',
  //       })
  //       .promise();
  //     console.log('Attached Policy:', attachPolicyResponse);

  //     // Print login link for user
  //     console.log(
  //       `Console Login Link: https://<your-aws-account-id>.signin.aws.amazon.com/console`,
  //     );
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  //Create user
  //get user
  // create IAM user
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
        await this.deleteIAMUser(userName, policyArn, isConsoleUser);
        //createUser
        console.log('here as well');
        await this.createIAMUser(userName, policyArn, isConsoleUser);
        return;
      }
      await this.createIAMUser(userName, policyArn, isConsoleUser);
    } catch (error) {
      console.log(error);
      return 'Some errorr';
    }
  }

  // Create console user
  async createConsoleCred(userName: string, policyArn: string, isConsoleUser) {
    try {
      console.log('Hello');
      await this.createIAMUserForConsole(userName, policyArn, isConsoleUser);

      const randomTempPassword = 'randomPassword@123';
      console.log(randomTempPassword);

      const createLoginProfileParams = {
        UserName: userName,
        Password: randomTempPassword,
        PasswordResetRequired: true,
      };

      await this.iam.createLoginProfile(createLoginProfileParams).promise();
      console.log(createLoginProfileParams);
      return createLoginProfileParams;
    } catch (error) {
      console.log(error);
    }
  }

  // delete IAMA user
  async deleteIAMUser(userName: string, policyArn: string, isConsoleUser) {
    try {
      console.log(userName, policyArn);
      if (isConsoleUser) {
        await this.iam.deleteLoginProfile({ UserName: userName }).promise();
        console.log('profile deleted');
      }
      const detachPolicyParams = {
        UserName: userName,
        PolicyArn: policyArn,
      };

      await this.iam.detachUserPolicy(detachPolicyParams).promise();
      console.log(`Detached policy ${policyArn} from user ${userName}`);
      const deleteUserParams = {
        UserName: userName,
      };

      await this.iam.deleteUser(deleteUserParams).promise();
      console.log(`User ${userName} deleted`);
    } catch (err) {
      console.log('Error', err);
      return 'error';
    }
  }
  // async deleteIAMUser(userName: string, isConsoleUser): Promise<void> {
  //   const listAttachedUserPoliciesParams = {
  //     UserName: userName,
  //   };

  //   try {
  //     const listAttachedPoliciesResponse = await this.iam
  //       .listAttachedUserPolicies(listAttachedUserPoliciesParams)
  //       .promise();

  //     for (const policy of listAttachedPoliciesResponse.AttachedPolicies) {
  //       const detachPolicyParams = {
  //         UserName: userName,
  //         PolicyArn: policy.PolicyArn,
  //       };

  //       await this.iam.detachUserPolicy(detachPolicyParams).promise();
  //       console.log(
  //         `Detached policy ${policy.PolicyArn} from user ${userName}`,
  //       );
  //     }

  //     const deleteUserParams = {
  //       UserName: userName,
  //     };

  //     await this.iam.deleteUser(deleteUserParams).promise();
  //     console.log(`User ${userName} deleted`);
  //   } catch (err) {
  //     console.log('Error', err);
  //   }
  // }

  async createIAMUser(userName: string, policyArn: string, isConsoleUser) {
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
      console.log('Policy attatched');
      console.log('Success', createUserResponse);
      const randomTempPassword = 'randomPassword@123';
      console.log(randomTempPassword);

      const createLoginProfileParams = {
        UserName: userName,
        Password: randomTempPassword,
        PasswordResetRequired: true,
      };
      if (isConsoleUser) {
        console.log(' i am not presrent here');
        await this.iam.createLoginProfile(createLoginProfileParams).promise();
        console.log(createLoginProfileParams);
        return createLoginProfileParams;
      }

      // We have to add ts
    } catch (err) {
      console.log('Error', err);
    }
  }

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

  async createOrGetUser(userName: string, policyArn: string): Promise<void> {
    const params = {
      UserName: userName,
    };

    try {
      const data = await this.iam.getUser(params).promise();
      console.log(`User ${userName} already exists`, data.User.UserId);
    } catch (err) {
      if (err.code === 'NoSuchEntity') {
        try {
          const createUserResponse = await this.iam
            .createUser(params)
            .promise();
          console.log('Success', createUserResponse);
          // Attach the specified policy
          const attachPolicyParams = {
            PolicyArn: policyArn,
            UserName: userName,
          };

          await this.iam.attachUserPolicy(attachPolicyParams).promise();
          console.log('Policy attatched');
          const createLoginProfileParams = {
            UserName: userName,
            Password: 'temporaryPasswor56332869358629', // Replace with a secure temporary password
            PasswordResetRequired: true, // User must reset password on first login
          };

          await this.iam.createLoginProfile(createLoginProfileParams).promise();
          console.log(createLoginProfileParams);
          const expirationMinutes = 30;
          // await this.createTemporaryCredentials(
          //   userName,
          //   policyArn,
          //   expirationMinutes,
          // );
        } catch (createErr) {
          console.log('Error', createErr);
        }
      } else {
        console.log('Error', err);
      }
    }
  }

  async createTemporaryCredentials(
    userName: string,
    policyArn: string,
    expirationMinutes: number,
  ): Promise<void> {
    console.log('In the function');

    const assumeRoleParams = {
      RoleSessionName: `TemporarySession-${userName}`,
      DurationSeconds: expirationMinutes * 60, // Expiration in seconds
      RoleArn: policyArn,
    };

    try {
      const assumeRoleResponse = await this.sts
        .assumeRole(assumeRoleParams)
        .promise();
      console.log(
        'Assumed role with temporary credentials',
        assumeRoleResponse,
      );

      // Here you can use assumeRoleResponse.Credentials to work with the temporary credentials
    } catch (err) {
      console.log('Error assuming role', err);
    }
  }
}
