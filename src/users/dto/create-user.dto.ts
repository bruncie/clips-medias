import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../enuns/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role = Role.NAO_ASSINANTE;
}