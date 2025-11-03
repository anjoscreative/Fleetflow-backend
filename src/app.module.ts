import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { DriverModule } from './driver/driver.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ShipmentModule } from './shipment/shipment.module';
// import { RedisModule } from './redis/redis.module';

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
        synchronize: false, // ❗ only for dev — auto-creates tables from entities
        // dropSchema: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: true,

        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false, // Neon requires SSL in production
      }),
    }),
    TypeOrmModule.forFeature([User]),
    VehicleModule,
    AuthModule,
    DriverModule,
    WarehouseModule,
    ShipmentModule,
  ],
  controllers: [HealthController, UserController],
})
export class AppModule {}
