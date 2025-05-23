import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from './common/enums/role.enum';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/integrations/mail/mail.service';
import { Status } from '../users/common/enums/status.enum';
import { RegisterUserPayload } from './interfaces/register-user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async registerUser({
    address,
    email,
    password,
    phone,
    name,
    lastname,
    avatar,
  }: RegisterUserPayload) {
    const user = await this.userService.getUserByEmail(email);

    if (user) throw new HttpException('User already exists', 400);

    await this.userService.createUserItem({
      address,
      name,
      lastname,
      email,
      phone,
      password: await bcryptjs.hash(password, 10),
      avatar,
    });
    return {
      address,
      email,
    };
  }

  async loginUser({ email, password }: LoginAuthDto) {
    try {
      // Verify if user exists
      const user = await this.userService.getUserByEmail(email);
      if (!user) throw new HttpException('Invalid Credentials', 401);

      // Only reject if the user has a previous login and was marked as inactive
      if (user.status === 'INACTIVE' && user.lastLogin === null) {
        throw new HttpException('Account is not active', 401);
      }

      // Verify if user is same as the one in the database
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) throw new HttpException('Invalid Credentials', 401);

      // Update status to ACTIVE
      await this.userService.updateUserStatus(user.id, {
        status: Status.ACTIVE,
        lastLogin: new Date(),
      });

      // Getting user roles
      const userRoles = this.validateAndNormalizeRoles(user.role);

      // Payload for JWT
      const payload: JwtPayload = {
        email: user.email,
        roles: userRoles,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, createdAt: __, updatedAt: ___, ...safeUser } = user;
      return {
        token: await this.jwtService.signAsync(payload),
        user: safeUser,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('Authentication error');
    }
  }

  private validateAndNormalizeRoles(roles: unknown): Role[] {
    // Si roles es undefined o null, devolver el valor por defecto
    if (!roles) {
      return [Role.USER];
    }

    // Asegurarse que es un array
    if (!Array.isArray(roles)) {
      throw new Error('Formato de roles inválido: debe ser un array');
    }

    // Normalizar roles
    const normalizedRoles = roles
      .map((role) => {
        if (typeof role === 'string') {
          const upperRole = role.toUpperCase().trim();

          // Manejar posibles discrepancias de nombres
          if (upperRole === 'ADMIN') return Role.ADMIN;
          if (upperRole === 'USER') return Role.USER;

          // Verificar contra el enum
          if (Object.values(Role).includes(upperRole as Role)) {
            return upperRole as Role;
          }
        }
        return null;
      })
      .filter((role): role is Role => role !== null);

    // Si no hay roles válidos, devolver el valor por defecto
    if (normalizedRoles.length === 0) {
      return [Role.USER];
    }

    return normalizedRoles;
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    // 1. Verificar si el usuario existe
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // 2. Generar token de reseteo
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora de expiración

    // 3. Guardar token en la base de datos
    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 4. Enviar email con el link de reseteo
    const resetUrl = `${this.configService.get<string>('ORIGIN_CLIENT')}/reset-password?token=${resetToken}`;
    try {
      await this.mailService.sendPasswordResetEmail(
        email,
        user.name || 'User',
        resetUrl,
      );
      return { message: 'Password reset link sent to your email' };
    } catch (error) {
      console.error(`Error al enviar email a ${email}:`, error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    // 1. Buscar usuario por token
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token no ha expirado
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    // 2. Hashear la nueva contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // 3. Actualizar usuario
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password updated successfully' };
  }
}
