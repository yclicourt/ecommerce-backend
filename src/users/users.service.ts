import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUserItem(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data });
  }

  getAllUserItems() {
    return this.prisma.user.findMany();
  }

  async getUserByEmail(email: string) {
    const userFound = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!userFound) throw new HttpException('User not found', 404);
    return userFound;
  }

  async getUserItem(id: number) {
    const userFound = await this.prisma.user.findUnique({
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
