import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'src/dto/login.dto';
import { CommonResposneDto } from 'src/dto/common.response.dto';
export declare class AuthService {
    private dataSource;
    private jwtService;
    constructor(dataSource: DataSource, jwtService: JwtService);
    loginUser(loginDto: UserLoginDto): Promise<CommonResposneDto>;
}
