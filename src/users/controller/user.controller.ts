import { Controller, Post, Body, UseGuards, Get, Put , Request } from '@nestjs/common';
import { UsersService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import { Roles } from '../../common/roles.decorator';
import { Role } from '../enuns/role.enum';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/auth.role.guard';
import { ApiOperation, ApiParam, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.', type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ASSINANTE)
  @Put('update-password')
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    await this.usersService.updatePassword(req.user.userId, updatePasswordDto);
    return { message: 'Senha atualizada com sucesso' };
  }
}