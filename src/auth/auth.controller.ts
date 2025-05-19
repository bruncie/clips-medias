import { Controller, Post, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../users/enuns/role.enum';
import { RolesGuard } from './auth.role.guard';
import { ApiOperation, ApiParam, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({type: LoginUserDto})
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ASSINANTE)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }
}