import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // load env vars

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [isProd ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [isProd ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],
  ssl: isProd ? { rejectUnauthorized: false } : false,
});
