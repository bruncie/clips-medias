// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/service/user.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private activeTokens: Map<string, string> = new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && await (user as any).comparePassword(password)) {  //TODO: Verificar se está funcionando corretamente
        if (user.active) {
          return user;
        } else {
          throw new UnauthorizedException('Usuário inativo');
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    
    // Armazenar token ativo
    this.activeTokens.set(user.id, token);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    this.activeTokens.delete(userId);
    return { message: 'Logout realizado com sucesso' };
  }

  isTokenActive(userId: string, token: string): boolean {
    return this.activeTokens.get(userId) === token;
  }
}