import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../generated/prisma/client.js';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
