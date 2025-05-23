import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Role } from '../auth/common/enums/role.enum';
import { Status } from './common/enums/status.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Method to validate roles
  private validateRoles(roles: unknown): Role[] {
    // If roles is undefined or null, return the default value
    if (!roles) {
      return [Role.USER];
    }

    // Verify if roles is an array
    if (!Array.isArray(roles)) {
      throw new Error('Formato de roles inválido: debe ser un array');
    }

    // Normalized roles to ensure they are in the correct format
    const normalizedRoles = roles
      .map((role) => {
        if (typeof role === 'string') {
          const upperRole = role.toUpperCase().trim();

          // For example, if the role is 'admin' or 'user', convert it to 'ADMIN' or 'USER'
          if (upperRole === 'ADMIN') return Role.ADMIN;
          if (upperRole === 'USER') return Role.USER;

          // Verify if the role is a valid enum value
          if (Object.values(Role).includes(upperRole as Role)) {
            return upperRole as Role;
          }
        }
        return null;
      })
      .filter((role): role is Role => role !== null);

    // If there are no valid roles, return the default value
    if (normalizedRoles.length === 0) {
      return [Role.USER];
    }

    return normalizedRoles;
  }

  // Method to update user status
  async updateUserStatus(
    userId: number,
    data: { status: Status; lastLogin: Date },
  ) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: data.status,
        lastLogin: data.lastLogin,
      },
    });
  }
  // Method to create a user
  async createUserItem(data: Prisma.UserCreateInput) {
    const validRoles = this.validateRoles(data.role);
    return await this.prisma.user.create({
      data: {
        ...data,
        role: validRoles,
      },
    });
  }

  // Method to get all users

  getAllUserItems() {
    return this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
  }

  // Method to get a user by email
  async getUserByEmail(email: string) {
    const userFound = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return userFound;
  }

  // Method to get a user by id
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

  // Method to update a user
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

  // Method to delete a user

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
