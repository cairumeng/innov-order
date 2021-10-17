import {
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/entity/User';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { UsersModule } from '../src/module/users/users.module';
import { AuthModule } from '../src/module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { encryptPassword } from '../src/module/auth/helpers/password.helper';
import typeormConfig from './typeorm.config';
import { JwtAuthGuard } from '../src/module/auth/guards/jwt-guard';

let app: INestApplication;
let repository: Repository<User>;

const TOKEN = 'ahkf3hk4af';

beforeAll(async () => {
  const authTestModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot(typeormConfig),
      UsersModule,
      AuthModule,
    ],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        if (!req.headers['authorization']) throw new UnauthorizedException();

        const user = await repository.findOneOrFail({
          email: 'test@gmail.com',
        });

        req.user = user;
        return req.headers['authorization'] === `Bearer ${TOKEN}`;
      },
    })
    .compile();
  repository = authTestModule.get<Repository<User>>('UserRepository');

  app = authTestModule.createNestApplication();
  await app.init();
});

beforeEach(async () => {
  await repository.save([
    { email: 'test@gmail.com', password: await encryptPassword('1234567') },
  ]);
});
afterEach(async () => {
  await repository.query(`DELETE FROM users;`);
});

afterAll(async () => {
  await app.close();
});

describe('POST /signup', () => {
  it('should sucess to create a user', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test2@gmail.com', password: '1234567' })
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      email: 'test2@gmail.com',
      password: expect.any(String),
    });
  });

  it('should fail to sign up when email has been taken', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@gmail.com', password: '1234567' })
      .expect(409);
    expect(body.message).toEqual('This email has already been taken.');
  });

  it('should fail to sign up when email is invalid format', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test', password: '1234567' })
      .expect(400);

    expect(body.message).toEqual(['email must be an email']);
  });

  it('should fail to sign up when password is shorter than 6', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test2@gmail.com', password: '12345' })
      .expect(400);

    expect(body.message).toEqual([
      'Password should not be shorter than 6 characters',
    ]);
  });
});

describe('POST /login', () => {
  it('should return a token when login success', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: '1234567' })
      .expect(201);
    expect(body).toEqual({
      token: expect.any(String),
    });
  });

  it('should fail to login when email not exist', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test2@gmail.com', password: '1234567' })
      .expect(403);
    expect(body.message).toEqual('This email does not exist.');
  });

  it('should throw password not match error when password is not correct', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@gmail.com', password: '12345678' })
      .expect(403);
    expect(body.message).toEqual('The password is not correct.');
  });
});

describe('PATCH /change-password', () => {
  it('should fail when not login', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/auth/change-password')
      .send({ currentPassword: '1234567', newPassword: '123456789' })
      .expect(401);

    expect(body.message).toEqual('Unauthorized');
  });

  it('should success when login', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ currentPassword: '1234567', newPassword: '123456789' })
      .expect(200);
    expect(body.affected).toEqual(1);
  });

  it('should fail when newpassword is shorter than 6', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ currentPassword: '1234567', newPassword: '12345' })
      .expect(400);
    expect(body.message).toEqual([
      'Password should not be shorter than 6 characters',
    ]);
  });

  it('should fail when newpassword is shorter than 6', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ currentPassword: '123459', newPassword: '123456789' })
      .expect(403);
    expect(body.message).toEqual('The password is not correct.');
  });
});
