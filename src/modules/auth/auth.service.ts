import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from './common/enums/role.enum';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser({ address, email, password, role }: CreateAuthDto) {
    const user = await this.userService.getUserByEmail(email);

    if (user) throw new HttpException('User already exists', 400);

    await this.userService.createUserItem({
      address,
      email,
      password: await bcryptjs.hash(password, 10),
      role,
    });

    return {
      address,
      email,
      role,
    };
  }

  async loginUser({ email, password }: LoginAuthDto) {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) throw new HttpException('Invalid Credentials', 401);

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) throw new HttpException('Invalid Credentials', 401);

      const userRoles = this.validateAndNormalizeRoles(user.role);

      const payload: JwtPayload = {
        email: user.email,
        roles: userRoles,
      };

      return {
        token: await this.jwtService.signAsync(payload),
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
          if (upperRole === 'MANAGER') return Role.MANAGER;
          if (upperRole === 'GUEST') return Role.GUEST;
          if (upperRole === 'ADMIN') return Role.ADMIN;

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
}
