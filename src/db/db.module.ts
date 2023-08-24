import { Global, Module } from '@nestjs/common';
import { DbConnection } from './db.service';
import { LogService } from './log.service';

@Global()
@Module({
  providers: [...DbConnection, LogService],
  exports: [...DbConnection, LogService],
})
export class DbModule {}
