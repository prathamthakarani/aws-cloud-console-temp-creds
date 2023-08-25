import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class QueryDto {
  @ApiProperty({ required: false, description: 'Username for filtering' })
  @IsOptional()
  userName: string;

  @ApiProperty({ required: false, description: 'User ID for filtering' })
  @IsOptional()
  userId: number;

  @ApiProperty({
    required: false,
    description: 'HTTP method for filtering',
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
  })
  @IsOptional()
  method: string;

  @ApiProperty({ required: false, description: 'URL path for filtering' })
  @IsOptional()
  path: string;

  @ApiProperty({
    required: false,
    description: 'Start date for filtering (YYYY-MM-DDTHH:mm:ss)',
    example: '2023-08-01T12:00:00',
  })
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    required: false,
    description: 'End date for filtering (YYYY-MM-DDTHH:mm:ss)',
    example: '2023-08-15T18:30:00',
  })
  @IsOptional()
  @IsDateString()
  endDate: Date;
}
