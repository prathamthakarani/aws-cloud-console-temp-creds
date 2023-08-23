import { Global, Module } from '@nestjs/common';
import { DbConnection } from './db.service';

@Global()
@Module({
  providers: [...DbConnection],
  exports: [...DbConnection],
})
export class DbModule {}
