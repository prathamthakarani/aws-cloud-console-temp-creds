import { AWSHelper } from 'src/helper/aws.helper';
import { UserService } from 'src/user/user.service';
import { DataSource } from 'typeorm';
export declare class CronService {
    private dataSource;
    private awsHelper;
    private userService;
    constructor(dataSource: DataSource, awsHelper: AWSHelper, userService: UserService);
    private readonly logger;
    handleCron(): Promise<void>;
}
