import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { AuditAction } from 'src/entites/audit.log';

export class AuditQueryDto {
  @ApiProperty({
    required: false,
    enum: AuditAction,
    description: 'Audit action for filtering',
  })
  @IsOptional()
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'User ID for filtering',
  })
  @IsOptional()
  userId: number;

  @ApiProperty({
    required: false,
    description: 'Action performed by for filtering',
  })
  @IsOptional()
  actionPerformedBy: string;

  @ApiProperty({
    required: false,
    description: 'Start date for filtering (YYYY-MM-DDTHH:mm:ss)',
    example: '2023-08-01T12:00:00',
    default: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
  })
  @IsDateString()
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    required: false,
    description: 'End date for filtering (YYYY-MM-DDTHH:mm:ss)',
    example: '2023-08-15T18:30:00',
    default: new Date(),
  })
  @IsDateString()
  @IsOptional()
  endDate: Date;

  constructor() {
    this.startDate = new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000);
    this.endDate = new Date();
  }
}
