import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  BUSINESS = 'BUSINESS',
  CREDIT = 'CREDIT',
}

export class CreateAccountDto {
  @ApiProperty({ enum: AccountType, example: 'CHECKING' })
  @IsEnum(AccountType)
  accountType!: AccountType;

  @ApiProperty({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialDeposit?: number;
}
