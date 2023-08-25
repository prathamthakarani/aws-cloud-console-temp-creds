import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/dto/login.dto';
import { CommonResposneDto } from 'src/dto/common.response.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    loginCustomer(loginDto: UserLoginDto): Promise<CommonResposneDto>;
}
