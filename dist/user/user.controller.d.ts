import { UserService } from './user.service';
import { DeleteAction } from 'src/dto/delete.creds.dto';
import { AWSHelper } from 'src/helper/aws.helper';
export declare class UserController {
    private userService;
    private awsHelper;
    constructor(userService: UserService, awsHelper: AWSHelper);
    getCreds(req: any): Promise<import("../dto/common.response.dto").CommonResposneDto>;
    createConsole(req: any): Promise<import("../dto/common.response.dto").CommonResposneDto>;
    deleteAction(action: DeleteAction, req: any): Promise<import("../dto/common.response.dto").CommonResposneDto>;
}
