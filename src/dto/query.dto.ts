import { IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  userName: string;

  @IsOptional()
  userId: number;

  // Enum is good here
  @IsOptional()
  method: string;

  @IsOptional()
  path: string;
}
