import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
export interface JwtPayload {
  username: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string): Promise<{ access_token: string }> {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    const payload: JwtPayload = {
      username: user.username,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { access_token };
  }
}
