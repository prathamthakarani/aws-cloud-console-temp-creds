import { Inject, Injectable } from '@nestjs/common';
import { CommonResposneDto } from 'src/dto/common.response.dto';
import { Log } from 'src/entites/audit.log.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}
  //getLogs
  async getLogs() {
    const logsData = await this.dataSource.manager.find(Log);
    return new CommonResposneDto(false, undefined, logsData);
  }
}
