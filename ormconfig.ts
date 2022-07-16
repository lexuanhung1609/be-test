import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'be-test',
  entities: ['dist/**/**/*.entity{ .ts,.js}'],
  synchronize: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',
  migrationsRun: true,
});
