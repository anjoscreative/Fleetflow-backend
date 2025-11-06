// src/hardware/face/face.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaceProfile } from './face-profile.entity';
import { FaceService } from '../face.service';
import { FaceController } from '../face.controller';
import { SecurityModule } from 'src/integrations/security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([FaceProfile]), SecurityModule],
  providers: [FaceService],
  controllers: [FaceController],
  exports: [FaceService],
})
export class FaceModule {}
