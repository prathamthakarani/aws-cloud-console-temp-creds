import { ApiProperty } from '@nestjs/swagger';
export enum DeleteAction {
  AccessKey = 'access-key',
  ConsoleCreds = 'console-creds',
}

export class DeleteRequestDto {
  @ApiProperty({ enum: DeleteAction })
  action: DeleteAction;
}
