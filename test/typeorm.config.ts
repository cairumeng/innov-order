import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../src/entity/User';

const typeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'innov-test',
  entities: [User],
  autoLoadEntities: true,
  synchronize: true,
};

export default typeormConfig;
