export declare enum DeleteAction {
    AccessKey = "access-key",
    ConsoleCreds = "console-creds"
}
export declare class DeleteRequestDto {
    action: DeleteAction;
}
