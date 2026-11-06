import { IsNotEmpty, IsNumber, IsString, IsEmail, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSnapTokenDto {
  @ApiProperty({ example: 'zone-1' })
  @IsString()
  @IsNotEmpty()
  zoneId: string;

  @ApiProperty({ example: 'VIP Hospitality Village' })
  @IsString()
  @IsNotEmpty()
  zoneName: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 15000000 })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 'Bastian Ramadhan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'bastian@mototix.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+6281234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'usr-123' })
  @IsOptional()
  @IsString()
  userId?: string;
}
