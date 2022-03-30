import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  email: string;
}
