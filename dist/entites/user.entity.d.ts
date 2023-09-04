export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    userId: number;
    userName: string;
    password: string;
    role: UserRole;
    policy: string;
    credsTs: Date;
    consoleTs: Date;
    accessKeyId: string;
    policyName: string;
}
