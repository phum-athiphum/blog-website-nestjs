import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';
// src/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-jwt-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.getUserByUsername(payload.username);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
