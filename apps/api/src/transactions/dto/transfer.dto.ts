import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: 'from-account-uuid' })
  @IsString()
  fromAccountId!: string;

  @ApiProperty({ example: 'to-account-uuid' })
  @IsString()
  toAccountId!: string;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ example: 'Payment for services', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
