import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Role } from '../auth/common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private validateRoles(roles: unknown): Role[] {
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
          if (upperRole === 'MANAGER') return Role.MANAGER; // Ejemplo: convertir MANAGER a ADMIN
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

  async createUserItem(data: Prisma.UserCreateInput) {
    const validRoles = this.validateRoles(data.role);
    return await this.prisma.user.create({
      data: {
        ...data,
        role: validRoles,
      },
    });
  }

  getAllUserItems() {
    return this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    const userFound = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return userFound;
  }

  async getUserItem(id: number) {
    const userFound = await this.prisma.user.findUnique({
      omit: {
        password: true,
      },
      where: {
        id,
      },
    });
    if (!userFound) throw new HttpException('User not found', 404);
    return userFound;
  }

  async updateUserItem(id: number, data: Prisma.UserUpdateInput) {
    const userFound = await this.getUserItem(id);
    if (!userFound) throw new HttpException('User not found', 404);

    if (data.email == userFound.email)
      throw new HttpException('User already taken', 400);

    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUserItem(id: number) {
    const userFound = await this.getUserItem(id);
    if (!userFound) throw new HttpException('User not found', 404);
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
