import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Register new users
  @Post('register')
  async register(@Body() body: { email: string; password: string; fullName: string; role?: string }) {
    return this.authService.register(body);
  }

  // Login existing users
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
}
