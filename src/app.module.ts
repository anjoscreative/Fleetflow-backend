import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'), // read from .env
        autoLoadEntities: true, // automatically loads entities registered in any module
        synchronize: true, // ❗ only for dev — auto-creates tables from entities
        dropSchema: true,
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false, // Neon requires SSL in production
      }),
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [HealthController, UserController],
})
export class AppModule {}
