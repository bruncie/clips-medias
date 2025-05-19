import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    
    // Verifica se já existe um usuário com o email fornecido
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }
    
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<User> {
    const { oldPassword, newPassword } = updatePasswordDto;
  
    const user = await this.findById(userId);

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Não foi possível atualizar os dados do usuário');
    }

    user.password = newPassword;
    user.updatedAt = new Date();

    return user.save();
  }
}