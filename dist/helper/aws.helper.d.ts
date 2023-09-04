import * as AWS from 'aws-sdk';
import { DataSource } from 'typeorm';
export declare class AWSHelper {
    private dataSource;
    private iam;
    constructor(dataSource: DataSource);
    createIAMUserWithKeysAndPolicy(username: any, policy: any, policyName: any): Promise<AWS.IAM.AccessKey>;
    deleteAccessKey(iamUsername: any, accessKeyId: any): Promise<void>;
    createIAMUserForConsole(userName: string, policy: string, isConsoleUser: any, policyName: any): Promise<"error" | {
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    } | "Some errorr">;
    createConsoleCred(userName: string, policy: string, isConsoleUser: any, policyName: any): Promise<"error" | {
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    } | "Some errorr">;
    createLoginProfileForConsole(userName: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    }>;
    deleteLoginProfile(userName: string, policy: string, isConsoleUser: any): Promise<"error" | {
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    }>;
    createIAMUser(userName: string, policy: string, isConsoleUser: boolean, policyName: string): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    }>;
    findExistingUser(userName: string): Promise<boolean>;
    deleteConsoleAccess(userName: string, policy: string): Promise<string>;
    generateRandomPassword(length: any): string;
}
