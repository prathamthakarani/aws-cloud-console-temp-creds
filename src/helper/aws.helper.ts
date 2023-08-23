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
  private sts: STS;
  constructor() {
    this.sts = new STS();
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
}
