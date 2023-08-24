import { ConfigService } from '@nestjs/config';
import { User } from 'src/entites';
import { Log } from 'src/entites/audit.log.entity';
import { DataSource } from 'typeorm';

export const DbConnection = [
  {
    provide: 'DataSource',
    useFactory: async () => {
      const datasource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        entities: [User, Log],
        logging: true,
      });
      const db = await datasource.initialize();
      console.log('Connected with', process.env.DB_PORT);
      return db;
    },
    inject: [ConfigService],
  },
];
