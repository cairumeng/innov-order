import {
  CacheModule,
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/entity/User';
import { UsersModule } from '../src/module/users/users.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AuthModule } from '../src/module/auth/auth.module';
import { ProductsModule } from '../src/module/products/products.module';
import axios from 'axios';
import { JwtAuthGuard } from '../src/module/auth/guards/jwt-guard';
import typeormConfig from './typeorm.config';
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

let app: INestApplication;
let repository: Repository<User>;
const TOKEN = 'kdj23k4s';

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot(typeormConfig),
      CacheModule.register({ isGlobal: true }),
      UsersModule,
      AuthModule,
      ProductsModule,
    ],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        if (!req.headers['authorization']) throw new UnauthorizedException();

        return req.headers['authorization'] === `Bearer ${TOKEN}`;
      },
    })
    .compile();
  app = module.createNestApplication();
  await app.init();

  repository = module.get<Repository<User>>('UserRepository');
});

afterAll(async () => {
  await app.close();
});

describe('GET /show', () => {
  it('should fail to get products when not login', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/products/12345')
      .expect(401);
    expect(body.message).toEqual('Unauthorized');
  });

  it('should success to get products when login', async () => {
    const data = {
      code: '12345',
      product: { _id: '12345', generic_name: 'Pâte feuilletée' },
      status: 1,
      status_verbose: 'product found',
    };
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data,
      }),
    );
    const { body } = await request(app.getHttpServer())
      .get('/products/12345')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200);
    expect(body._id).toEqual('12345');
    expect(body.generic_name).toEqual('Pâte feuilletée');
  });

  it('should fail to get products when product not exsit', async () => {
    const data = {
      code: '73',
      status: 0,
      status_verbose: 'no code or invalid code',
    };
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data,
      }),
    );
    const { body } = await request(app.getHttpServer())
      .get('/products/73')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(404);
    expect(body.message).toEqual('Product not found.');
  });

  it('should hit cache when fetch for the second time with same id', async () => {
    const data = {
      code: '12345',
      product: { _id: '12345', generic_name: 'Pâte feuilletée' },
      status: 1,
      status_verbose: 'product found',
    };
    mockAxios.get.mockImplementationOnce(() =>
      Promise.resolve({
        data,
      }),
    );
    for (let i = 0; i <= 1; i++) {
      const { body } = await request(app.getHttpServer())
        .get('/products/12345')
        .set('Authorization', `Bearer ${TOKEN}`)
        .expect(200);
      expect(body._id).toEqual('12345');
      expect(body.generic_name).toEqual('Pâte feuilletée');
    }
  });
});
