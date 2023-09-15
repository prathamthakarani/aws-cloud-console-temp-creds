import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { AuditQueryDto } from 'src/dto/audit.log.dto';
import { CommonResposneDto } from 'src/dto/common.response.dto';
import { QueryDto } from 'src/dto/query.dto';
import { AuditAction, AuditLog } from 'src/entites/audit.log';
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
  // async getLogs(queryDto: QueryDto) {
  //   const { method, path, userId, userName, startDate, endDate } = queryDto;
  //   const whereObject: FindOptionsWhere<Log> | FindOptionsWhere<Log>[] = {};
  //   if (method) {
  //     whereObject.method = ILike(`%${method}%`);
  //   }
  //   if (path) {
  //     whereObject.path = ILike(`%${path}%`);
  //   }
  //   if (userId) {
  //     whereObject.userId = userId as any;
  //   }
  //   if (userName) {
  //     whereObject.userName = ILike(`%${userName}%`);
  //   }

  //   if (startDate) {
  //     whereObject.timestamp = MoreThan(startDate);
  //   }

  //   if (endDate) {
  //     whereObject.timestamp = LessThan(endDate);
  //   }

  //   const logsData = await this.dataSource.manager.find(Log, {
  //     where: whereObject,
  //   });
  //   return new CommonResposneDto(false, undefined, logsData);
  // }
  /**
   * Get all audit logs
   * @param queryDto
   * @returns
   */
  async getLogs(queryDto: AuditQueryDto) {
    try {
      console.log('Hey its here');
      const { userId, startDate, endDate, action, actionPerformedBy } =
        queryDto;
      console.log(action, actionPerformedBy);
      const whereObject: any = {};

      // Filter by action performed by
      if (actionPerformedBy) {
        whereObject.actionPerformedBy = ILike(`%${actionPerformedBy}%`);
      }

      // Filter by action enum which is set
      if (action) {
        whereObject.action = action;
      }

      // Find user by it's user Id
      if (userId) {
        whereObject.userId = userId as any;
      }

      // Filter by provide simple start date
      if (startDate) {
        whereObject.timestamp = MoreThan(startDate);
      }

      // Filter by providing the end date
      if (endDate) {
        whereObject.timestamp = LessThan(endDate);
      }

      // Find the selected data from AuditLog entity
      const logsData = await this.dataSource.manager.find(AuditLog, {
        where: whereObject,
        relations: { user: true },
        select: {
          action: true,
          actionPerformedBy: true,
          timestamp: true,
          id: true,
          user: {
            userId: true,
            userName: true,
            policy: true,
            credsExpiryTs: true,
            consoleExpiryTs: true,
            policyName: true,
          },
        },
      });
      return new CommonResposneDto(false, undefined, logsData);
    } catch (error) {
      console.log(error);
      throw new BadGatewayException('Not able to fetch audit logs');
    }
  }
}
