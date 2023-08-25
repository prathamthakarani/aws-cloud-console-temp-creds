import { DataSource } from 'typeorm';
import { AWSHelper } from 'src/helper/aws.helper';
import { CommonResposneDto } from 'src/dto/common.response.dto';
export declare class UserService {
    private dataSource;
    private awsHelper;
    constructor(dataSource: DataSource, awsHelper: AWSHelper);
    getCreds(userId: number): Promise<CommonResposneDto>;
    createConsoleCreds(userId: number): Promise<CommonResposneDto>;
    deleteAccessKey(userId: any): Promise<CommonResposneDto>;
    deleteConsoleCreds(userId: any): Promise<CommonResposneDto>;
}
