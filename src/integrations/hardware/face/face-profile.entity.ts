import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class FaceProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // store path to image or encoded data
  @Column({ nullable: true })
  imageUrl: string;

  // store face encoding hash (not raw image)
  @Column({ type: 'text', nullable: true })
  encodingHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
