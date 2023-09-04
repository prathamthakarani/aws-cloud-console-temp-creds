import { Inject, Injectable } from '@nestjs/common';
import { CommonResposneDto } from 'src/dto/common.response.dto';
import { QueryDto } from 'src/dto/query.dto';
import { Log } from 'src/entites/audit.log.entity';
import {
  DataSource,
  FindOptionsWhere,
  ILike,
  LessThan,
  MoreThan,
} from 'typeorm';

@Injectable()
export class AdminService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}
  //getLogs
  async getLogs(queryDto: QueryDto) {
    const { method, path, userId, userName, startDate, endDate } = queryDto;
    const whereObject: FindOptionsWhere<Log> | FindOptionsWhere<Log>[] = {};
    if (method) {
      whereObject.method = ILike(`%${method}%`);
    }
    if (path) {
      whereObject.path = ILike(`%${path}%`);
    }
    if (userId) {
      whereObject.userId = userId as any;
    }
    if (userName) {
      whereObject.userName = ILike(`%${userName}%`);
    }

    if (startDate) {
      whereObject.timestamp = MoreThan(startDate);
    }

    if (endDate) {
      whereObject.timestamp = LessThan(endDate);
    }

    const logsData = await this.dataSource.manager.find(Log, {
      where: whereObject,
    });
    return new CommonResposneDto(false, undefined, logsData);
  }
}
