import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/features/users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  registerUserController(@Body() createAuthDto: CreateUserDto) {
    return this.authService.registerUser(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  loginUserController(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.loginUser(loginAuthDto);
  }
}
