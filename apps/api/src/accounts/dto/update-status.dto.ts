import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  CLOSED = 'CLOSED',
}

export class UpdateStatusDto {
  @ApiProperty({ enum: AccountStatus, example: 'ACTIVE' })
  @IsEnum(AccountStatus)
  status!: AccountStatus;
}
