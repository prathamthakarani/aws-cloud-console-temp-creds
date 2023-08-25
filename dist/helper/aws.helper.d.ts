import * as AWS from 'aws-sdk';
export declare class AWSHelper {
    private iam;
    constructor();
    createIAMUserWithKeysAndPolicy(username: any, policyArn: any): Promise<AWS.IAM.AccessKey>;
    deleteAccessKey(iamUsername: any, accessKeyId: any): Promise<void>;
    createIAMUserForConsole(userName: string, policyArn: string, isConsoleUser: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    } | "error" | "Some errorr">;
    createConsoleCred(userName: string, policyArn: string, isConsoleUser: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    } | "error" | "Some errorr">;
    createLoginProfileForConsole(userName: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    }>;
    deleteLoginProfile(userName: string, policyArn: string, isConsoleUser: any): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    } | "error">;
    createIAMUser(userName: string, policyArn: string, isConsoleUser: boolean): Promise<{
        UserName: any;
        Password: string;
        PasswordResetRequired: boolean;
    }>;
    findExistingUser(userName: string): Promise<boolean>;
    deleteConsoleAccess(userName: string, policyArn: string): Promise<string>;
}
