import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from '../enuns/role.enum'

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})

export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;

  @Prop({ type: String, enum: Role, default: Role.NAO_ASSINANTE })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Middleware para criptografar a senha antes de salvar
UserSchema.pre('save', async function (next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });
  
  // Método para comparar senhas
  UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  };