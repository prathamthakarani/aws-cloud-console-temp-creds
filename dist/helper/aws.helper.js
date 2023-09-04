"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSHelper = void 0;
const AWS = require("aws-sdk");
AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
    region: process.env.AWS_REGION,
});
const iam = new AWS.IAM();
class AWSHelper {
    constructor() {
        this.iam = new AWS.IAM({ apiVersion: '2010-05-08' });
    }
    async createIAMUserWithKeysAndPolicy(username, policyArn) {
        try {
            const findExistingUser = await this.findExistingUser(username);
            if (!findExistingUser) {
                await this.createIAMUser(username, policyArn, false);
                console.log('IAM user created');
            }
            const createAccessKeyParams = {
                UserName: username,
            };
            const accessKey = await iam
                .createAccessKey(createAccessKeyParams)
                .promise();
            return accessKey.AccessKey;
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    async deleteAccessKey(iamUsername, accessKeyId) {
        try {
            const deleteAccessKeyParams = {
                UserName: iamUsername,
                AccessKeyId: accessKeyId,
            };
            const deleteResponse = await iam
                .deleteAccessKey(deleteAccessKeyParams)
                .promise();
            console.log('Access key deleted:', deleteResponse);
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    async createIAMUserForConsole(userName, policyArn, isConsoleUser) {
        try {
            const findExistingUser = await this.findExistingUser(userName);
            console.log(findExistingUser);
            if (findExistingUser) {
                console.log('here');
                return await this.deleteLoginProfile(userName, policyArn, isConsoleUser);
            }
            return await this.createIAMUser(userName, policyArn, isConsoleUser);
        }
        catch (error) {
            console.log(error);
            return 'Some errorr';
        }
    }
    async createConsoleCred(userName, policyArn, isConsoleUser) {
        try {
            const creds = await this.createIAMUserForConsole(userName, policyArn, isConsoleUser);
            console.log(creds);
            return creds;
        }
        catch (error) {
            console.log(error);
        }
    }
    async createLoginProfileForConsole(userName) {
        const randomTempPassword = 'randomPassword@123';
        const createLoginProfileParams = {
            UserName: userName,
            Password: randomTempPassword,
            PasswordResetRequired: true,
        };
        await this.iam.createLoginProfile(createLoginProfileParams).promise();
        return createLoginProfileParams;
    }
    async deleteLoginProfile(userName, policyArn, isConsoleUser) {
        try {
            console.log(userName, policyArn);
            if (isConsoleUser) {
                await this.iam.deleteLoginProfile({ UserName: userName }).promise();
                console.log('profile deleted');
            }
        }
        catch (err) {
            console.log('Error', err);
            return 'error';
        }
        finally {
            console.log('This is execuited');
            return await this.createLoginProfileForConsole(userName);
        }
    }
    async createIAMUser(userName, policyArn, isConsoleUser) {
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
        }
        catch (err) {
            console.log('Error', err);
        }
    }
    async findExistingUser(userName) {
        const params = {
            UserName: userName,
        };
        try {
            const user = await this.iam.getUser(params).promise();
            console.log(user, 'user');
            return true;
        }
        catch (err) {
            if (err.code === 'NoSuchEntity') {
                return false;
            }
            else {
                console.log('Error', err);
                throw err;
            }
        }
    }
    async deleteConsoleAccess(userName, policyArn) {
        try {
            console.log(userName, policyArn);
            await this.iam.deleteLoginProfile({ UserName: userName }).promise();
            console.log('profile deleted');
        }
        catch (err) {
            console.log('Error', err);
            return 'error';
        }
    }
}
exports.AWSHelper = AWSHelper;
//# sourceMappingURL=aws.helper.js.map