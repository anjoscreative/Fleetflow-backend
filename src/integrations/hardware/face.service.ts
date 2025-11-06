import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaceProfile } from './face/face-profile.entity';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FaceService {
  constructor(
    @InjectRepository(FaceProfile)
    private readonly faceRepo: Repository<FaceProfile>,
  ) {}

  // Save new face profile
  async registerFace(name: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image uploaded');

    // Save the image locally
    const folder = path.join(__dirname, '../../../uploads/faces');
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    const filePath = path.join(folder, `${Date.now()}_${file.originalname}`);
    fs.writeFileSync(filePath, file.buffer);

    // Hash the image as a fake "encoding"
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    const profile = this.faceRepo.create({
      name,
      imageUrl: filePath,
      encodingHash: fileHash,
    });

    return await this.faceRepo.save(profile);
  }

  // Verify if a scanned face matches stored profile
  async verifyFace(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image provided');

    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const profiles = await this.faceRepo.find();

    const match = profiles.find((p) => p.encodingHash === fileHash);

    if (match) return { verified: true, profile: match };
    else return { verified: false, message: 'Face not recognized' };
  }
}
