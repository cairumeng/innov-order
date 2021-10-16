import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(email: string, password: string): Promise<User> {
    const user = this.usersRepository.create({
      email,
      password,
    });
    return this.usersRepository.save(user);
  }

  findOne(params): Promise<User> {
    return this.usersRepository.findOne(params);
  }
}
