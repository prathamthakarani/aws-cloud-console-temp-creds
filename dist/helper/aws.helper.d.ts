import * as AWS from 'aws-sdk';
export declare class AWSHelper {
    private iam;
    constructor();
    createIAMUserWithKeysAndPolicy(username: any, policy: any, policyName: any): Promise<AWS.IAM.AccessKey>;
    deleteAccessKey(iamUsername: any, accessKeyId: any): Promise<void>;
    createIAMUserForConsole(userName: string, policy: string, isConsoleUser: any, policyName: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    } | "error" | "Some errorr">;
    createConsoleCred(userName: string, policy: string, isConsoleUser: any, policyName: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    } | "error" | "Some errorr">;
    createLoginProfileForConsole(userName: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    }>;
    deleteLoginProfile(userName: string, policy: string, isConsoleUser: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    } | "error">;
    createIAMUser(userName: string, policy: string, isConsoleUser: boolean, policyName: string): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    }>;
    findExistingUser(userName: string): Promise<boolean>;
    deleteConsoleAccess(userName: string, policy: string): Promise<string>;
    generateRandomPassword(length: any): string;
}
