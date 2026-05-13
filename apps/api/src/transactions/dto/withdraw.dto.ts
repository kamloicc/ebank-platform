import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: 'account-uuid-here' })
  @IsString()
  accountId!: string;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ example: 'ATM withdrawal', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
