import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './module/auth/auth.module';
import { ProductsModule } from './module/products/products.module';
import { User } from './entity/User';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      port: parseInt(process.env.DATABASE_PORT),
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: [User],
    }),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
