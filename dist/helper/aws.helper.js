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
    async createIAMUserWithKeysAndPolicy(username, policy, policyName) {
        try {
            const findExistingUser = await this.findExistingUser(username);
            if (!findExistingUser) {
                await this.createIAMUser(username, policy, false, policyName);
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
            throw new Error(`Error deleting IAM user: ${error.message}`);
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
    async createIAMUserForConsole(userName, policy, isConsoleUser, policyName) {
        try {
            const findExistingUser = await this.findExistingUser(userName);
            console.log(findExistingUser);
            if (findExistingUser) {
                console.log('here');
                return await this.deleteLoginProfile(userName, policy, isConsoleUser);
            }
            return await this.createIAMUser(userName, policy, isConsoleUser, policyName);
        }
        catch (error) {
            console.log(error);
            return 'Some errorr';
        }
    }
    async createConsoleCred(userName, policy, isConsoleUser, policyName) {
        try {
            const creds = await this.createIAMUserForConsole(userName, policy, isConsoleUser, policyName);
            console.log(creds);
            return creds;
        }
        catch (error) {
            console.log(error);
        }
    }
    async createLoginProfileForConsole(userName) {
        const randomTempPassword = this.generateRandomPassword(12);
        const createLoginProfileParams = {
            UserName: userName,
            Password: randomTempPassword,
            PasswordResetRequired: true,
        };
        await this.iam.createLoginProfile(createLoginProfileParams).promise();
        return createLoginProfileParams;
    }
    async deleteLoginProfile(userName, policy, isConsoleUser) {
        try {
            console.log(userName, policy);
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
    async createIAMUser(userName, policy, isConsoleUser, policyName) {
        const params = {
            UserName: userName,
        };
        try {
            console.log(policyName, '**********************************');
            const createUserResponse = await this.iam.createUser(params).promise();
            const attachPolicyParams = {
                PolicyName: policyName,
                PolicyDocument: JSON.stringify(policy),
                UserName: userName,
            };
            await this.iam.putUserPolicy(attachPolicyParams).promise();
            if (isConsoleUser) {
                console.log('This should be not execute');
                return await this.createLoginProfileForConsole(userName);
            }
            console.log('IAM user created');
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
            }
        }
    }
    async deleteConsoleAccess(userName, policy) {
        try {
            console.log(userName, policy);
            await this.iam.deleteLoginProfile({ UserName: userName }).promise();
            console.log('profile deleted');
        }
        catch (err) {
            console.log('Error', err);
            return 'error';
        }
    }
    generateRandomPassword(length) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }
        return password;
    }
}
exports.AWSHelper = AWSHelper;
//# sourceMappingURL=aws.helper.js.map