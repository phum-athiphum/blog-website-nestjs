import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userReprository: Repository<User>,
  ) {}
  async getUserById(id: number): Promise<User> {
    return this.userReprository.findOne({
      where: { id },
    });
  }
}
