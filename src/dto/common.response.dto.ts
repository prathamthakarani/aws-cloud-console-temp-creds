import { ApiProperty } from '@nestjs/swagger';

export class CommonResposneDto {
  @ApiProperty({
    description: 'Flag indicating if there is an error',
    example: false,
  })
  isError: boolean;

  @ApiProperty({
    description: 'Optional message describing the response',
    example: 'Success',
  })
  message?: string;

  @ApiProperty({
    description: 'Optional data payload of the response',
    example: {},
  })
  data?: any;

  constructor(isError: boolean, message?: string, data?: any) {
    this.isError = isError;
    this.message = message;
    this.data = data;
  }
}
