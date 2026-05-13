import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'demo@ebank.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Demo123!@#' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  ip?: string;
}
