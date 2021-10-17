import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async create(email: string, password: string): Promise<User> {
    const user = this.usersRepository.create({
      email,
      password,
    });
    return await this.usersRepository.save(user);
  }

  public async findOne(params): Promise<User> {
    return await this.usersRepository.findOne(params);
  }

  public async update(params, attributes) {
    return await this.usersRepository.update(params, attributes);
  }
}
