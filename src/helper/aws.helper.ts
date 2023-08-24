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

  async createIAMUserWithPermissions(username) {
    try {
      // Create IAM user
      const createUserResponse = await iam
        .createUser({ UserName: username })
        .promise();
      console.log('Created IAM User:', createUserResponse.User);

      // Create access key for the user
      const createAccessKeyResponse = await iam
        .createAccessKey({ UserName: username })
        .promise();
      console.log('Created Access Key:', createAccessKeyResponse.AccessKey);

      // Attach policies to the user (e.g., AmazonS3FullAccess)
      const attachPolicyResponse = await iam
        .attachUserPolicy({
          UserName: username,
          PolicyArn: 'arn:aws:iam::aws:policy/AmazonS3FullAccess',
        })
        .promise();
      console.log('Attached Policy:', attachPolicyResponse);

      // Print login link for user
      console.log(
        `Console Login Link: https://<your-aws-account-id>.signin.aws.amazon.com/console`,
      );
    } catch (error) {
      console.error('Error:', error);
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
          await this.createTemporaryCredentials(
            userName,
            policyArn,
            expirationMinutes,
          );
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
    // const policy = {
    //   Version: '2012-10-17',
    //   Statement: [
    //     {
    //       Effect: 'Allow',
    //       Action: [
    //         'iam:*',
    //         'organizations:DescribeAccount',
    //         'organizations:DescribeOrganization',
    //         'organizations:DescribeOrganizationalUnit',
    //         'organizations:DescribePolicy',
    //         'organizations:ListChildren',
    //         'organizations:ListParents',
    //         'organizations:ListPoliciesForTarget',
    //         'organizations:ListRoots',
    //         'organizations:ListPolicies',
    //         'organizations:ListTargetsForPolicy',
    //       ],
    //       Resource: '*',
    //     },
    //   ],
    // };

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
