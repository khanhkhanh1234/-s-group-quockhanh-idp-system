import { Injectable } from '@nestjs/common';
import { LoginCredentials } from './interface';

@Injectable()
export class AuthService {
  async login(username: string, password: string): Promise<LoginCredentials> {
    return {
      tokens: [],
    };
  }
}
