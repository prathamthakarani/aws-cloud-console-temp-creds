import { Inject, Injectable } from '@nestjs/common';
import { CommonResposneDto } from 'src/dto/common.response.dto';
import { QueryDto } from 'src/dto/query.dto';
import { Log } from 'src/entites/audit.log.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}
  //getLogs
  async getLogs(queryDto: QueryDto) {
    const { method, path, userId, userName } = queryDto;
    // const whereObject: FindOptionsWhere;
    // if (method) {
    //   //w
    //   whereObject.method = method;
    // }
    // if (path) {
    //   //
    //   whereObject.path = path;
    // }
    // if (userId) {
    //   //
    //   whereObject.userId = userId;
    // }
    // if (userName) {
    //   //
    //   whereObject.userName = userName;
    // }
    const logsData = await this.dataSource.manager.find(Log, { where: {} });
    return new CommonResposneDto(false, undefined, logsData);
  }
}
