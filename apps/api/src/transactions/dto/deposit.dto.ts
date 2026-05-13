import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 'account-uuid-here' })
  @IsString()
  accountId!: string;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ example: 'Salary deposit', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
