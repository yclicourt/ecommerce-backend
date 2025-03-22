import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser({ address, email, password }: CreateAuthDto) {
    const user = await this.userService.getUserByEmail(email);

    if (user) throw new HttpException('User already exists', 400);

    return await this.userService.createUserItem({
      address,
      email,
      password: await bcryptjs.hash(password, 10),
    });
  }

  async loginUser({ email, password }: LoginAuthDto) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new HttpException('Invalid Credentials', 401);
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) throw new HttpException('Invalid Credentials', 401);

    const payload = { email: user.email };

    return {
      token: await this.jwtService.signAsync(payload),
      email,
    };
  }
}
