import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentials } from './interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() credentials: { username: string; password: string },
  ): Promise<LoginCredentials> {
    const { username, password } = credentials;
    return this.authService.login(username, password);
  }
}
