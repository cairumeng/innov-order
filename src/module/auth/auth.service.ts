import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entity/User';
import { UpdateResult } from 'typeorm';
import { PasswordDTO } from './dtos/password.dto';
import { UsersService } from '../users/users.service';
import { AuthDTO } from './dtos/auth.dto';
import { EmailTakenError } from './errors/email-taken.error';
import { PasswordDoesntMatchError } from './errors/password-not-match.error';
import { UserNotExistError } from './errors/user-not-exist.error';
import { comparePasswords, encryptPassword } from './helpers/password.helper';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async signUp({ email, password }: AuthDTO): Promise<User> {
    if (await this.existingUser(email)) {
      throw new EmailTakenError();
    }
    const cryptedPassword = await encryptPassword(password);
    return await this.usersService.create(email, cryptedPassword);
  }

  public async login({ email, password }: AuthDTO): Promise<string> {
    const user = await this.existingUser(email);
    if (!user) {
      throw new UserNotExistError();
    }
    if (!(await comparePasswords(password, user.password))) {
      throw new PasswordDoesntMatchError();
    }
    return await this.generateJWT(user);
  }

  public async changePassword(
    user: User,
    { newPassword, currentPassword }: PasswordDTO,
  ): Promise<UpdateResult> {
    if (!(await comparePasswords(currentPassword, user.password))) {
      throw new PasswordDoesntMatchError();
    }
    return await this.usersService.update(
      { id: user.id },
      {
        password: await encryptPassword(newPassword),
      },
    );
  }

  public async generateJWT(user: User): Promise<string> {
    return await this.jwtService.signAsync({ user });
  }

  private async existingUser(email: string): Promise<User> {
    return await this.usersService.findOne({ email });
  }
}
