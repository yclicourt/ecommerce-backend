import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/features/users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  forgotPasswordController(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  resetPasswordController(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
