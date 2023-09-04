import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
export declare const DbConnection: {
    provide: string;
    useFactory: () => Promise<DataSource>;
    inject: (typeof ConfigService)[];
}[];
